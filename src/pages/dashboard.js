import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import "./Dashboard.css";

function Dashboard() {
  const { instance } = useMsal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [monthFilter, setMonthFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // Default: newest first

  const statusMap = {
    1: "Draft",
    2: "Sent",
    3: "Paid",
    4: "Unpaid",
    5: "Overdue",
    6: "Cancel"
  };

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  // ✅ Fetch API data
  useEffect(() => {
    // 根据环境选择 API URL
    const API_URL = process.env.NODE_ENV === "production"
      ? "https://jacfintech.com/crmdemo/api/invoicecontact.php" // ✅ 替换成真实外部 API 地址
      : "/invoicecontact.php"; // ✅ 本地继续用 proxy

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.merged_data)) {
          setInvoices(data.merged_data);
        } else {
          setError("Invalid API response format");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Failed to fetch invoice data");
        setLoading(false);
      });
  }, []);

  // ✅ Filter logic
  const filteredInvoices = invoices.filter((item) => {
    const matchesMonth = monthFilter
      ? item.date.startsWith(monthFilter)
      : true;
    const matchesStatus = statusFilter
      ? statusMap[item.status] === statusFilter
      : true;
    return matchesMonth && matchesStatus;
  });

  // ✅ Sort logic
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    return sortOrder === "newest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  });

  // ✅ Generate month options (sorted newest → oldest)
  const uniqueMonths = [
    ...new Set(invoices.map((item) => item.date.slice(0, 7)))
  ].sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <h1>Dashboard</h1>
      </header>

      {/* Sidebar */}
      <nav className={`sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          <li>Profile</li>
          <li>Settings</li>
          <li onClick={handleLogout} className="logout-link">Logout</li>
        </ul>
      </nav>

      {/* Filter Bar */}
      <div className="filter-bar">
        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
          <option value="">All Months</option>
          {uniqueMonths.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          {Object.values(statusMap).map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : sortedInvoices.length === 0 ? (
          <p>No invoices found</p>
        ) : (
          <>
            {/* Desktop Table */}
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Company</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedInvoices.map((item, index) => (
                  <tr key={index}>
                    <td>{item.prefix}{item.number}</td>
                    <td>{item.date}</td>
                    <td>{item.total} {item.symbol}</td>
                    <td>{statusMap[item.status] || "Unknown"}</td>
                    <td>{item.customer_name}</td>
                    <td>{item.customer_phone}</td>
                    <td>
                      <a
                        href={`https://wa.me/${item.customer_phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-button"
                      >
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="invoice-cards">
              {sortedInvoices.map((item, index) => (
                <div key={index} className="invoice-card">
                  <h3>{item.prefix}{item.number}</h3>
                  <p><strong>Date:</strong> {item.date}</p>
                  <p><strong>Amount:</strong> {item.total} {item.symbol}</p>
                  <p><strong>Status:</strong> {statusMap[item.status] || "Unknown"}</p>
                  <p><strong>Company:</strong> {item.customer_name}</p>
                  <p><strong>Phone:</strong> {item.customer_phone}</p>
                  <a
                    href={`https://wa.me/${item.customer_phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-button"
                  >
                    WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;