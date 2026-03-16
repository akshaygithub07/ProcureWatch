'use strict';

const { Contract } = require('fabric-contract-api');

class BiddingContract extends Contract {

    // Helper function to check if caller is a buyer (Org1)
    _isBuyer(ctx) {
        const mspId = ctx.clientIdentity.getMSPID();
        return mspId === 'Org1MSP';
    }

    // Helper function to check if caller is a supplier
    _isSupplier(ctx) {
        const mspId = ctx.clientIdentity.getMSPID();
        return mspId === 'Org2MSP' ;
    }

    // Helper function to check if caller is auditor (Org4)
    _isAuditor(ctx) {
        const mspId = ctx.clientIdentity.getMSPID();
        return mspId === 'Org3MSP';
    }

    // Helper to get caller info
    _getCallerInfo(ctx) {
        return {
            id: ctx.clientIdentity.getID(),
            mspId: ctx.clientIdentity.getMSPID()
        };
    }

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }

    // ONLY BUYERS (Org1) can create tenders
    async createTender(ctx, tenderId, description, minAmount, maxAmount, deadline) {
        console.info(`Creating tender: ${tenderId}`);

        // ACCESS CONTROL: Only buyers can create tenders
        if (!this._isBuyer(ctx)) {
            throw new Error('Access Denied: Only Buyer organization can create tenders');
        }

        if (!tenderId || !description) {
            throw new Error('TenderId and description are required');
        }

        if (!minAmount || !maxAmount || isNaN(minAmount) || isNaN(maxAmount)) {
            throw new Error('Valid minAmount and maxAmount are required');
        }

        if (parseFloat(minAmount) > parseFloat(maxAmount)) {
            throw new Error('minAmount cannot be greater than maxAmount');
        }

        const exists = await this.tenderExists(ctx, tenderId);
        if (exists) {
            throw new Error(`Tender ${tenderId} already exists`);
        }

        const txTimestamp = ctx.stub.getTxTimestamp();
        const createdAt = new Date(txTimestamp.seconds * 1000).toISOString();

        const clientIdentity = ctx.clientIdentity;
        const creator = clientIdentity.getID();
        const creatorMSP = clientIdentity.getMSPID();

        const tender = {
            tenderId,
            description,
            minAmount: parseFloat(minAmount),
            maxAmount: parseFloat(maxAmount),
            deadline: deadline || null,
            status: 'OPEN',
            bids: [],
            creator,
            creatorMSP,
            createdAt,
            awardedTo: null,
            awardedAt: null
        };

        await ctx.stub.putState(tenderId, Buffer.from(JSON.stringify(tender)));

        await this._createAuditLog(ctx,
            "TENDER_CREATED",
            "TENDER",
            tenderId,
            { description, minAmount, maxAmount }
);
        ctx.stub.setEvent('TenderCreated', Buffer.from(JSON.stringify(tender)));
        
        console.info(`Tender ${tenderId} created successfully`);
        return tender;
    }

    // ONLY SUPPLIERS (Org2, Org3) can submit bids
    async submitBid(ctx, tenderId, amount, proposal) {
        console.info(`Submitting bid for tender: ${tenderId}`);
        const txTimestamp = ctx.stub.getTxTimestamp();
        const submittedAt = new Date(txTimestamp.seconds * 1000).toISOString();


        // ACCESS CONTROL: Only suppliers can submit bids
        if (!this._isSupplier(ctx)) {
            throw new Error('Access Denied: Only Supplier organizations can submit bids');
        }

        if (!tenderId || !amount) {
            throw new Error('TenderId and amount are required');
        }

        if (isNaN(amount) || parseFloat(amount) <= 0) {
            throw new Error('Bid amount must be a positive number');
        }

        const tenderBytes = await ctx.stub.getState(tenderId);
        if (!tenderBytes || tenderBytes.length === 0) {
            throw new Error(`Tender ${tenderId} does not exist`);
        }

        const tender = JSON.parse(tenderBytes.toString());

        if (tender.status !== 'OPEN') {
            throw new Error(`Tender ${tenderId} is not open for bidding. Current status: ${tender.status}`);
        }

        if (tender.deadline) {
            const now = new Date(txTimestamp.seconds * 1000).toISOString();
            const deadline = new Date(tender.deadline);
            if (now > deadline) {
                throw new Error(`Tender ${tenderId} deadline has passed`);
            }
        }

        const bidAmount = parseFloat(amount);
        if (bidAmount < tender.minAmount || bidAmount > tender.maxAmount) {
            throw new Error(`Bid amount must be between ${tender.minAmount} and ${tender.maxAmount}`);
        }

        const clientIdentity = ctx.clientIdentity;
        const supplier = clientIdentity.getID();
        const supplierMSP = clientIdentity.getMSPID();

        const existingBid = tender.bids.find(bid => bid.supplier === supplier);
        if (existingBid) {
            throw new Error(`Supplier ${supplier} has already submitted a bid for this tender`);
        }


        const bid = {
            supplier,
            supplierMSP,
            amount: bidAmount,
            proposal: proposal || '',
            submittedAt,
            status: 'PENDING'
        };

        tender.bids.push(bid);
        await ctx.stub.putState(tenderId, Buffer.from(JSON.stringify(tender)));

        await this._createAuditLog(ctx,
    "BID_SUBMITTED",
    "BID",
    tenderId,
    { supplier, amount: bidAmount }
);
        ctx.stub.setEvent('BidSubmitted', Buffer.from(JSON.stringify({ tenderId, bid })));

        console.info(`Bid submitted successfully for tender ${tenderId}`);
        return tender;
    }



    // SUPPLIERS can view only their own bids across all tenders (new)
async getMyBids(ctx) {

    // Access Control: Only suppliers can call this
    if (!this._isSupplier(ctx)) {
        throw new Error('Access Denied: Only Supplier organizations can view their bids');
    }

    const callerId = ctx.clientIdentity.getID();
    const callerMSP = ctx.clientIdentity.getMSPID();

    const iterator = await ctx.stub.getStateByRange('', '');
    const myBids = [];

    let result = await iterator.next();

    while (!result.done) {

        const tender = JSON.parse(result.value.value.toString());

        if (tender.bids && tender.bids.length > 0) {

            const vendorBids = tender.bids.filter(bid => bid.supplier === callerId);

            vendorBids.forEach(bid => {
                myBids.push({
                    tenderId: tender.tenderId,
                    tenderDescription: tender.description,
                    tenderStatus: tender.status,
                    minAmount: tender.minAmount,
                    maxAmount: tender.maxAmount,
                    deadline: tender.deadline,
                    bidsCount: tender.bids ? tender.bids.length : 0,
                    ...bid
                });
            });
        }

        result = await iterator.next();
    }

    await iterator.close();

    return myBids;
}


    // ONLY BUYERS (Org1) can award tenders
    async awardTender(ctx, tenderId, supplier) {
        console.info(`Awarding tender: ${tenderId} to ${supplier}`);

        // ACCESS CONTROL: Only buyers can award tenders
        if (!this._isBuyer(ctx)) {
            throw new Error('Access Denied: Only Buyer organization can award tenders');
        }

        if (!tenderId || !supplier) {
            throw new Error('TenderId and supplier are required');
        }

        const tenderBytes = await ctx.stub.getState(tenderId);
        if (!tenderBytes || tenderBytes.length === 0) {
            throw new Error(`Tender ${tenderId} does not exist`);
        }

        const tender = JSON.parse(tenderBytes.toString());

        if (tender.status === 'AWARDED') {
            throw new Error(`Tender ${tenderId} has already been awarded to ${tender.awardedTo}`);
        }

        if (tender.status === 'CANCELLED') {
            throw new Error(`Tender ${tenderId} has been cancelled`);
        }

        const clientIdentity = ctx.clientIdentity;
        const caller = clientIdentity.getID();
        
        // Additional check: must be the original creator
        if (caller !== tender.creator) {
            throw new Error('Only the tender creator can award the tender');
        }

        const winningBid = tender.bids.find(bid => bid.supplier === supplier);
        if (!winningBid) {
            throw new Error(`Supplier ${supplier} has not submitted a bid for this tender`);
        }

        const txTimestamp = ctx.stub.getTxTimestamp();
        
        // Update bid statuses
        tender.bids = tender.bids.map(bid => {
            if (bid.supplier === supplier) {
                bid.status = 'ACCEPTED';
            } else {
                bid.status = 'REJECTED';
            }
                return bid;
            });
        tender.status = 'AWARDED';
        tender.awardedTo = supplier;
        tender.awardedAt = new Date(txTimestamp.seconds * 1000).toISOString();
        tender.awardedAmount = winningBid.amount;

        await ctx.stub.putState(tenderId, Buffer.from(JSON.stringify(tender)));

        await this._createAuditLog(ctx,
    "TENDER_AWARDED",
    "TENDER",
    tenderId,
    { winner: supplier, amount: winningBid.amount }
);
        ctx.stub.setEvent('TenderAwarded', Buffer.from(JSON.stringify({
            tenderId,
            awardedTo: supplier,
            amount: winningBid.amount
        })));

        console.info(`Tender ${tenderId} awarded to ${supplier}`);
        return tender;
    }

    // ONLY BUYERS can cancel tenders
    async cancelTender(ctx, tenderId, reason) {
        console.info(`Cancelling tender: ${tenderId}`);

        // ACCESS CONTROL: Only buyers can cancel
        if (!this._isBuyer(ctx)) {
            throw new Error('Access Denied: Only Buyer organization can cancel tenders');
        }

        if (!tenderId) {
            throw new Error('TenderId is required');
        }

        const tenderBytes = await ctx.stub.getState(tenderId);
        if (!tenderBytes || tenderBytes.length === 0) {
            throw new Error(`Tender ${tenderId} does not exist`);
        }

        const tender = JSON.parse(tenderBytes.toString());

        const clientIdentity = ctx.clientIdentity;
        const caller = clientIdentity.getID();
        
        if (caller !== tender.creator) {
            throw new Error('Only the tender creator can cancel the tender');
        }

        if (tender.status === 'AWARDED') {
            throw new Error(`Cannot cancel tender ${tenderId} - already awarded`);
        }

        if (tender.status === 'CANCELLED') {
            throw new Error(`Tender ${tenderId} is already cancelled`);
        }

        const txTimestamp = ctx.stub.getTxTimestamp();
        

        tender.status = 'CANCELLED';
        tender.cancelledAt = new Date(txTimestamp.seconds * 1000).toISOString();
        tender.cancellationReason = reason || 'No reason provided';

        await ctx.stub.putState(tenderId, Buffer.from(JSON.stringify(tender)));
        ctx.stub.setEvent('TenderCancelled', Buffer.from(JSON.stringify({ tenderId, reason })));

        console.info(`Tender ${tenderId} cancelled`);
        return tender;
    }

    // EVERYONE can read tenders (public information)
    async readTender(ctx, tenderId) {
        if (!tenderId) {
            throw new Error('TenderId is required');
        }

        const tenderBytes = await ctx.stub.getState(tenderId);
        if (!tenderBytes || tenderBytes.length === 0) {
            throw new Error(`Tender ${tenderId} does not exist`);
        }

        return JSON.parse(tenderBytes.toString());
    }

    // EVERYONE can view all tenders
    async getAllTenders(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const allTenders = [];
        
        let result = await iterator.next();
        while (!result.done) {
            const tender = JSON.parse(result.value.value.toString());
            allTenders.push(tender);
            result = await iterator.next();
        }
        
        await iterator.close();
        return allTenders;
    }

    // SUPPLIERS can only see their own bids, BUYERS can see all
    async getTendersByStatus(ctx, status) {
        if (!status) {
            throw new Error('Status is required');
        }

        const validStatuses = ['OPEN', 'AWARDED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        }

        const allTenders = await this.getAllTenders(ctx);
        let filteredTenders = allTenders.filter(tender => tender.status === status);

        // If caller is a supplier, hide other suppliers' bid details
        if (this._isSupplier(ctx)) {
            const callerMSP = ctx.clientIdentity.getMSPID();
            filteredTenders = filteredTenders.map(tender => {
                const filteredBids = tender.bids.map(bid => {
                    // Only show full details for own bids
                    if (bid.supplierMSP === callerMSP) {
                        return bid;
                    }
                    // Hide other suppliers' details
                    return {
                        supplierMSP: bid.supplierMSP,
                        submittedAt: bid.submittedAt
                        // amount and proposal hidden
                    };
                });
                return { ...tender, bids: filteredBids };
            });
        }

        return filteredTenders;
    }

    // ONLY AUDITORS (Org4) can view full tender history
    async getTenderHistory(ctx, tenderId) {
        // ACCESS CONTROL: Only auditors can view history
        if (!this._isAuditor(ctx) && !this._isBuyer(ctx)) {
            throw new Error('Access Denied: Only Auditor or Buyer organizations can view tender history');
        }

        if (!tenderId) {
            throw new Error('TenderId is required');
        }

        const iterator = await ctx.stub.getHistoryForKey(tenderId);
        const history = [];

        let result = await iterator.next();
        while (!result.done) {
            const record = {
                txId: result.value.txId,
                timestamp: result.value.timestamp,
                isDelete: result.value.isDelete,
                value: result.value.value.toString()
            };
            
            if (record.value) {
                record.value = JSON.parse(record.value);
            }
            
            history.push(record);
            result = await iterator.next();
        }

        await iterator.close();
        return history;
    }

    async tenderExists(ctx, tenderId) {
        const tenderBytes = await ctx.stub.getState(tenderId);
        return tenderBytes && tenderBytes.length > 0;
    }

    // BUYERS and AUDITORS can get lowest bid
    async getLowestBid(ctx, tenderId) {
        // ACCESS CONTROL
        if (!this._isBuyer(ctx) && !this._isAuditor(ctx)) {
            throw new Error('Access Denied: Only Buyer or Auditor organizations can view bid details');
        }

        const tender = await this.readTender(ctx, tenderId);
        
        if (tender.bids.length === 0) {
            throw new Error(`No bids found for tender ${tenderId}`);
        }

        return tender.bids.reduce((lowest, bid) => 
            bid.amount < lowest.amount ? bid : lowest
        );
    }

    async getBidsCount(ctx, tenderId) {
        const tender = await this.readTender(ctx, tenderId);
        return tender.bids.length;
    }

    async onboardOfficer(ctx, args) {
        
        const { officerId, departmentName, name, city } = JSON.parse(args);
        console.log("ARGS-RAW:",args)
        console.log("ARGS:",officerId, departmentName, name, city)
        const { role, uuid: callerId } = this.getCallerAttributes(ctx);
        const orgMSP = ctx.clientIdentity.getMSPID();

        if (orgMSP !== 'Org1MSP' || role !== 'department') {
            throw new Error('Only department can onboard officer.');
        }

        const officerJSON = await ctx.stub.getState(officerId);
        if (officerJSON && officerJSON.length > 0) {
            throw new Error(`officer ${officerId} already registerd by ${callerId}`);
        }

        const recordId = this.recordIdGenerator(ctx);
        console.log("Record ID", recordId);
        
        const record = {
            recordId,
            officerId,
            departmentId: callerId,
            name,
            departmentName,
            city,
           timestamp: ctx.stub.getTxTimestamp().seconds.low.toString()
        };

        const result = await ctx.stub.putState(officerId, Buffer.from(stringify(record)));
        console.log('ONBOARD officer RESULT:',stringify(result))
        return stringify(record);
    }

    // Everyone can see active tenders
    async getActiveTenders(ctx) {

        const allTenders = await this.getAllTenders(ctx);

        return allTenders.filter(tender => tender.status === 'OPEN');
    }
    // SUPPLIER: Get awarded tenders where I am the winner
    async getMyAwardedTenders(ctx) {

        if (!this._isSupplier(ctx)) {
            throw new Error('Access Denied: Only Supplier organizations can view their awarded tenders');
        }

        const callerId = ctx.clientIdentity.getID();
        const allTenders = await this.getAllTenders(ctx);

        return allTenders.filter(tender =>
            tender.status === 'AWARDED' &&
            tender.awardedTo === callerId
        );
    }

    // BUYER: Get tenders created by logged-in officer
    async getMyProcurementRequests(ctx) {

        if (!this._isBuyer(ctx)) {
            throw new Error('Access Denied: Only Buyer organization can view procurement requests');
        }

        const callerId = ctx.clientIdentity.getID();
        const allTenders = await this.getAllTenders(ctx);

        return allTenders.filter(tender =>
            tender.creator === callerId
        );
    }

    // BUYER: Get bids submitted on my tenders
    async getBidsOnMyRequests(ctx) {

        if (!this._isBuyer(ctx)) {
            throw new Error('Access Denied: Only Buyer organization can view bids on their requests');
        }

        const callerId = ctx.clientIdentity.getID();
        const allTenders = await this.getAllTenders(ctx);

        const result = [];

        allTenders.forEach(tender => {

            if (tender.creator === callerId && tender.bids.length > 0) {

                result.push({
                    tenderId: tender.tenderId,
                    description: tender.description,
                    status: tender.status,
                    bids: tender.bids
                });
            }
        });

        return result;
    }

    // BUYER: Get awarded tenders created by me
    async getMyAwardedRequests(ctx) {

        if (!this._isBuyer(ctx)) {
            throw new Error('Access Denied: Only Buyer organization can view awarded tenders');
        }

        const callerId = ctx.clientIdentity.getID();
        const allTenders = await this.getAllTenders(ctx);

        return allTenders.filter(tender =>
            tender.status === 'AWARDED' &&
            tender.creator === callerId
        );
    }


    //New Addition(Needs to be deployed)
    //1

    async registerVendorOnLedger(ctx, vendorId, companyName, uuid) {

    const exists = await ctx.stub.getState(vendorId);
    if (exists && exists.length > 0) {
        throw new Error(`Vendor ${vendorId} already exists on ledger`);
    }

    const vendor = {
        docType: 'vendor',
        vendorId,
        companyName,
        uuid,
        createdAt: new Date().toISOString()
    };

    await ctx.stub.putState(
        vendorId,
        Buffer.from(JSON.stringify(vendor))
    );

    await this._createAuditLog(ctx,
    "VENDOR_REGISTERED",
    "VENDOR",
    vendorId,
    { companyName }
);

    return JSON.stringify(vendor);
}

//2
async registerOfficerOnLedger(
    ctx,
    officerId,
    firstName,
    lastName,
    email,
    organizationId,
    departmentId,
    role,
    uuid
) {

    const officerKey = ctx.stub.createCompositeKey('OFFICER', [officerId]);

    const exists = await ctx.stub.getState(officerKey);
    if (exists && exists.length > 0) {
        throw new Error('Officer already exists');
    }

    const officer = {
        docType: 'officer',
        officerId,
        firstName,
        lastName,
        email,
        organizationId,
        departmentId,
        role,
        uuid,
        status: 'active',
        createdAt: new Date().toISOString()
    };

    await ctx.stub.putState(
        officerKey,
        Buffer.from(JSON.stringify(officer))
    );

    return JSON.stringify(officer);
}


async _createAuditLog(ctx, actionType, entityType, entityId, details) {

    const txId = ctx.stub.getTxID();
    const timestamp = ctx.stub.getTxTimestamp();
    const caller = ctx.clientIdentity.getID();
    const callerMSP = ctx.clientIdentity.getMSPID();

    const auditId = ctx.stub.createCompositeKey("AUDIT", [txId]);

    const auditRecord = {
        auditId,
        actionType,
        entityType,
        entityId,
        performedBy: caller,
        performerMSP: callerMSP,
        details: details || {},
        timestamp: new Date(timestamp.seconds * 1000).toISOString()
    };

    await ctx.stub.putState(
        auditId,
        Buffer.from(JSON.stringify(auditRecord))
    );

    return auditRecord;
}

async getAuditTrail(ctx) {

    if (!this._isAuditor(ctx)) {
        throw new Error("Only auditors can access audit logs");
    }

    const iterator = await ctx.stub.getStateByPartialCompositeKey("AUDIT", []);
    const results = [];

    let result = await iterator.next();

    while (!result.done) {

        const record = JSON.parse(result.value.value.toString());
        results.push(record);

        result = await iterator.next();
    }

    await iterator.close();
    return results;
}
async getTenderAuditTrail(ctx, tenderId) {

    if (!this._isAuditor(ctx)) {
        throw new Error("Only auditors can access audit logs");
    }

    const iterator = await ctx.stub.getStateByPartialCompositeKey("AUDIT", []);
    const results = [];

    let result = await iterator.next();

    while (!result.done) {

        const record = JSON.parse(result.value.value.toString());

        if (record.entityId === tenderId) {
            results.push(record);
        }

        result = await iterator.next();
    }

    await iterator.close();
    return results;
}

async getAuditLogs(ctx) {

    if (!this._isAuditor(ctx)) {
        throw new Error("Only auditors can view audit logs");
    }

    const iterator = await ctx.stub.getStateByPartialCompositeKey("AUDIT", []);
    const results = [];

    let result = await iterator.next();

    while (!result.done) {

        const record = JSON.parse(result.value.value.toString());
        results.push(record);

        result = await iterator.next();
    }

    await iterator.close();
    return results;
}

}

module.exports = BiddingContract;