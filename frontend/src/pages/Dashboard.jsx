import React from "react";
import { Link, useNavigate  } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
} from "lucide-react";
import UserDropdown from "../components/UserDropdown";

// ------------------- DATA -------------------
const data = {
  monthly_summary: [
    { DrCr: "cr", Month: "2022-01", amount: 5808.09 },
    { DrCr: "db", Month: "2022-01", amount: 42984.0 },
    { DrCr: "cr", Month: "2022-02", amount: 58228.0 },
    { DrCr: "db", Month: "2022-02", amount: 90535.0 },
    { DrCr: "cr", Month: "2022-03", amount: 68902.0 },
    { DrCr: "db", Month: "2022-03", amount: 252428.0 },
    { DrCr: "cr", Month: "2022-04", amount: 86402.0 },
    { DrCr: "db", Month: "2022-04", amount: 217166.0 },
    { DrCr: "cr", Month: "2022-05", amount: 72591.09 },
    { DrCr: "db", Month: "2022-05", amount: 61374.0 },
    { DrCr: "cr", Month: "2022-06", amount: 112522.09 },
    { DrCr: "db", Month: "2022-06", amount: 69406.0 },
    { DrCr: "cr", Month: "2022-07", amount: 67412.0 },
    { DrCr: "db", Month: "2022-07", amount: 210017.0 },
    { DrCr: "cr", Month: "2022-08", amount: 427395.09 },
    { DrCr: "db", Month: "2022-08", amount: 58588.0 },
    { DrCr: "cr", Month: "2022-09", amount: 119758.51 },
    { DrCr: "db", Month: "2022-09", amount: 406404.01 },
    { DrCr: "cr", Month: "2022-10", amount: 16958.02 },
    { DrCr: "db", Month: "2022-10", amount: 95400.0 },
    { DrCr: "cr", Month: "2022-11", amount: 117857.0 },
    { DrCr: "db", Month: "2022-11", amount: 62485.0 },
    { DrCr: "cr", Month: "2022-12", amount: 104600.29 },
    { DrCr: "db", Month: "2022-12", amount: 69960.0 },
    { DrCr: "cr", Month: "2023-01", amount: 27512.09 },
    { DrCr: "db", Month: "2023-01", amount: 97607.0 },
    { DrCr: "cr", Month: "2023-02", amount: 92726.0 },
    { DrCr: "db", Month: "2023-02", amount: 99225.0 },
    { DrCr: "cr", Month: "2023-03", amount: 12501.0 },
    { DrCr: "db", Month: "2023-03", amount: 36710.0 },
    { DrCr: "cr", Month: "2023-04", amount: 79586.0 },
    { DrCr: "db", Month: "2023-04", amount: 43692.0 },
    { DrCr: "cr", Month: "2023-05", amount: 86858.0 },
    { DrCr: "db", Month: "2023-05", amount: 89978.0 },
    { DrCr: "cr", Month: "2023-06", amount: 71449.0 },
    { DrCr: "db", Month: "2023-06", amount: 98270.0 },
    { DrCr: "cr", Month: "2023-07", amount: 107946.18 },
    { DrCr: "db", Month: "2023-07", amount: 106584.98 },
    { DrCr: "cr", Month: "2023-08", amount: 72170.25 },
    { DrCr: "db", Month: "2023-08", amount: 56550.0 },
    { DrCr: "cr", Month: "2023-09", amount: 103427.09 },
    { DrCr: "db", Month: "2023-09", amount: 93876.0 },
    { DrCr: "cr", Month: "2023-10", amount: 116648.8 },
    { DrCr: "db", Month: "2023-10", amount: 58356.0 },
  ],
  total_summary: [
    { DrCr: "cr", amount: 2029258.59 },
    { DrCr: "db", amount: 2417595.99 },
  ],
};

// ------------------- PROCESSING -------------------
const formattedData = data.monthly_summary.reduce((acc, curr) => {
  const month = curr.Month;
  if (!acc[month]) acc[month] = { Month: month, Credit: 0, Debit: 0 };
  if (curr.DrCr === "cr") acc[month].Credit = curr.amount;
  else acc[month].Debit = curr.amount;
  return acc;
}, {});

const monthlyData = Object.values(formattedData);

const totalCredit = data.total_summary.find((d) => d.DrCr === "cr").amount;
const totalDebit = data.total_summary.find((d) => d.DrCr === "db").amount;
const netBalance = totalCredit - totalDebit;

const pieData = [
  { name: "Credit", value: totalCredit, color: "#4ade80" },
  { name: "Debit", value: totalDebit, color: "#f87171" },
];

// ------------------- HELPERS -------------------
const formatCurrency = (val) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);

// ------------------- COMPONENT -------------------
const Dashboard = () => {

  const navigate = useNavigate(); 
  const token = localStorage.getItem("token")
  let username = "";
  
  if(token) {
    try {
      const decoded = jwtDecode(token)
      username = decoded.username;
    }
    catch(err) {
      console.log("invalid token(frontend)",err)
    }
  }
  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200">
      {/* Header */}
      <header className="bg-slate-900/70 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="#" className="flex items-center gap-2">
            <div className="w-6 h-6 text-emerald-400">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-emerald-400">FinWell</h1>
          </Link>
        </div>

        <nav className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-emerald-400 border-b-2 border-emerald-400"
          >
            Dashboard
          </Link>
          <Link
            to="/chat"
            className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors"
          >
            Chatbot
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/")
            }}
            className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors"
          >
            Logout
          </button>
        </nav>

        {/* <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center rounded-full">
              <span className="material-symbols-outlined text-grey text-4xl hover:text-emerald-400 transition-colors">
                account_circle
              </span>
            </div>
            <span className="text-lg font-medium text-gray-300 hover:text-emerald-400 transition-colors">{username || "User"}</span>
          </div>
        </div> */}
        <UserDropdown/>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-emerald-400">
          Financial Dashboard
        </h1>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Total Credit */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Credit</p>
                <p className="text-3xl font-bold text-green-400">
                  {formatCurrency(totalCredit)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-900 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          {/* Total Debit */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Debit</p>
                <p className="text-3xl font-bold text-red-400">
                  {formatCurrency(totalDebit)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-red-900 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </div>

          {/* Net Balance */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Net Balance</p>
                <p
                  className={`text-3xl font-bold ${
                    netBalance >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {formatCurrency(Math.abs(netBalance))}
                </p>
                <p className="text-sm text-gray-500">
                  {netBalance >= 0 ? "Surplus" : "Deficit"}
                </p>
              </div>
              <div
                className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                  netBalance >= 0 ? "bg-green-900" : "bg-red-900"
                }`}
              >
                <DollarSign
                  className={`h-6 w-6 ${
                    netBalance >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* GRAPHS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Line Chart */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Monthly Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="Month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Credit" stroke="#4ade80" />
                <Line type="monotone" dataKey="Debit" stroke="#f87171" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Credit vs Debit</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="Month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Credit" fill="#4ade80" />
                <Bar dataKey="Debit" fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 col-span-1 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-emerald-400" /> Credit vs
              Debit Distribution
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={140}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
