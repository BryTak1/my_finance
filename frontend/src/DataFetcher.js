import React, { useEffect, useState } from 'react';
import './DataFetcher.css'; // Import the CSS file

const DataFetcher = () => {
  const [data, setData] = useState([]);
  const [filterBy, setFilter] = useState("revenue");
  const [criteria, setCriteria] = useState(0);
  const [sortBy, setSort] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedOperator, setSelectedOperator] = useState(">");
  const columns = ["date", "revenue", "netIncome", "grossProfit", "eps", "operatingIncome"];
  const operators = [">", "=", "<"];
  const filterData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/data?filter=${filterBy}&criteria=${criteria}&operator=${selectedOperator}`);
      const result = await response.json();
      setData(result);
      console.log(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    if (sortBy) {
      sortData();
    }
  }, [sortBy, sortDirection]);

  const setSortVars = async (column) => {
    setSort(column);
    // setDir(dir);
    setSelectedColumn(column);
    if (selectedColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortDirection("desc"); 
    }
  }
  const renderArrow = (column) => {
    if (selectedColumn !== column) return null; 
    return sortDirection === "asc" ? "↑" : "↓"; 
  };
  const sortData = async () => { 
    try { 
      const response = await fetch(`http://localhost:5000/api/data?sort=${sortBy}&order=${sortDirection}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  return (
    <div className="container">
      <h1 className="title">Apple Income Statements</h1>
      <div className="input-group">
      <select
          className="input"
          value={filterBy}
          onChange={(e) => setFilter(e.target.value)}
        >
          {columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
      </select>
      <select
          className="input"
          value={selectedOperator}
          onChange={(e) => setSelectedOperator(e.target.value)}
        >
          {operators.map((operator) => (
            <option key={operator} value={operator}>
              {operator}
            </option>
          ))}
        </select>
        <input
          type="number"
          className="input"
          placeholder="Enter value"
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
        />
        <button className="button" onClick={filterData}>
          Filter
        </button>
      </div>

      {data.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => (setSortVars('date'))} className={selectedColumn === "date" ? "highlight" : ""}>
                  Date {renderArrow("date")}</th>
                <th onClick={() => (setSortVars('revenue'))} className={selectedColumn === "revenue" ? "highlight" : ""}>
                  Revenue {renderArrow("revenue")}</th>
                <th onClick={() => (setSortVars('netIncome'))} className={selectedColumn === "netIncome" ? "highlight" : ""}>
                  Net Income {renderArrow("netIncome")}</th>
                <th onClick={() => (setSortVars('grossProfit'))} className={selectedColumn === "grossProfit" ? "highlight" : ""}>
                  Gross Profit {renderArrow("grossProfit")}</th>
                <th onClick={() => (setSortVars('eps'))} className={selectedColumn === "eps" ? "highlight" : ""}>
                  EPS {renderArrow("eps")}</th>
                <th onClick={() => (setSortVars('operatingIncome'))} className={selectedColumn === "operatingIncome" ? "highlight" : ""}>
                  Operating Income {renderArrow("operatingIncome")}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.revenue}</td>
                  <td>{item.netIncome}</td>
                  <td>{item.grossProfit}</td>
                  <td>{item.eps}</td>
                  <td>{item.operatingIncome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No data found</p>
      )}
    </div>
  );
};

export default DataFetcher;
