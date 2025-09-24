# Transparent Public Procurement System using Hyperledger Fabric

## Table of Contents
- [Project Overview](#project-overview)  
- [Key Features](#key-features)  
- [Roles & Permissions](#roles--permissions)  
- [Architecture](#architecture)  
- [Blockchain Network Structure](#blockchain-network-structure)  
- [Smart Contracts (Chaincode)](#smart-contracts-chaincode)  
- [Frontend Integration](#frontend-integration)  
- [Setup Instructions](#setup-instructions)  
- [Usage](#usage)  
- [Technologies Used](#technologies-used)  
- [Future Enhancements](#future-enhancements)  
- [Contributors](#contributors)  

---

## Project Overview
This project is a **Transparent Public Procurement System** built on **Hyperledger Fabric**, designed to digitize and secure the procurement processes for government projects. The blockchain ensures **transparency, accountability, and traceability**, allowing citizens, auditors, vendors, and government officials to interact with procurement processes in a tamper-proof environment.

The system prevents **fraud, corruption, and inefficiencies** by recording every procurement action on the blockchain.

---

## Key Features
- End-to-end tracking of procurement requests and approvals.
- Tamper-proof record of vendor submissions and bidding.
- Role-based access for Government, Vendors, Auditors, and Citizens.
- Real-time monitoring of procurement stages.
- Automated notifications for stakeholders.
- Integration with a web frontend for usability.

---

## Roles & Permissions

| Role       | Permissions |
|-----------|-------------|
| **Government** | Create procurement requests, approve vendor submissions, update project status |
| **Vendor**     | Submit bids, view procurement requests, track project updates |
| **Auditor**    | Audit all transactions, verify procurement integrity, generate reports |
| **Citizen**    | View procurement projects and their status, submit complaints/feedback |

---

## Architecture
The project leverages **Hyperledger Fabric’s permissioned blockchain** to ensure secure and transparent interactions between participants.  

**Components:**
- **Peers**: Maintain the ledger and execute smart contracts.
- **Orderers**: Ensure consensus and transaction ordering.
- **Channels**: Separate ledgers for different procurement workflows.
- **Chaincode (Smart Contract)**: Handles procurement logic, bid submission, approvals, and auditing.

---

## Blockchain Network Structure
- **Peers**: 4 (1 per role)  
- **Orderers**: 1-3 for consensus  
- **Channels**:  
  - `procurement-channel` (main channel)  
- **Access**:  
  - Government: read/write  
  - Vendor: read/write on bids  
  - Auditor: read-only  
  - Citizen: read-only  

**Explanation of Steps:**
1. **Create the network** using `byfn.sh` or custom scripts.  
2. **Deploy chaincode** to handle procurement processes.  
3. **Assign roles** with specific access controls per channel.  
4. **Register identities** using Fabric CA for authentication.  
5. **Integrate frontend** for user interaction.

---

## Smart Contracts (Chaincode)
The chaincode manages:
- Procurement request creation.
- Bid submission and evaluation.
- Audit logging of all actions.
- Role-based access control.
- Status updates and notifications.

**Languages used:** Go / Node.js  

---

## Frontend Integration
The frontend (React/Angular) interacts with the blockchain via **Hyperledger Fabric SDK**:

- Government dashboard: create and approve procurement requests.  
- Vendor dashboard: submit bids and track status.  
- Auditor dashboard: view and audit all transactions.  
- Citizen dashboard: track projects and submit feedback.

---

## Setup Instructions
1. **Clone the repository**
```bash
git clone https://github.com/akshaygithub07/ProcureWatch.git
cd ProcureWatch
```

2. **Start the Fabric network**
```bash
./network.sh up createChannel -c procurement-channel
```

3. **Deploy the chaincode**
```bash
  ./network.sh deployCC -ccn procurementCC -ccp ./chaincode/ -ccl javascript
```

4. **Install frontend dependencies**
```bash
  cd ProcureWatch Frontend
npm install
npm start
```

5. **Access dashboards**
   ```bash
   http://localhost:5173/
   ```

## Usage
- Government users can log in to create and manage procurement requests.  
- Vendors can bid on projects transparently.  
- Auditors can monitor and verify all blockchain transactions.  
- Citizens can check the status of public projects to ensure transparency.  

---

## Technologies Used
- **Hyperledger Fabric**: Blockchain network  
- **Node.js / Go**: Chaincode development  
- **Fabric SDK**: Backend integration  
- **React.js**: Frontend dashboards  
- **Docker & Docker Compose**: Network containerization  

---

## Future Enhancements
- AI-based vendor recommendation system.  
- Mobile app integration.  
- Advanced analytics for procurement trends.  
- Integration with government ERP systems.  

---

## Contributors
- <img src="https://github.com/Goldenbook27.png" width="30" height="30"> [Goldenbook27](https://github.com/Goldenbook27) – Piyush 
- <img src="https://github.com/akshaygithub07.png" width="30" height="30"> [akshaygithub07](https://github.com/akshaygithub07) – Akshay
- <img src="https://github.com/AryanSC123.png" width="30" height="30"> [AryanSC123](https://github.com/AryanSC123) – Aryan
- <img src="https://github.com/Madannadar.png" width="30" height="30"> [Madannadar](https://github.com/Madannadar) – Madan

