import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  ShieldCheck,
  Truck,
  Building,
  Briefcase,
  Eye,
  BadgeCheck,
} from "lucide-react";

function HomePage() {
  const navigate = useNavigate();

  const [stats] = useState([
    {
      label: "Tenders Published",
      value: "3,248",
      change: "+320 since last quarter",
    },
    {
      label: "Total Procurement Value",
      value: "₹12.4 Billion",
      change: "+₹1.6B YoY",
    },
    { label: "Verified Vendors", value: "1,207", change: "+58 this month" },
    {
      label: "Deliveries Completed",
      value: "5,961",
      change: "+1,040 since April",
    },
    { label: "Contracts Flagged", value: "89", change: "+12 this quarter" },
    {
      label: "On-Time Delivery Rate",
      value: "94.3%",
      change: "+1.8% from last year",
    },
  ]);

  const [tenders] = useState([
    {
      title: "Office Furniture Supply",
      dept: "Urban Development",
      deadline: "Sept 12",
      budget: "₹5,00,000",
    },
    {
      title: "Road Maintenance Materials",
      dept: "Public Works",
      deadline: "Sept 14",
      budget: "₹2,20,000",
    },
    {
      title: "School Meal Services",
      dept: "Education Board",
      deadline: "Sept 18",
      budget: "₹12,00,000",
    },
  ]);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Hero Section */}
      <header className="bg-white shadow-sm py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-4">ProcureWatch</h1>
          <p className="text-xl text-gray-800 mb-4 font-medium">
            Shining a Light on Public Spending
          </p>
          <p className="text-gray-600 mb-6">
            A blockchain-powered platform enabling citizens, officials, and
            vendors to track government procurement in real-time. Built for
            transparency, accountability, and trust.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <button
              onClick={() => navigate("/tenders")}
              className="px-6 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-900 transition outline-none focus:ring-2 focus:ring-gray-700"
            >
              Explore Tenders
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2 bg-gray-100 text-black rounded-lg text-sm hover:bg-gray-200 transition outline-none focus:ring-2 focus:ring-gray-300"
            >
              Login / Register
            </button>
          </div>
          {/* <img
            src="https://illustrations.popsy.co/gray/public-service.svg"
            alt="Government procurement illustration"
            className="mx-auto w-full max-w-md rounded-lg"
          /> */}
        </div>
      </header>

      {/* Live Transparency Stats */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">
          Live Transparency Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="bg-gray-50 p-6 rounded-xl shadow border border-gray-200 text-center hover:shadow-lg transition"
            >
              <h3 className="text-2xl font-bold text-black mb-1">{s.value}</h3>
              <p className="text-gray-800 text-sm mb-2">{s.label}</p>
              <p className="text-gray-600 text-xs">{s.change}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-4 text-center">
          Data updated every 10 minutes via blockchain records.
        </p>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-white border-t border-b border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-10">
          How the Platform Works – Simple, Transparent, Secure
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
          <div>
            <FileText className="mx-auto mb-4 text-gray-500" size={36} />
            <h3 className="text-lg font-semibold text-black mb-2">
              1. Post & Bid
            </h3>
            <p className="text-gray-700">
              Govt departments post needs. Verified vendors submit bids online.
            </p>
          </div>
          <div>
            <ShieldCheck className="mx-auto mb-4 text-gray-500" size={36} />
            <h3 className="text-lg font-semibold text-black mb-2">
              2. Smart Evaluation
            </h3>
            <p className="text-gray-700">
              Bids are auto-checked for compliance, pricing, and past
              performance.
            </p>
          </div>
          <div>
            <Truck className="mx-auto mb-4 text-gray-500" size={36} />
            <h3 className="text-lg font-semibold text-black mb-2">
              3. Deliver & Track
            </h3>
            <p className="text-gray-700">
              Vendors deliver with QR codes. Deliveries verified, payments
              triggered.
            </p>
          </div>
        </div>
      </section>

      {/* Choose Role */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">
          Who Are You? Choose Your Role
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate("/buyer")}
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-gray-100 transition text-left shadow flex flex-col"
          >
            <Building className="mb-3 text-black" size={26} />
            <h3 className="text-lg font-semibold mb-2">Government Buyer</h3>
            <p className="text-sm text-gray-600">
              Create tenders, evaluate bids, and manage purchases securely.
            </p>
          </button>
          <button
            onClick={() => navigate("/vendor")}
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-gray-100 transition text-left shadow flex flex-col"
          >
            <Briefcase className="mb-3 text-black" size={26} />
            <h3 className="text-lg font-semibold mb-2">Vendor / Supplier</h3>
            <p className="text-sm text-gray-600">
              Discover opportunities and bid for government contracts.
            </p>
          </button>
          <button
            onClick={() => navigate("/citizen")}
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-gray-100 transition text-left shadow flex flex-col"
          >
            <Eye className="mb-3 text-black" size={26} />
            <h3 className="text-lg font-semibold mb-2">Citizen Observer</h3>
            <p className="text-sm text-gray-600">
              Explore contracts, track spending, and flag suspicious activity.
            </p>
          </button>
          <button
            onClick={() => navigate("/auditor")}
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-gray-100 transition text-left shadow flex flex-col"
          >
            <BadgeCheck className="mb-3 text-black" size={26} />
            <h3 className="text-lg font-semibold mb-2">Auditor / Agency</h3>
            <p className="text-sm text-gray-600">
              Access full audit trails, compliance dashboards, and analytics.
            </p>
          </button>
        </div>
      </section>

      {/* Featured Tenders */}
      <section className="py-16 px-6 bg-white border-t border-b border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-8">
          Featured Tenders
        </h2>
        <div className="overflow-x-auto max-w-4xl mx-auto rounded-2xl shadow-lg border border-gray-300 bg-gray-50">
          <table className="w-full text-sm rounded-2xl overflow-hidden">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-4 font-semibold text-left">Title</th>
                <th className="p-4 font-semibold text-left">Department</th>
                <th className="p-4 font-semibold text-left">Deadline</th>
                <th className="p-4 font-semibold text-left">Budget</th>
              </tr>
            </thead>
            <tbody>
              {tenders.map((t, idx) => (
                <tr
                  key={idx}
                  className={
                    "transition " +
                    (idx % 2 === 0 ? "bg-white" : "bg-gray-100") +
                    " hover:bg-gray-200/80"
                  }
                >
                  <td className="p-4 align-middle rounded-l-2xl border-b border-gray-200 font-medium">
                    {t.title}
                  </td>
                  <td className="p-4 align-middle border-b border-gray-200">
                    {t.dept}
                  </td>
                  <td className="p-4 align-middle border-b border-gray-200">
                    {t.deadline}
                  </td>
                  <td className="p-4 align-middle rounded-r-2xl border-b border-gray-200 font-semibold text-black">
                    {t.budget}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/tenders")}
            className="px-6 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-900 transition"
          >
            View All Open Tenders
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-10">
          What People Are Saying
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow text-sm">
            <p className="text-gray-700 italic">
              “ProcureWatch has completely transformed how we monitor public
              spending in our district.”
            </p>
            <p className="text-right text-gray-500 mt-4">– District Auditor</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-sm">
            <p className="text-gray-700 italic">
              “Bidding is fair, fast, and transparent. No more hidden
              contracts.”
            </p>
            <p className="text-right text-gray-500 mt-4">
              – Vendor, Akash Industries
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-sm">
            <p className="text-gray-700 italic">
              “Finally, a platform where we can see how tax money is used in
              real-time.”
            </p>
            <p className="text-right text-gray-500 mt-4">
              – Civic Group Leader
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-white border-t border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="max-w-4xl mx-auto space-y-6 text-sm">
          <div>
            <h4 className="font-semibold text-black">Is registration free?</h4>
            <p className="text-gray-600">
              Yes, anyone can register and explore tenders for free.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-black">
              How secure is this platform?
            </h4>
            <p className="text-gray-600">
              All transactions are verified using blockchain to ensure integrity
              and traceability.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-black">
              Can citizens report suspicious contracts?
            </h4>
            <p className="text-gray-600">
              Absolutely. We have a built-in reporting mechanism for
              transparency and accountability.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-black text-white py-16 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Ready to Make Public Spending Transparent?
        </h2>
        <p className="mb-6 text-gray-300">
          Join thousands of vendors, citizens, and officials using ProcureWatch
          daily.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="bg-white text-black px-6 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
        >
          Get Started Now
        </button>
      </section>
    </div>
  );
}

export default HomePage;
