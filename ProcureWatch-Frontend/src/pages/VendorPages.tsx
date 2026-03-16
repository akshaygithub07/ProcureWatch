import React, { useState,useEffect } from 'react'
import type { FormEvent } from 'react'
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  Clock,
  FileText,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  MapPin,
  Building,
  X,
  User, 
} from 'lucide-react'
// Active Tenders Page

type Tender = {
  id: string
  title: string
  category: string
  budget: string
  deadline: string
  location: string
  description: string
  requirements: string[]
  publishedDate: string
  bidsCount: number
}

type Bid = {
  price: number
  deliveryTime: number
  proposal: string
  tenderId: string
}

export function ActiveTenders() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showBidModal, setShowBidModal] = useState<boolean>(false)
  const [currentTender, setCurrentTender] = useState<Tender | null>(null)
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const extractCN = (x509:any) => {
  const match = x509.match(/CN=([^:\/]+)/);
  return match ? match[1] : "Unknown";
};

  useEffect(() => {
  const fetchTenders = async () => {
    try {
      setLoading(true);

    const res = await fetch("http://localhost:3000/api/tenders/active", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: "ProcurementOfficer-Rama05"
      })
    });
      const json = await res.json();
      console.log("Fabric tenders:", json.data);
      if (!json.success) {
        throw new Error("Failed to fetch tenders");
      }

      // 1. Take only ACTIVE (OPEN) tenders
      // const openTenders = json.data.filter(
      //   (tender:any) => tender.status === "OPEN"
      // );

      // 2. Convert blockchain tenders → UI format
      const formatted = json.data.map((tender:any) => ({
        id: tender.tenderId,
        title: tender.description,
        category: "Procurement",
        budget: `₹${tender.minAmount.toLocaleString()} - ₹${tender.maxAmount.toLocaleString()}`,
        deadline: tender.deadline || "2024-12-31",
        location: tender.location || "Remote",
        description: tender.description,
        requirements: tender.requirements || [],
        publishedDate: tender.createdAt.split("T")[0],
        bidsCount: tender.bidsCount || 0,
      }));

      setTenders(formatted);
      console.log(tenders)
    } catch (err) {
      console.error(err);
      setError("Failed to load tenders");
    } finally {
      setLoading(false);
    }
  };

  fetchTenders();
}, []);

  type BidDetails = Omit<Bid, 'tenderId'> & {
    validity?: number
    warranty?: string
  }

  const [bidDetails, setBidDetails] = useState<BidDetails>({
    price: 0,
    deliveryTime: 0,
    proposal: '',
    validity: undefined,
    warranty: '',
  })

//   const tenders: Tender[] = [
//     {
//       id: 'T001',
//       title: 'Road Construction Project - Highway 101',
//       category: 'Infrastructure',
//       budget: '$2.5M',
//       deadline: '2024-02-15',
//       location: 'San Francisco, CA',
//       description:
//         'Complete reconstruction of 5-mile highway section including drainage systems.',
//       requirements: [
//         'Licensed Contractor',
//         'Previous Highway Experience',
//         'Equipment Available',
//       ],
//       publishedDate: '2024-01-10',
//       bidsCount: 12,
//     },
//     {
//       id: 'T002',
//       title: 'IT Equipment Procurement',
//       category: 'Technology',
//       budget: '$850K',
//       deadline: '2024-02-20',
//       location: 'Remote/Multiple Locations',
//       description:
//         'Supply of laptops, servers, and networking equipment for government offices.',
//       requirements: [
//         'Certified Vendor',
//         'Warranty Support',
//         'Installation Service',
//       ],
//       publishedDate: '2024-01-12',
//       bidsCount: 8,
//     },
//     {
//       id: 'T003',
//       title: 'Healthcare Supplies Contract',
//       category: 'Healthcare',
//       budget: '$1.2M',
//       deadline: '2024-02-25',
//       location: 'Los Angeles, CA',
//       description:
//         'Annual supply contract for medical equipment and consumables.',
//       requirements: [
//         'FDA Approved Products',
//         'Distribution Network',
//         'Quality Certifications',
//       ],
//       publishedDate: '2024-01-15',
//       bidsCount: 15,
//     },
//   ]

  const categories: string[] = [
    'all',
    'Infrastructure',
    'Technology',
    'Healthcare',
    'Education',
  ]

  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch = tender.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || tender.category === selectedCategory
    return matchesSearch && matchesCategory
  })

//   const handleSubmitBid = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     if (!currentTender) return

//     const newBid: Bid = {
//       tenderId: currentTender.id,
//       price: bidDetails.price,
//       deliveryTime: bidDetails.deliveryTime,
//       proposal: bidDetails.proposal,
//     }

//     console.log('Bid submitted:', newBid)
//     // TODO: Send this to backend API

//     setBidDetails({ price: 0, deliveryTime: 0, proposal: '' })
//     setShowBidModal(false)
//   }
const handleSubmitBid = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!currentTender) return;

  const payload = {
    tenderId: currentTender.id,
    amount: bidDetails.price,
    proposal: bidDetails.proposal,
    user: "Vendor-Jay"   // change later if you store vendor login
  };

  try {
    const res = await fetch("http://localhost:3000/api/tenders/bid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || "Bid failed");
    }

    alert("Bid submitted successfully ✅");
    setShowBidModal(false);
    setBidDetails({ price: 0, deliveryTime: 0, proposal: "" });
  } catch (err: any) {
    console.error(err);
    alert("Failed to submit bid ❌");
  }
};


  return (
    <div className="p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black mb-2">Active Tenders</h1>
        <p className="text-gray-600">
          Browse and bid on available procurement opportunities
        </p>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tenders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tenders List */}
      <div className="space-y-4">
        {filteredTenders.map((tender) => (
          <div
            key={tender.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-black mb-2">
                  {tender.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    {tender.category}
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {tender.budget}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {tender.location}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due: {tender.deadline}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {tender.bidsCount} bids
                </span>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{tender.description}</p>
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Requirements:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {tender.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Published: {tender.publishedDate}
              </span>
              <div className="space-x-3">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  <Eye className="h-4 w-4 inline mr-2" />
                  View Details
                </button>
                <button
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  onClick={() => {
                    setCurrentTender(tender)
                    setShowBidModal(true)
                  }}
                >
                  Submit Bid
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Bid Modal */}
      {showBidModal && currentTender && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className='absolute left-0 right-0 bottom-0 top-0 bg-black opacity-50'/>
    <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl overflow-y-auto max-h-[90vh] z-100">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Submit Bid – {currentTender.title}
      </h2>

      <form onSubmit={handleSubmitBid} className="space-y-6">
        {/* Bid Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bid Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={bidDetails.price}
            onChange={(e) =>
              setBidDetails({ ...bidDetails, price: Number(e.target.value) })
            }
            required
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your bid amount"
          />
        </div>

        {/* Delivery Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Delivery Time (in days) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={bidDetails.deliveryTime}
            onChange={(e) =>
              setBidDetails({
                ...bidDetails,
                deliveryTime: Number(e.target.value),
              })
            }
            required
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="e.g., 30"
          />
        </div>

        {/* Proposal */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Proposal / Notes
          </label>
          <textarea
            value={bidDetails.proposal}
            onChange={(e) =>
              setBidDetails({ ...bidDetails, proposal: e.target.value })
            }
            rows={4}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Briefly describe your approach, expertise, or key highlights..."
          ></textarea>
        </div>

        {/* Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Documents (Technical / Financial) 
          </label>
          <input
            type="file"
            multiple
            className="mt-1 block w-full text-sm text-gray-600 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Allowed formats: PDF, DOCX, XLSX, ZIP (max 10MB each)
          </p>
        </div>

        {/* Validity Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bid Validity (in days)
          </label>
          <input
            type="number"
            value={bidDetails.validity || ""}
            onChange={(e) =>
              setBidDetails({ ...bidDetails, validity: Number(e.target.value) })
            }
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="e.g., 90"
          />
        </div>

        {/* Warranty/Guarantee */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Warranty / Guarantee (if applicable)
          </label>
          <input
            type="text"
            value={bidDetails.warranty || ""}
            onChange={(e) =>
              setBidDetails({ ...bidDetails, warranty: e.target.value })
            }
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="e.g., 1 year product warranty"
          />
        </div>

        {/* Compliance Checkbox */}
        <div className="flex items-start">
          <input
            id="compliance"
            type="checkbox"
            required
            className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
          />
          <label
            htmlFor="compliance"
            className="ml-2 text-sm text-gray-700"
          >
            I confirm that this bid complies with the tender requirements.
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowBidModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Submit Bid
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  )
}
// My Bids Page
export function MyBids() {

  // ✅ REPLACED static bids with state
  const [bids, setBids] = useState<any[]>([])
  const [selectedBid, setSelectedBid] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // ✅ ADDED fetch function
  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/tenders/bids/my",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // 👈 send identity
            },
            body: JSON.stringify({
                user: "Vendor-Jay"
              })
          }
        )

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error)
        }

        setBids(result.data)
      } catch (err: any) {
        console.error("Error fetching bids:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMyBids()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Won":
        return "bg-green-100 text-green-700 border-green-200"
      case "Shortlisted":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Under Review":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Won":
        return <CheckCircle className="h-4 w-4" />
      case "Rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black mb-2">My Bids</h1>
        <p className="text-gray-600">Track the status of your submitted bids</p>
      </div>

      {/* ✅ Loading & Error */}
      {loading && <p>Loading bids...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ Stats Cards (now dynamic) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-black">{bids.length}</div>
          <div className="text-sm text-gray-600">Total Bids</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {bids.filter(b => b.status === "Won").length}
          </div>
          <div className="text-sm text-gray-600">Won</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {bids.filter(b => b.status === "Under Review").length}
          </div>
          <div className="text-sm text-gray-600">Under Review</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">
            {bids.filter(b => b.status === "Shortlisted").length}
          </div>
          <div className="text-sm text-gray-600">Shortlisted</div>
        </div>
      </div>

      {/* ✅ Bids Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bid Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {bids.map((bid, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-black">
                        {bid.tenderDescription}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {bid.tenderId}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-black font-medium">
                    {bid.amount}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(bid.status)}`}>
                      {getStatusIcon(bid.status)}
                      <span className="ml-1">{bid.status}</span>
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {bid.submittedDate}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedBid(bid)}
                      className="text-black hover:text-gray-700"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  )
}
// Contracts Page
export function Contracts() {

  // ✅ Replaced static contracts with state
  const [contracts, setContracts] = useState<any[]>([])
  const [selectedContract, setSelectedContract] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // ✅ Fetch from backend
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/tenders/my-awarded",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // 👈 send identity
            },
            body: JSON.stringify({
                user: "Vendor-Jay"
              })
          }
        )

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error)
        }

        // 🔥 Convert awarded tenders → contract format
        const formatted = result.data.map((tender: any) => {

          const status =
            tender.status === "Completed"
              ? "Completed"
              : "Active"

          return {
            id: tender.tenderId,
            title: tender.description,
            contractValue: `₹${tender.awardedAmount || tender.maxAmount}`,
            startDate: tender.startDate || tender.createdAt?.split("T")[0],
            endDate: tender.deadline,
            status: status,
            progress: status === "Completed" ? 100 : 50,
            client: tender.buyer || "Government Department",
            paymentStatus: status === "Completed" ? "Completed" : "In Progress",
            nextMilestone: "Ongoing Execution",
            milestoneDate: tender.deadline,
            description: tender.description,
          }
        })

        setContracts(formatted)

      } catch (err: any) {
        console.error("Error fetching contracts:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchContracts()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700'
      case 'Completed':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black mb-2">Contracts</h1>
        <p className="text-gray-600">
          Manage your active and completed contracts
        </p>
      </div>

      {/* ✅ Loading & Error */}
      {loading && <p>Loading contracts...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ Dynamic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-black">
            ₹{contracts
              .reduce((sum, c) =>
                sum + Number(c.contractValue.replace(/[^\d.]/g, "")), 0)
              .toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Contract Value</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            {contracts.filter(c => c.status === "Active").length}
          </div>
          <div className="text-sm text-gray-600">Active Contracts</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-blue-600">
            {contracts.filter(c => c.status === "Completed").length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      {/* ✅ Contracts List */}
      <div className="space-y-6">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  {contract.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Contract ID: {contract.id}</span>
                  <span>Client: {contract.client}</span>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}
              >
                {contract.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500">Contract Value</div>
                <div className="font-semibold text-black">
                  {contract.contractValue}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Duration</div>
                <div className="font-semibold text-black">
                  {contract.startDate} - {contract.endDate}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Payment Status</div>
                <div className="font-semibold text-black">
                  {contract.paymentStatus}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Next Milestone</div>
                <div className="font-semibold text-black">
                  {contract.nextMilestone}
                </div>
                <div className="text-sm text-gray-500">
                  {contract.milestoneDate}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
// Support Page
export function Support() {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null)
  const faqs = [
    {
      question: 'How do I submit a bid?',
      answer:
        "To submit a bid, navigate to the Active Tenders page, select the tender you're interested in, and click 'Submit Bid'. You'll need to provide your bid amount, technical proposal, and required documents.",
    },
    {
      question: 'What documents are required for bidding?',
      answer:
        'Required documents typically include: business license, tax certificates, technical qualifications, financial statements, and project references. Specific requirements are listed in each tender.',
    },
    {
      question: 'How can I track my bid status?',
      answer:
        "You can track all your bids in the 'My Bids' section. The system will show real-time updates on evaluation progress, ranking, and final results.",
    },
    {
      question: 'When will I receive payment?',
      answer:
        'Payment terms are specified in each contract. Typically, payments are processed within 30 days of milestone completion and invoice approval.',
    },
    {
      question: 'How do I update my vendor profile?',
      answer:
        "Click on your profile icon in the top navigation and select 'Profile Settings'. You can update your company information, certifications, and contact details.",
    },
  ]
  return (
    <div
      className="p-6"
      style={{
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black mb-2">Support Center</h1>
        <p className="text-gray-600">
          Get help with your procurement activities
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-black mb-4">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <div className="font-medium text-black">Phone Support</div>
                  <div className="text-sm text-gray-600">1-800-PROCURE</div>
                  <div className="text-sm text-gray-500">
                    Mon-Fri 9AM-5PM PST
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <div className="font-medium text-black">Email Support</div>
                  <div className="text-sm text-gray-600">
                    vendor@procurewatch.gov
                  </div>
                  <div className="text-sm text-gray-500">
                    Response within 24 hours
                  </div>
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
            <h3 className="text-lg font-semibold text-black mb-4">
              Quick Links
            </h3>
            <div className="space-y-2">
              <a
                href="#"
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
              >
                <span className="text-gray-700">Vendor Guidelines</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
              >
                <span className="text-gray-700">Bidding Tutorial</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
              >
                <span className="text-gray-700">Contract Templates</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
              >
                <span className="text-gray-700">Payment Information</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </a>
            </div>
          </div>
        </div>
        {/* FAQ Section */}
        <div className="lg:col-span-2">
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
                    <span className="font-medium text-black">
                      {faq.question}
                    </span>
                    <HelpCircle
                      className={`h-5 w-5 text-gray-400 transform transition-transform ${selectedFaq === index ? 'rotate-180' : ''}`}
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
                  <option>Bidding Issues</option>
                  <option>Payment Questions</option>
                  <option>Technical Problems</option>
                  <option>Account Management</option>
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
  )
}
