import React, { useState } from "react";
import { FaSearch, FaGraduationCap } from "react-icons/fa";
import { FaUsersViewfinder } from "react-icons/fa6";

import "./SearchPage.css";
import { useNavigate } from "react-router-dom";
function SearchPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("faculty");
  const [results, setResults] = useState([]); // for backend data
  const navigate = useNavigate();
  const handleSearch = async () => {
    // 🔗 later connect to backend API here
    // Example:
    // const response = await fetch(/api/search?filter=${filter}&q=${query});
    // const data = await response.json();
    // setResults(data);
    navigate("/DepartmentDashboard");
    // setResults([]); // keep empty until backend is added
  };

  return (
    <div className="search-dashboard">
      {/* Header */}
      <header className="search-header">
        <h1>
          <FaUsersViewfinder className="search-logo" />Explore Faculty 
        </h1>
        <p className="search-subtitle">Smart Search For Smarter Access</p>
      </header>

      {/* Search Section */}
      <div className="search-box">
        <select
          className="search-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="faculty">Faculty</option>
          <option value="department">Department</option>
          
        </select>

        <input
          type="text"
          className="search-input"
          placeholder={`Search ${filter}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button className="search-btn" onClick={handleSearch}>
          <FaSearch /> Search
        </button>
      </div>

      {/* Results Section */}
      <div className="search-results">
        {results.length === 0 ? (
          <p className="no-results">No results yet. Try searching.</p>
        ) : (
          <table className="results-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{filter.charAt(0).toUpperCase() + filter.slice(1)} Name</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default SearchPage;