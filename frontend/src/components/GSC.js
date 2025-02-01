// 

import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function GSCFeature() {
  const [sites, setSites] = useState([]);
  const [sitemaps, setSitemaps] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedSiteUrl, setSelectedSiteUrl] = useState('');
  // const [urlInspectionData, setUrlInspectionData] = useState(null);


  const getSites = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/get-sites');
      const data = await response.json();
      setSites(data.sites);
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  const getSitemaps = async () => {
    if (!selectedSiteUrl) {
      alert('Please select a site first!');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/get-sitemaps?site_url=${encodeURIComponent(selectedSiteUrl)}`);
      const data = await response.json();
      setSitemaps(data.sitemaps);  // Store all URLs in the sitemap
    } catch (error) {
      console.error("Error fetching sitemaps:", error);
    }
  };

  const getSearchAnalytics = async () => {
    if (!selectedSiteUrl) {
      alert('Please select a site first!');
      return;
    }
    const startDate = "2024-12-04";
    const endDate = "2025-01-31";
    try {
      const response = await fetch(`http://localhost:8000/api/get-search-analytics?site_url=${encodeURIComponent(selectedSiteUrl)}&start_date=${startDate}&end_date=${endDate}`);
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching search analytics:", error);
    }
  };

  // const getUrlInspectionData = async () => {
  //   if (!selectedSiteUrl) {
  //     alert('Please select a site first!');
  //     return;
  //   }
  //   const urlToInspect = prompt('Enter the URL to inspect:');  // Allow user to input URL for inspection
  //   if (!urlToInspect) {
  //     alert('URL is required for inspection!');
  //     return;
  //   }
   
  //   try {
  //     const response = await fetch(`http://localhost:8000/api/inspect-url?site_url=${encodeURIComponent(selectedSiteUrl)}&url=${encodeURIComponent(urlToInspect)}`);
  //     const data = await response.json();
  //     setUrlInspectionData(data);
  //   } catch (error) {
  //     console.error("Error fetching URL inspection data:", error);
  //   } 
  // };
  
 
  const handleSiteSelection = (siteUrl) => {
    setSelectedSiteUrl(siteUrl);
  };

  return (
    <div>
      <h1>Google Search Console Dashboard</h1>
      <button onClick={getSites}>Get Sites</button>
      <button onClick={getSitemaps}>Get Sitemaps</button>
      <button onClick={getSearchAnalytics}>Get Data</button>
      {/* <button onClick={getUrlInspectionData}>Inspect URL</button> */}


      <h2>Message:</h2>
      <p>{message}</p>

      <h2>Sites:</h2>
      <ul>
        {sites.map((site, index) => (
          <li key={index} onClick={() => handleSiteSelection(site)}>
            {site}
          </li>
        ))}
      </ul>

      {selectedSiteUrl && (
        <>
          <h2>Selected Site:</h2>
          <p>{selectedSiteUrl}</p>
        </>
      )}
      <h2>Sitemaps:</h2>
      <ul>
        {sitemaps.map((sitemap, index) => (
          <li key={index}>
            {sitemap}
          </li>
        ))}
      </ul>
  

      <h2>Search Analytics Data:</h2>
      <ul>
        {analyticsData.map((data, index) => (
          <li key={index}>
            {data.date}: {data.clicks} clicks
          </li>
        ))}
      </ul>

      <h2>Search Analytics Graph</h2>
      <LineChart width={600} height={300} data={analyticsData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="clicks" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
      
    </div>
  );
}

export default GSCFeature;
