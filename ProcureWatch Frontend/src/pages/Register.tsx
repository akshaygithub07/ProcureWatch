import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { NavigateFunction } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="bg-white border border-gray-200 rounded-lg p-6 w-full max-w-md shadow-sm">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">
          Join Procurewatch
        </h2>
        <div className="flex bg-gray-100 rounded-md overflow-hidden mb-6">
          <button
            onClick={() => setIsRegistered(true)}
            className={`w-1/2 py-2 text-sm font-medium transition-colors ${
              isRegistered
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsRegistered(false)}
            className={`w-1/2 py-2 text-sm font-medium transition-colors ${
              !isRegistered
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Register
          </button>
        </div>
        {isRegistered ? (
          <SignInComponent navigate={navigate} />
        ) : (
          <RegisterComponent navigate={navigate} />
        )}
      </div>
    </div>
  );
}


function SignInComponent({ navigate }: { navigate: NavigateFunction }) {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm text-gray-700 mb-1">Email</label>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="example@email.com"
          type="email"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Password</label>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter your password"
          type="password"
        />
      </div>
      <button
        type="button"
        onClick={() => navigate("/vendor")}
        className="w-full bg-black text-white py-2 rounded-md text-sm hover:opacity-90 transition"
      >
        Submit
      </button>
    </form>
  );
}

function RegisterComponent({ navigate }: { navigate: NavigateFunction }) {
  const [selectedRole, setSelectedRole] = useState("Vendor");

  const roles = ["Vendor", "Buyer", "Auditor", "Citizen"];

  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm text-gray-700 mb-1">Select Role</label>
        <div className="grid grid-cols-2 gap-2">
          {roles.map((role) => (
            <button
              type="button"
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`py-2 text-sm rounded-md border ${
                selectedRole === role
                  ? "bg-black text-white border-black"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">First Name</label>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="John"
          type="text"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Last Name</label>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Doe"
          type="text"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Email</label>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="example@email.com"
          type="email"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Password</label>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter your password"
          type="password"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Confirm your password"
          type="password"
        />
      </div>
      <button
        type="button"
        onClick={() => navigate(`/${selectedRole}`)}
        className="w-full bg-black text-white py-2 rounded-md text-sm hover:opacity-90 transition"
      >
        Submit
      </button>
    </form>
  );
}

export default Register;
