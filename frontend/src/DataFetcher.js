import React, { useEffect, useState } from 'react';
import './DataFetcher.css'; // Import the CSS file

const DataFetcher = () => {
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState("dateRange");
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [revenueRange, setRevenueRange] = useState({ min: '', max: '' });
  const [netIncomeRange, setNetIncomeRange] = useState({ min: '', max: '' });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Fetch data from the third-party API directly within React
  const fetchData = async () => {
    try {
      const response = await fetch('https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=Q2bmZrKaXniJkNcHc7vPTOe6s6YkRqxx');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Call fetchData on component mount
  }, []);

  // Sorting logic
  const sortData = (key) => {
    let direction = 'descending';
    if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setData(sortedData);
  };

  // Helper to get arrow for sorting direction
  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return '';
  };

  // Filter logic based on filterType
  const filterData = () => {
    let filteredData = [...data];

    if (filterType === 'dateRange') {
      if (dateRange.start && dateRange.end) {
        filteredData = filteredData.filter(item => 
          parseInt(item.calendarYear) >= parseInt(dateRange.start) &&
          parseInt(item.calendarYear) <= parseInt(dateRange.end)
        );
      }
    }

    if (filterType === 'revenueRange') {
      if (revenueRange.min && revenueRange.max) {
        filteredData = filteredData.filter(item =>
          item.revenue >= parseFloat(revenueRange.min) &&
          item.revenue <= parseFloat(revenueRange.max)
        );
      }
    }

    if (filterType === 'netIncomeRange') {
      if (netIncomeRange.min && netIncomeRange.max) {
        filteredData = filteredData.filter(item =>
          item.netIncome >= parseFloat(netIncomeRange.min) &&
          item.netIncome <= parseFloat(netIncomeRange.max)
        );
      }
    }

    return filteredData;
  };

  return (
    <div className="container">
      <h1 className="title">Apple Income Statements</h1>
      <div className="input-group">
        <select
          className="input"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="dateRange">Date Range</option>
          <option value="revenueRange">Revenue Range</option>
          <option value="netIncomeRange">Net Income Range</option>
        </select>

        {filterType === "dateRange" && (
          <div>
            <input
              type="number"
              className="input"
              placeholder="Start Year"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
            <input
              type="number"
              className="input"
              placeholder="End Year"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
        )}

        {filterType === "revenueRange" && (
          <div>
            <input
              type="number"
              className="input"
              placeholder="Min Revenue"
              value={revenueRange.min}
              onChange={(e) => setRevenueRange({ ...revenueRange, min: e.target.value })}
            />
            <input
              type="number"
              className="input"
              placeholder="Max Revenue"
              value={revenueRange.max}
              onChange={(e) => setRevenueRange({ ...revenueRange, max: e.target.value })}
            />
          </div>
        )}

        {filterType === "netIncomeRange" && (
          <div>
            <input
              type="number"
              className="input"
              placeholder="Min Net Income"
              value={netIncomeRange.min}
              onChange={(e) => setNetIncomeRange({ ...netIncomeRange, min: e.target.value })}
            />
            <input
              type="number"
              className="input"
              placeholder="Max Net Income"
              value={netIncomeRange.max}
              onChange={(e) => setNetIncomeRange({ ...netIncomeRange, max: e.target.value })}
            />
          </div>
        )}

        <button className="button" onClick={fetchData}>
          Filter
        </button>
      </div>

      {data.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => sortData('date')}>
                  Date {getSortArrow('date')}
                </th>
                <th onClick={() => sortData('revenue')}>
                  Revenue {getSortArrow('revenue')}
                </th>
                <th onClick={() => sortData('netIncome')}>
                  Net Income {getSortArrow('netIncome')}
                </th>
                <th>Gross Profit</th>
                <th>EPS</th>
                <th>Operating Income</th>
              </tr>
            </thead>
            <tbody>
              {filterData().map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{(item.revenue / 1e9).toFixed(2)} Billion</td>
                  <td>{(item.netIncome / 1e9).toFixed(2)} Billion</td>
                  <td>{(item.grossProfit / 1e9).toFixed(2)} Billion</td>
                  <td>{item.eps}</td>
                  <td>{(item.operatingIncome / 1e9).toFixed(2)} Billion</td>
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
