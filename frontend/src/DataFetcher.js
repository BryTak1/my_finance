import React, { useEffect, useState } from 'react';
import './DataFetcher.css'; // Import the CSS file

const DataFetcher = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(6.11);
  const [criteria, setCriteria] = useState('eps');

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/data?filter=${filter}&criteria=${criteria}`);
      const result = await response.json();
      setData(result);
      console.log(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter, criteria]);

  return (
    <div className="container">
      <h1 className="title">Fetched Data</h1>
      <div className="input-group">
        <input
          type="text"
          className="input"
          placeholder="Enter filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <input
          type="text"
          className="input"
          placeholder="Enter criteria"
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
        />
        <button className="button" onClick={fetchData}>
          Fetch Data
        </button>
      </div>

      {data.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Revenue</th>
                <th>Net Income</th>
                <th>Gross Profit</th>
                <th>EPS</th>
                <th>Operating Income</th>
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
