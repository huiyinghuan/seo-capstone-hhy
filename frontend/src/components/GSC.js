// 

import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button, Card, Grid, Typography, Box, Paper, Tabs, Tab, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { BarChart3, Search, Globe, Trees as SitemapTree, Brain, TrendingUp, AlertCircle } from "lucide-react";

function GSCFeature() {
  const [sites, setSites] = useState([]);
  const [sitemaps, setSitemaps] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedSiteUrl, setSelectedSiteUrl] = useState('');
  // const [urlInspectionData, setUrlInspectionData] = useState(null);

  const [tabValue, setTabValue] = useState("overview");
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };


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
  
 
  const handleSiteSelection = (event) => {
    setSelectedSiteUrl(event.target.value); 
  };
  

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
    {/* Header */}
    <header style={{ borderBottom: "1px solid #e0e0e0" }}>
      <Box display="flex" alignItems="center" padding={2}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          SEO Analytics Dashboard
        </Typography>
        <Box ml="auto" display="flex" alignItems="center" spacing={2}>
          <Button variant="outlined" size="small" startIcon={<Globe />} style={{ marginLeft: "10px" }} onClick={getSites}>
            Get Sites
          </Button>
          <Button variant="outlined" size="small" startIcon={<SitemapTree />} style={{ marginLeft: "10px" }} onClick={getSitemaps}>
            Get Sitemaps
          </Button>
          <Button variant="outlined" size="small" startIcon={<TrendingUp />} style={{ marginLeft: "10px" }} onClick={getSearchAnalytics}>
            Get Data
          </Button>
        </Box>
      </Box>
    </header>

    <main style={{ padding: "20px" }}>
      {/* Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
        <Tab label="Overview" value="overview" />
        <Tab label="AI Insights" value="ai-insights" />
        <Tab label="Keyword Research" value="keywords" />
      </Tabs>
      
      {/* form control */}
      <Box padding={2} display="flex" flexDirection="column" alignItems="flex-start">
        <FormControl variant="outlined" fullWidth style={{ marginTop: "10px", marginBottom: "15px" }}>
          <InputLabel>Select Site</InputLabel>
          <Select
            value={selectedSiteUrl}
            onChange={handleSiteSelection}
            label="Select Site"
            fullWidth // Ensures Select is full width
          >
            {sites.map((site) => (
              <MenuItem key={site} value={site}>
                {site}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      

      {/* Tab Content */}
      {tabValue === "overview" && (
        <Box mt={4}>
          <Grid container spacing={4}>
            {/* Overview */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <Box display="flex" alignItems="center" padding={2}>
                  <Search style={{ fontSize: 24, color: "#757575" }} />
                  <Typography variant="subtitle2" color="textSecondary" style={{ marginLeft: "10px" }}>
                    Total Clicks
                  </Typography>
                </Box>
                <Typography variant="h4" component="p" align="center" padding={2}>
                {analyticsData.length > 0
                  ? analyticsData.reduce((acc, data) => acc + data.clicks, 0) // Sum all clicks
                  : 0}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <Box display="flex" alignItems="center" padding={2}>
                  <TrendingUp style={{ fontSize: 24, color: "#757575" }} />
                  <Typography variant="subtitle2" color="textSecondary" style={{ marginLeft: "10px" }}>
                    Impressions
                  </Typography>
                </Box>
                <Typography variant="h4" component="p" align="center" padding={2}>
                  20
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <Box display="flex" alignItems="center" padding={2}>
                  <Globe style={{ fontSize: 24, color: "#757575" }} />
                  <Typography variant="subtitle2" color="textSecondary" style={{ marginLeft: "10px" }}>
                    Indexed Pages
                  </Typography>
                </Box>
                <Typography variant="h4" component="p" align="center" padding={2}>
                  {sitemaps.length}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <Box display="flex" alignItems="center" padding={2}>
                  <AlertCircle style={{ fontSize: 24, color: "#757575" }} />
                  <Typography variant="subtitle2" color="textSecondary" style={{ marginLeft: "10px" }}>
                    Issues
                  </Typography>
                </Box>
                <Typography variant="h4" component="p" align="center" padding={2}>
                  0
                </Typography>
              </Card>
            </Grid>

            {/* Chart */}
            <Grid item xs={12}>
              <Card>
                <Box padding={2}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Performance Overview
                  </Typography>
                  <Box height="300px">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="clicks" stroke="#8884d8" />
                        <Line type="monotone" dataKey="impressions" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </Card>
            </Grid>

            {/* Sitemaps */}
            <Grid item xs={12}>
              <Card>
                <Box padding={2}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Sitemaps
                  </Typography>
                  <Paper style={{ maxHeight: "200px", overflowY: "auto" }}>
                    <ul style={{ padding: "10px" }}>
                      {sitemaps.map((sitemap, index) => (
                        <li key={index} style={{ marginBottom: "10px" }}>
                          <a href={sitemap} style={{ color: "#1976d2", textDecoration: "none" }} target="_blank" rel="noopener noreferrer">
                            {sitemap}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Paper>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* AI Insights */}
      {tabValue === "ai-insights" && (
        <Box mt={4}>
          <Card>
            <Box padding={2}>
              <Box display="flex" alignItems="center">
                <Brain style={{ fontSize: 24 }} />
                <Typography variant="h6" fontWeight="bold" style={{ marginLeft: "10px" }}>
                  AI Content Analysis
                </Typography>
              </Box>
              <Typography color="textSecondary" paragraph style={{ marginTop: "10px" }}>
                Connect OpenAI to get AI-powered insights about your content and SEO opportunities.
              </Typography>
              <Button variant="contained" color="primary">
                Connect OpenAI
              </Button>
            </Box>
          </Card>
        </Box>
      )}

      {/* Keyword Research */}
      {tabValue === "keywords" && (
        <Box mt={4}>
          <Card>
            <Box padding={2}>
              <Box display="flex" alignItems="center">
                <Search style={{ fontSize: 24 }} />
                <Typography variant="h6" fontWeight="bold" style={{ marginLeft: "10px" }}>
                  Keyword Research
                </Typography>
              </Box>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search for keywords..."
                style={{ marginTop: "10px" }}
              />
              <Typography color="textSecondary" paragraph style={{ marginTop: "10px" }}>
                Connect Google Keyword Planner to get keyword suggestions and volume data.
              </Typography>
              <Button variant="contained" color="primary">
                Connect Keyword Planner
              </Button>
            </Box>
          </Card>
        </Box>
      )}
    </main>
  </div>

    // older display
    // <div>
    //   <h1>Google Search Console Dashboard</h1>
    //   <button onClick={getSites}>Get Sites</button>
    //   <button onClick={getSitemaps}>Get Sitemaps</button>
    //   <button onClick={getSearchAnalytics}>Get Data</button>
    //   {/* <button onClick={getUrlInspectionData}>Inspect URL</button> */}


    //   <h2>Message:</h2>
    //   <p>{message}</p>

    //   <h2>Sites:</h2>
    //   <ul>
    //     {sites.map((site, index) => (
    //       <li key={index} onClick={() => handleSiteSelection(site)}>
    //         {site}
    //       </li>
    //     ))}
    //   </ul>

    //   {selectedSiteUrl && (
    //     <>
    //       <h2>Selected Site:</h2>
    //       <p>{selectedSiteUrl}</p>
    //     </>
    //   )}
    //   <h2>Sitemaps:</h2>
    //   <ul>
    //     {sitemaps.map((sitemap, index) => (
    //       <li key={index}>
    //         {sitemap}
    //       </li>
    //     ))}
    //   </ul>
  

    //   <h2>Search Analytics Data:</h2>
    //   <ul>
    //     {analyticsData.map((data, index) => (
    //       <li key={index}>
    //         {data.date}: {data.clicks} clicks
    //       </li>
    //     ))}
    //   </ul>

    //   <h2>Search Analytics Graph</h2>
    //   <LineChart width={600} height={300} data={analyticsData}>
    //     <CartesianGrid strokeDasharray="3 3" />
    //     <XAxis dataKey="date" />
    //     <YAxis />
    //     <Tooltip />
    //     <Legend />
    //     <Line type="monotone" dataKey="clicks" stroke="#8884d8" activeDot={{ r: 8 }} />
    //   </LineChart>
      
    // </div>
  );
}

export default GSCFeature;
