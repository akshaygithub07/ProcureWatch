import React, { useState , useEffect } from "react";

import {
  Plus,
  Search,
  Filter,
  SortAsc,
  Check,
  X,
  Clock,
  FileText,
  Eye,
  Edit,
  Trash,
} from "lucide-react";

export function ProcurementRequests() {

  useEffect(() => {
  fetchTenders();
}, []);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
const [showNewRequestForm, setShowNewRequestForm] = useState(false);
const [requests, setRequests] = useState<Array<{
  id: string;
  title: string;
  department: string;
  requestedBy: string;
  date: string;
  minValue: string;
  maxValue:string;
  status: string;
}>>([]);
const [loading, setLoading] = useState(true);


const [formData, setFormData] = useState({
  title: "",
  department: "IT",
  description: "",
  minAmount: "15000",
  maxAmount: "25000",
  deadline: ""
});



  // const requests = [
  //   {
  //     id: "PR-2023-042",
  //     title: "IT Infrastructure Upgrade",
  //     department: "IT",
  //     requestedBy: "John Smith",
  //     date: "2023-10-01",
  //     minValue: "$120,000",
  //     maxValue: "$120,000",
  //     status: "Published",
  //   },
  //   {
  //     id: "PR-2023-039",
  //     title: "Office Supplies",
  //     department: "Admin",
  //     requestedBy: "Sarah Johnson",
  //     date: "2023-09-28",
  //     minValue: "$25,000",
  //     maxValue: "$25,000",
  //     status: "Draft",
  //   },
  //   {
  //     id: "PR-2023-036",
  //     title: "Security Services",
  //     department: "Facilities",
  //     requestedBy: "Michael Brown",
  //     date: "2023-09-25",
  //     minValue: "$75,000",
  //     maxValue: "$75,000",
  //     status: "Pending Approval",
  //   },
  //   {
  //     id: "PR-2023-035",
  //     title: "Software Licenses",
  //     department: "IT",
  //     requestedBy: "Emma Davis",
  //     date: "2023-09-22",
  //     minValue: "$45,000",
  //     maxValue: "$45,000",
  //     status: "Approved",
  //   },
  // ];

  const extractCN = (x509: string) => {
  if (!x509) return "Unknown";
  const match = x509.match(/CN=([^:]+)/);
  return match ? match[1] : "Unknown";
};

const formatDate = (iso: string | number | Date) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-IN");
};

  const fetchTenders = async () => {
  try {
    // const res = await fetch("http://localhost:3000/api/tenders/");
    const res = await fetch("http://localhost:3000/api/tenders/my-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: "ProcurementOfficer-Rama05"
      })
    });
    const json = await res.json();

    if (!json.success) throw new Error("API failed");

    const mapped = json.data.map((tender: any) => ({
      id: tender.tenderId,
      title: tender.description,
      department: tender.creatorMSP,        // Org1MSP → can map to IT later
      requestedBy: extractCN(tender.creator),
      date: formatDate(tender.createdAt),
      minValue: `₹${tender.minAmount.toLocaleString()}`,
      maxValue : `₹${tender.maxAmount.toLocaleString()}`,
      status: tender.status
    }));

    setRequests(mapped);
    setLoading(false);
    console.log("RAW API DATA:", json.data);
  } catch (err) {
    console.error("Failed to load tenders:", err);
    setLoading(false);
    

  }

};
  const createTender = async () => {
  console.log(formData)
  const payload = {
    tenderId: `TND-${Math.floor(100000 + Math.random() * 900000)}`,
    description: formData.description,
    minAmount: Number(formData.minAmount),
    maxAmount: Number(formData.maxAmount),
    deadline: formData.deadline.split("-").reverse().join("-"), // dd-mm-yyyy
    user: "ProcurementOfficer-Rama05"
  };

  try {
    const res = await fetch("http://localhost:3000/api/tenders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Tender Created:", data);

    alert("Tender created successfully ✅");
    fetchTenders()
    setShowNewRequestForm(false);
  } catch (err) {
    console.error(err);
    alert("Failed to create tender ❌");
  }
};

  const filteredRequests = requests.filter((request) => {
    if (filter !== "all" && request.status.toLowerCase() !== filter.toLowerCase()) {
      return false;
    }
    if (
      searchTerm &&
      !request.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !request.id.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "AWARDED":
        return <span className={`${base} bg-green-100 text-green-800`}><Check size={12} className="mr-1" />{status}</span>;
      case "Draft":
        return <span className={`${base} bg-gray-100 text-gray-800`}><FileText size={12} className="mr-1" />{status}</span>;
      case "OPEN":
        return <span className={`${base} bg-yellow-100 text-yellow-800`}><Clock size={12} className="mr-1" />{status}</span>;
      case "Approved":
        return <span className={`${base} bg-blue-100 text-blue-800`}><Check size={12} className="mr-1" />{status}</span>;
      case "CANCELLED":
        return <span className={`${base} bg-red-100 text-red-800`}><X size={12} className="mr-1" />{status}</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };
  const cancelTender = async (tenderId: string) => {
  const payload = {
    tenderId,
    reason: "not needed anymore",
    user: "ProcurementOfficer-Rama05"
  };

  try {
    const res = await fetch("http://localhost:3000/api/tenders/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error("Cancel failed");
    }

    alert("Tender cancelled successfully ❌");
    fetchTenders(); // refresh table
  } catch (err) {
    console.error("Cancel failed:", err);
    alert("Failed to cancel tender ❌");
  }
};

  return (
    <div
      className="p-6"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Procurement Requests</h1>
        <button
          onClick={() => {setShowNewRequestForm(true)}}
          className="bg-black text-white px-4 py-2 rounded-xl flex items-center text-sm font-medium hover:bg-gray-800 shadow-sm"
        >
          <Plus size={16} className="mr-2" /> New Request
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex items-center">
              <Filter size={16} className="text-gray-500 mr-2" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="pending approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center">
            <SortAsc size={16} className="mr-2" /> Sort
          </button>
        </div>
      </div>

      {/* Requests table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left font-medium">ID & Title</th>
                <th className="px-6 py-3 text-left font-medium">Department</th>
                <th className="px-6 py-3 text-left font-medium">Requested By</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
                <th className="px-6 py-3 text-left font-medium">Min. Value</th>
                <th className="px-6 py-3 text-left font-medium">Max. Value</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{request.title}</p>
                    <p className="text-xs text-gray-500">{request.id}</p>
                  </td>
                  <td className="px-6 py-4">{request.department}</td>
                  <td className="px-6 py-4">{request.requestedBy}</td>
                  <td className="px-6 py-4">{request.date}</td>
                  <td className="px-6 py-4">{request.minValue}</td>
                  <td className="px-6 py-4">{request.maxValue}</td>
                  <td className="px-6 py-4">{getStatusBadge(request.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-3">
                      <button className="text-gray-600 hover:text-black"><Eye size={18} /></button>
                      <button className="text-gray-600 hover:text-black"><Edit size={18} /></button>
                      <button className="text-gray-600 hover:text-red-600"  onClick={() => {
    if (confirm(`Cancel tender ${request.id}?`)) {
      cancelTender(request.id);
    }
  }}><Trash size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRequests.length === 0 && (
            <div className="text-center py-10 text-gray-500">No requests found</div>
          )}
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between text-sm text-gray-600">
          <span>Showing {filteredRequests.length} of {requests.length} requests</span>
          <div className="space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showNewRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-black">New Procurement Request</h3>
              <button onClick={() => setShowNewRequestForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option>IT</option>
                  <option>Admin</option>
                  <option>HR</option>
                  <option>Facilities</option>
                  <option>Operations</option>
                </select>

              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Minimum Value</label>
                  <input
                      type="number"
                      placeholder="Min Amount"
                      value={formData.minAmount}
                      onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Maximum Value</label>
                  <input
                    type="number"
                    placeholder="Max Amount"
                    value={formData.maxAmount}
                    onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Request Date</label>
                  <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />

                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button onClick={() => setShowNewRequestForm(false)} className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-100">Cancel</button>
              <button onClick={() => createTender()} className="px-4 py-2 rounded-lg text-sm text-white bg-black hover:bg-gray-800">Create Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );}



import {
  CheckIcon,
  XIcon,
  StarIcon,
  MessageCircleIcon,
} from 'lucide-react'
type VendorResponse = {
  id: string
  tenderId: string
  tenderTitle: string
  vendor: string
  submittedDate: string
  amount: string
  status: string
  rating: number
  documents: { name: string; size: string }[]
  messages: { from: string; message: string; date: string }[]
  technicalScore: number
  financialScore: number
  totalScore: number
}

export function VendorResponses() {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedResponse, setSelectedResponse] = useState<VendorResponse | null>(null)
  const [responses, setResponses] = useState<VendorResponse[]>([])
  const [loading, setLoading] = useState(true)
  // const responses: VendorResponse[] = [
  //   {
  //     id: 'VR-2023-087',
  //     tenderId: 'T-2023-042',
  //     tenderTitle: 'IT Infrastructure Upgrade',
  //     vendor: 'Tech Solutions Inc.',
  //     submittedDate: '2023-09-28',
  //     amount: '$125,000',
  //     status: 'Under Review',
  //     rating: 4,
  //     documents: [
  //       {
  //         name: 'Technical Proposal.pdf',
  //         size: '2.4 MB',
  //       },
  //       {
  //         name: 'Financial Proposal.pdf',
  //         size: '1.8 MB',
  //       },
  //       {
  //         name: 'Company Profile.pdf',
  //         size: '3.2 MB',
  //       },
  //     ],
  //     messages: [
  //       {
  //         from: 'Jane Cooper',
  //         message:
  //           'Can you provide more details on the implementation timeline?',
  //         date: '2023-09-29',
  //       },
  //       {
  //         from: 'Tech Solutions Inc.',
  //         message:
  //           "We've attached a detailed implementation plan in our response. Typically we can complete this type of upgrade within 6-8 weeks.",
  //         date: '2023-09-30',
  //       },
  //     ],
  //     technicalScore: 85,
  //     financialScore: 78,
  //     totalScore: 82,
  //   },
  //   {
  //     id: 'VR-2023-088',
  //     tenderId: 'T-2023-042',
  //     tenderTitle: 'IT Infrastructure Upgrade',
  //     vendor: 'NetworkPro Systems',
  //     submittedDate: '2023-09-27',
  //     amount: '$142,500',
  //     status: 'Under Review',
  //     rating: 4.5,
  //     documents: [
  //       {
  //         name: 'Technical Proposal.pdf',
  //         size: '3.1 MB',
  //       },
  //       {
  //         name: 'Financial Proposal.pdf',
  //         size: '1.5 MB',
  //       },
  //       {
  //         name: 'References.pdf',
  //         size: '0.8 MB',
  //       },
  //     ],
  //     messages: [
  //       {
  //         from: 'Jane Cooper',
  //         message:
  //           'Your proposal mentions proprietary hardware. Can you clarify if this will cause vendor lock-in?',
  //         date: '2023-09-28',
  //       },
  //       {
  //         from: 'NetworkPro Systems',
  //         message:
  //           "Our solution uses industry-standard protocols and interfaces. While our hardware is proprietary, it's designed to work with third-party systems.",
  //         date: '2023-09-29',
  //       },
  //     ],
  //     technicalScore: 92,
  //     financialScore: 72,
  //     totalScore: 84,
  //   },
  //   {
  //     id: 'VR-2023-089',
  //     tenderId: 'T-2023-042',
  //     tenderTitle: 'IT Infrastructure Upgrade',
  //     vendor: 'Global IT Services',
  //     submittedDate: '2023-09-30',
  //     amount: '$118,750',
  //     status: 'Under Review',
  //     rating: 3.5,
  //     documents: [
  //       {
  //         name: 'Technical Proposal.pdf',
  //         size: '2.8 MB',
  //       },
  //       {
  //         name: 'Financial Proposal.pdf',
  //         size: '1.2 MB',
  //       },
  //       {
  //         name: 'Implementation Plan.pdf',
  //         size: '1.6 MB',
  //       },
  //     ],
  //     messages: [],
  //     technicalScore: 76,
  //     financialScore: 88,
  //     totalScore: 81,
  //   },
  //   {
  //     id: 'VR-2023-075',
  //     tenderId: 'T-2023-039',
  //     tenderTitle: 'Office Supplies',
  //     vendor: 'Office Solutions Co.',
  //     submittedDate: '2023-09-15',
  //     amount: '$28,500',
  //     status: 'Accepted',
  //     rating: 5,
  //     documents: [
  //       {
  //         name: 'Product Catalog.pdf',
  //         size: '4.5 MB',
  //       },
  //       {
  //         name: 'Price List.pdf',
  //         size: '1.1 MB',
  //       },
  //       {
  //         name: 'Delivery Terms.pdf',
  //         size: '0.6 MB',
  //       },
  //     ],
  //     messages: [
  //       {
  //         from: 'Sarah Johnson',
  //         message: 'Can you confirm your delivery timeframes?',
  //         date: '2023-09-16',
  //       },
  //       {
  //         from: 'Office Solutions Co.',
  //         message:
  //           'We guarantee delivery within 48 hours of order placement for all standard items.',
  //         date: '2023-09-16',
  //       },
  //     ],
  //     technicalScore: 90,
  //     financialScore: 95,
  //     totalScore: 92,
  //   },
  //   {
  //     id: 'VR-2023-062',
  //     tenderId: 'T-2023-036',
  //     tenderTitle: 'Security Services',
  //     vendor: 'SecureGuard Inc.',
  //     submittedDate: '2023-09-05',
  //     amount: '$75,000',
  //     status: 'Rejected',
  //     rating: 2,
  //     documents: [
  //       {
  //         name: 'Security Proposal.pdf',
  //         size: '2.2 MB',
  //       },
  //       {
  //         name: 'Guard Qualifications.pdf',
  //         size: '1.7 MB',
  //       },
  //       {
  //         name: 'Company License.pdf',
  //         size: '0.4 MB',
  //       },
  //     ],
  //     messages: [
  //       {
  //         from: 'Michael Brown',
  //         message:
  //           "Your proposal doesn't address our 24/7 coverage requirements.",
  //         date: '2023-09-06',
  //       },
  //       {
  //         from: 'SecureGuard Inc.',
  //         message:
  //           'We apologize for the oversight. We can provide 24/7 coverage at an additional cost of 15%.',
  //         date: '2023-09-07',
  //       },
  //       {
  //         from: 'Michael Brown',
  //         message:
  //           "That would exceed our budget constraints. We'll have to decline your proposal.",
  //         date: '2023-09-08',
  //       },
  //     ],
  //     technicalScore: 65,
  //     financialScore: 70,
  //     totalScore: 67,
  //   },
  // ]
  const formatDate = (iso: string) => {
  if (!iso) return "-"
  return new Date(iso).toLocaleDateString("en-IN")
}

const fetchVendorResponses = async () => {
  try {
    setLoading(true)

    const res = await fetch(
      "http://localhost:3000/api/tenders/my-requests/bids",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: "ProcurementOfficer-Rama02"
        })
      }
    )

    const json = await res.json()

    if (!res.ok || !json.success) {
      throw new Error("API failed")
    }

    /*
      Expected Backend Idea:

      [
        {
          tenderId,
          description,
          status,
          awardedVendor,
          bids: [...]
        }
      ]
    */

    const mapped: VendorResponse[] = []

    json.data.forEach((tender: any) => {
      const tenderStatus = tender.status
      const awardedVendor = tender.awardedVendor

      tender.bids.forEach((bid: any) => {

        // -------- STATUS LOGIC ----------
        let status = "Under Review"

        if (tenderStatus === "AWARDED") {
          status =
            bid.vendor === awardedVendor
              ? "Accepted"
              : "Rejected"
        }

        mapped.push({
          id: bid.bidId,
          tenderId: tender.tenderId,
          tenderTitle: tender.description,

          // as requested
          vendor: "ABC Company",

          submittedDate: formatDate(bid.submittedAt),

          amount: `₹${Number(bid.amount).toLocaleString()}`,

          status,

          rating: 4,

          // placeholders until backend supports them
          documents: [],
          messages: [],

          technicalScore: bid.technicalScore ?? 80,
          financialScore: bid.financialScore ?? 80,
          totalScore: bid.totalScore ?? 80
        })
      })
    })

    setResponses(mapped)
  } catch (err) {
    console.error("Failed loading vendor responses", err)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
  fetchVendorResponses()
}, [])

  const filteredResponses = responses.filter((response:any) => {
    // Apply status filter
    if (
      filter !== 'all' &&
      response.status.toLowerCase().replace(' ', '') !== filter.toLowerCase()
    ) {
      return false
    }
    // Apply search filter
    if (
      searchTerm &&
      !response.tenderTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !response.vendor.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !response.tenderId.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }
    return true
  })
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Under Review':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon size={12} className="mr-1" /> {status}
          </span>
        )
      case 'Accepted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckIcon size={12} className="mr-1" /> {status}
          </span>
        )
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XIcon size={12} className="mr-1" /> {status}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            size={16}
            className={
              i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'
            }
            fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    )
  }
  return (
    <div className="container mx-auto px-4 py-6 font-['Poppins']">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Vendor Responses
        </h1>
      </div>
      {/* Filters and search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search responses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
            <div className="flex items-center">
              <FilterIcon size={16} className="text-gray-500 mr-2" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-200 rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              >
                <option value="all">All Statuses</option>
                <option value="underreview">Under Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Responses list */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Response List
              </h3>
            </div>
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {filteredResponses.map((response) => (
                <div
                  key={response.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedResponse?.id === response.id ? 'bg-gray-50' : ''}`}
                  onClick={() => setSelectedResponse(response)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {response.vendor}
                      </p>
                      <p className="text-xs text-gray-500">
                        Tender: {response.tenderTitle} ({response.tenderId})
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted: {response.submittedDate}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm font-medium text-gray-900">
                        {response.amount}
                      </p>
                      {getStatusBadge(response.status)}
                    </div>
                  </div>
                  <div className="mt-2">{renderStars(response.rating)}</div>
                </div>
              ))}
              {filteredResponses.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-500">
                    No responses found matching your criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Right column - Response details */}
        <div className="lg:col-span-2">
          {selectedResponse ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedResponse.vendor}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Response ID: {selectedResponse.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {selectedResponse.amount}
                    </p>
                    <div className="mt-1">
                      {getStatusBadge(selectedResponse.status)}
                    </div>
                  </div>
                </div>
              </div>
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <a
                    href="#"
                    className="border-b-2 border-black text-gray-900 whitespace-nowrap py-4 px-6 font-medium text-sm"
                  >
                    Overview
                  </a>
                  <a
                    href="#"
                    className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-6 font-medium text-sm"
                  >
                    Documents
                  </a>
                  <a
                    href="#"
                    className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-6 font-medium text-sm"
                  >
                    Messages
                  </a>
                  <a
                    href="#"
                    className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-6 font-medium text-sm"
                  >
                    Evaluation
                  </a>
                </nav>
              </div>
              {/* Content */}
              <div className="p-6">
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Bid Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500">Tender</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {selectedResponse.tenderTitle}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedResponse.tenderId}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500">Submission Date</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {selectedResponse.submittedDate}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500">Bid Amount</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {selectedResponse.amount}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500">Vendor Rating</p>
                      <div className="mt-1">
                        {renderStars(selectedResponse.rating)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Documents
                  </h3>
                  <div className="bg-gray-50 rounded-md divide-y divide-gray-200">
                    {selectedResponse.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4"
                      >
                        <div className="flex items-center">
                          <div className="bg-white p-2 rounded-md border border-gray-200 mr-3">
                            <svg
                              className="h-6 w-6 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {doc.name}
                            </p>
                            <p className="text-xs text-gray-500">{doc.size}</p>
                          </div>
                        </div>
                        <button className="text-gray-600 hover:text-gray-900">
                          <DownloadIcon size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Messages
                    </h3>
                    <button className="flex items-center text-sm text-black hover:text-gray-700">
                      <MessageCircleIcon size={16} className="mr-1" />
                      Send Message
                    </button>
                  </div>
                  {selectedResponse.messages.length > 0 ? (
                    <div className="bg-gray-50 rounded-md p-4 space-y-4">
                      {selectedResponse.messages.map((msg, index) => (
                        <div
                          key={index}
                          className="bg-white p-3 rounded-md shadow-sm"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-medium text-gray-900">
                              {msg.from}
                            </p>
                            <p className="text-xs text-gray-500">{msg.date}</p>
                          </div>
                          <p className="text-sm text-gray-700">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-md p-6 text-center">
                      <p className="text-gray-500">No messages exchanged yet</p>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Evaluation Scores
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500">Technical Score</p>
                      <div className="mt-2 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{
                              width: `${selectedResponse.technicalScore}%`,
                            }}
                          ></div>
                        </div>
                        <p className="ml-2 text-sm font-medium text-gray-900">
                          {selectedResponse.technicalScore}%
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500">Financial Score</p>
                      <div className="mt-2 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{
                              width: `${selectedResponse.financialScore}%`,
                            }}
                          ></div>
                        </div>
                        <p className="ml-2 text-sm font-medium text-gray-900">
                          {selectedResponse.financialScore}%
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500">Total Score</p>
                      <div className="mt-2 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-purple-600 h-2.5 rounded-full"
                            style={{
                              width: `${selectedResponse.totalScore}%`,
                            }}
                          ></div>
                        </div>
                        <p className="ml-2 text-sm font-medium text-gray-900">
                          {selectedResponse.totalScore}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="mt-8 flex justify-end space-x-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                    Decline
                  </button>
                  <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                    Accept Bid
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center h-full">
              <EyeIcon size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                Select a response to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


import {
  SearchIcon,
  FilterIcon,
  SortAscIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FileTextIcon,
  EyeIcon,
  DownloadIcon,
  BellIcon,
  EditIcon,
  MoreHorizontalIcon,
  CalendarIcon,
} from 'lucide-react'

type Contract = {
  id: string
  title: string
  vendor: string
  startDate: string
  endDate: string
  value: string
  status: string
  department: string
  type: string
  description: string
  documents: { name: string; size: string }[]
  milestones: { name: string; date: string; completed: boolean }[]
  payments: { amount: string; date: string; status: string; description: string }[]
  contacts: { name: string; role: string; email: string; phone: string }[]
}

export function BuyerContracts() {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [contracts, setContracts] = useState<Contract[]>([])
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/tenders/my-awarded-requests",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // 👈 send identity
            },
            body: JSON.stringify({
                user: "ProcurementOfficer-Rama02"
              })
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch awarded contracts')
        }

        const data = await response.json()
        console.log(data)
        const formattedData: Contract[] = data.data.map((item: any) => ({
          id: item.tenderId || item.id,
          title: item.description || 'Awarded Tender',
          vendor: item.vendorId || item.vendor || 'Unknown Vendor',
          startDate: item.createdAt || 'N/A',
          endDate: item.deadline || 'N/A',
          value: item.bids?.[0]?.amount ? `₹${item.bids[0].amount}` : '₹0',
          status: item.status || 'Active',
          department: item.department || 'N/A',
          type: item.type || 'Service',
          description: item.description || '',
          documents: item.documents || [],
          milestones: item.milestones || [],
          payments: item.payments || [],
          contacts: item.contacts || [],
        }))

        setContracts(formattedData)
        if (formattedData.length > 0) {
          setSelectedContract(formattedData[0])
        }
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchContracts()
  }, [])

  if (loading) {
    return <div className="p-8">Loading awarded contracts...</div>
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>
  }

  const filteredContracts = contracts.filter((contract) => {
    if (
      filter !== 'all' &&
      contract.status.toLowerCase() !== filter.toLowerCase()
    ) {
      return false
    }

    if (
      searchTerm &&
      !contract.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !contract.vendor.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !contract.id.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    return true
  })

  const calculateProgress = (contract: Contract) => {
    if (!contract.milestones || contract.milestones.length === 0) return 0
    const completed = contract.milestones.filter((m) => m.completed).length
    return (completed / contract.milestones.length) * 100
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Awarded Contracts</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="bg-white rounded-lg shadow border">
          {filteredContracts.map((contract) => (
            <div
              key={contract.id}
              className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${
                selectedContract?.id === contract.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => setSelectedContract(contract)}
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{contract.title}</p>
                  <p className="text-sm text-gray-500">
                    {contract.vendor} • {contract.id}
                  </p>
                </div>
                <p className="font-medium">{contract.value}</p>
              </div>

              <div className="mt-2 bg-gray-200 h-1 rounded-full">
                <div
                  className="bg-blue-600 h-1 rounded-full"
                  style={{ width: `${calculateProgress(contract)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow border p-6">
          {selectedContract ? (
            <>
              <h2 className="text-xl font-semibold mb-2">
                {selectedContract.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Contract ID: {selectedContract.id}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Vendor</p>
                  <p>{selectedContract.vendor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p>{selectedContract.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p>{selectedContract.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p>{selectedContract.endDate}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                {selectedContract.description}
              </p>
            </>
          ) : (
            <p className="text-gray-500">
              Select a contract to view details
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts'
import {
  DollarSignIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  AlertCircleIcon,
} from 'lucide-react'
export function BudgetTracking() {
  const [period, setPeriod] = useState('year')
  const [department, setDepartment] = useState('all')
  // Sample data for charts
  const budgetAllocation = [
    {
      name: 'IT',
      value: 400000,
      color: '#3b82f6',
    },
    {
      name: 'Facilities',
      value: 300000,
      color: '#10b981',
    },
    {
      name: 'Marketing',
      value: 200000,
      color: '#f59e0b',
    },
    {
      name: 'HR',
      value: 150000,
      color: '#8b5cf6',
    },
    {
      name: 'Operations',
      value: 350000,
      color: '#ef4444',
    },
    {
      name: 'Admin',
      value: 100000,
      color: '#6366f1',
    },
  ]
  const monthlySpending = [
    {
      name: 'Jan',
      actual: 120000,
      projected: 100000,
    },
    {
      name: 'Feb',
      actual: 110000,
      projected: 105000,
    },
    {
      name: 'Mar',
      actual: 130000,
      projected: 110000,
    },
    {
      name: 'Apr',
      actual: 140000,
      projected: 115000,
    },
    {
      name: 'May',
      actual: 125000,
      projected: 120000,
    },
    {
      name: 'Jun',
      actual: 135000,
      projected: 125000,
    },
    {
      name: 'Jul',
      actual: 145000,
      projected: 130000,
    },
    {
      name: 'Aug',
      actual: 150000,
      projected: 135000,
    },
    {
      name: 'Sep',
      actual: 155000,
      projected: 140000,
    },
    {
      name: 'Oct',
      actual: 0,
      projected: 145000,
    },
    {
      name: 'Nov',
      actual: 0,
      projected: 150000,
    },
    {
      name: 'Dec',
      actual: 0,
      projected: 155000,
    },
  ]
  const categorySpending = [
    {
      name: 'Hardware',
      spent: 250000,
      budget: 300000,
    },
    {
      name: 'Software',
      spent: 180000,
      budget: 200000,
    },
    {
      name: 'Services',
      spent: 320000,
      budget: 350000,
    },
    {
      name: 'Supplies',
      spent: 90000,
      budget: 100000,
    },
    {
      name: 'Consulting',
      spent: 140000,
      budget: 150000,
    },
  ]
  const procurementTrends = [
    {
      year: '2019',
      value: 800000,
    },
    {
      year: '2020',
      value: 950000,
    },
    {
      year: '2021',
      value: 1100000,
    },
    {
      year: '2022',
      value: 1250000,
    },
    {
      year: '2023',
      value: 1400000,
    },
  ]
  // Summary stats
  const stats = [
    {
      title: 'Total Budget',
      value: '$1.5M',
      change: '+5%',
      isPositive: true,
      icon: <DollarSignIcon size={24} />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'YTD Spending',
      value: '$1.1M',
      change: '73% of budget',
      isPositive: true,
      icon: <TrendingUpIcon size={24} />,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Monthly Avg',
      value: '$122K',
      change: '+3%',
      isPositive: true,
      icon: <TrendingUpIcon size={24} />,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Budget Alerts',
      value: '2',
      change: 'Departments over budget',
      isPositive: false,
      icon: <AlertCircleIcon size={24} />,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
  ]
  return (
    <div className="container mx-auto px-4 py-6 font-['Poppins']">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Budget Tracking
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <CalendarIcon size={16} className="text-gray-500 mr-2" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border border-gray-200 rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="flex items-center">
            <FilterIcon size={16} className="text-gray-500 mr-2" />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="border border-gray-200 rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            >
              <option value="all">All Departments</option>
              <option value="it">IT</option>
              <option value="facilities">Facilities</option>
              <option value="marketing">Marketing</option>
              <option value="hr">HR</option>
              <option value="operations">Operations</option>
            </select>
          </div>
        </div>
      </div>
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex items-center">
              <div
                className={`p-3 rounded-full ${stat.iconBg} ${stat.iconColor} mr-4`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
                <div className="flex items-center mt-1">
                  <span
                    className={`text-xs font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Charts - First row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Budget Allocation
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => {
                    const total = budgetAllocation.reduce((sum, entry) => sum + entry.value, 0);
                    const percent = total > 0 && typeof value === 'number' ? (value / total) * 100 : 0;
                    return `${name} ${percent.toFixed(0)}%`;
                  }}
                >
                  {budgetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Monthly Spending vs Projections
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlySpending}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  activeDot={{
                    r: 8,
                  }}
                  name="Actual Spending"
                />
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="#9ca3af"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Projected"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Charts - Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Category Budget vs Spending
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categorySpending}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="budget" name="Budget" fill="#9ca3af" />
                <Bar dataKey="spent" name="Spent" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Procurement Trends (5 Year)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={procurementTrends}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Area
                  type="monotone"
                  dataKey="value"
                  fill="#3b82f6"
                  stroke="#3b82f6"
                  name="Total Procurement"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Department Budget Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Department Budget Details
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Annual Budget
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  YTD Spent
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Remaining
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  % Used
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                {
                  department: 'IT',
                  budget: 400000,
                  spent: 320000,
                },
                {
                  department: 'Facilities',
                  budget: 300000,
                  spent: 210000,
                },
                {
                  department: 'Marketing',
                  budget: 200000,
                  spent: 185000,
                },
                {
                  department: 'HR',
                  budget: 150000,
                  spent: 95000,
                },
                {
                  department: 'Operations',
                  budget: 350000,
                  spent: 310000,
                },
                {
                  department: 'Admin',
                  budget: 100000,
                  spent: 65000,
                },
              ].map((dept, index) => {
                const remaining = dept.budget - dept.spent
                const percentUsed = (dept.spent / dept.budget) * 100
                const isOverBudget = percentUsed > 90
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {dept.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${dept.budget.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${dept.spent.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${remaining.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                        <div
                          className={`h-2.5 rounded-full ${isOverBudget ? 'bg-red-600' : 'bg-green-600'}`}
                          style={{
                            width: `${Math.min(percentUsed, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {percentUsed.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {percentUsed > 90 ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          At Risk
                        </span>
                      ) : percentUsed > 75 ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Warning
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          On Track
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


import {
  Phone,
  Mail,
  MessageCircle,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

export function BuyerSupport() {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I create a new procurement request?",
      answer:
        "Go to the Procurement Requests page and click 'Create Request'. Fill in the details such as category, budget, description, and required documents.",
    },
    {
      question: "How can I evaluate vendor bids?",
      answer:
        "Navigate to the Vendor Responses section. You can review technical and financial documents, compare scores, and provide evaluation feedback before awarding the contract.",
    },
    {
      question: "Can I edit a procurement request after publishing?",
      answer:
        "You can edit requests only before vendors start submitting bids. After bids are submitted, modifications require creating a new request or issuing an addendum.",
    },
    {
      question: "Where do I track contracts?",
      answer:
        "Contracts can be tracked under the 'Contracts' page. Each contract shows milestones, deadlines, compliance status, and payment history.",
    },
    {
      question: "How do I manage my budget allocations?",
      answer:
        "Use the 'Budget Tracking' page to monitor allocations, expenditures, and remaining funds across different procurement projects.",
    },
  ];

  return (
    <div
      className="p-6"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black mb-2">Buyer Support Center</h1>
        <p className="text-gray-600">Get help with managing procurement activities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-black mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <div className="font-medium text-black">Phone Support</div>
                  <div className="text-sm text-gray-600">1-800-BUYERHELP</div>
                  <div className="text-sm text-gray-500">Mon-Fri 9AM-5PM PST</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <div className="font-medium text-black">Email Support</div>
                  <div className="text-sm text-gray-600">buyer@procurewatch.gov</div>
                  <div className="text-sm text-gray-500">Response within 24 hours</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <div className="font-medium text-black">Live Chat</div>
                  <div className="text-sm text-gray-600">Available now</div>
                  <button className="text-sm text-black hover:underline">
                    Start Chat
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-black mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a
                href="#"
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
              >
                <span className="text-gray-700">Procurement Guidelines</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
              >
                <span className="text-gray-700">Evaluation Criteria</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
              >
                <span className="text-gray-700">Contract Management</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
              >
                <span className="text-gray-700">Budget Policies</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </a>
            </div>
          </div>
        </div>

        {/* FAQ + Submit Ticket */}
        <div className="lg:col-span-2">
          {/* FAQ Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-black mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() =>
                      setSelectedFaq(selectedFaq === index ? null : index)
                    }
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium text-black">{faq.question}</span>
                    <HelpCircle
                      className={`h-5 w-5 text-gray-400 transform transition-transform ${
                        selectedFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {selectedFaq === index && (
                    <div className="px-4 pb-3 text-gray-600">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Ticket */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-black mb-4">
              Submit Support Ticket
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Brief description of your issue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black">
                  <option>Procurement Requests</option>
                  <option>Vendor Evaluations</option>
                  <option>Contract Issues</option>
                  <option>Budget Tracking</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Provide detailed information about your issue"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}