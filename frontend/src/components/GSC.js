import React, { useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button, Card, Grid, Typography, Box, Paper, Tabs, Tab, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { BarChart3, Search, Globe, Trees as SitemapTree, Brain, TrendingUp, AlertCircle } from "lucide-react";
import AiInsights from './AiInsights'

function GSCFeature() {
  const [file, setFile] = useState(null);
  const [sites, setSites] = useState([]);
  const [sitemaps, setSitemaps] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedSiteUrl, setSelectedSiteUrl] = useState('');
  const [selectedSiteMapUrl, setSelectedSiteMapUrl] = useState('');
  const fileInputRef = useRef(null);
  

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Upload file and get GSC sites
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a JSON file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/upload-auth-file", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setMessage(data.message || data.error);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Error uploading file");
    }
  };

  // for different tabs 
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
    const endDate = "2025-04-31";
    try {
      const response = await fetch(`http://localhost:8000/api/get-search-analytics?site_url=${encodeURIComponent(selectedSiteUrl)}&start_date=${startDate}&end_date=${endDate}`);
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching search analytics:", error);
    }
  };
  const handleSiteSelection = (event) => {
    setSelectedSiteUrl(event.target.value); 
  };

  const handleSiteMapSelection = (event) => {
    setSelectedSiteMapUrl(event.target.value); 
    console.log("Selected Sitemap URL:", event.target.value); // Debugging
  };


  
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
    {/* Header */}
    <header style={{ borderBottom: "1px solid #e0e0e0" }}>
      <Box display="flex" alignItems="center" padding={2}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          SEO Analytics Dashboard
        </Typography>
        {/* Button to trigger file upload */}
        <Button 
            variant="contained" 
            className="connect-button" 
            // onClick={handleUpload}
            onClick={() => fileInputRef.current.click()}
            style={{ marginLeft: '20px' }}
          >
          Upload JSON File
        </Button>
        {/* Hidden file input with ref */}
        <input 
            ref={fileInputRef}
            type="file" 
            style={{ display: "none" }} 
            accept="application/json" 
            onChange={handleFileChange}
          />
        {/* Connect with GSC Test */}
        <Button 
          variant="contained" 
          className="connect-button" 
          // onClick={() => fileInputRef.current.click()}
          onClick={handleUpload}
         >
          Connect with GSC
        </Button>
        {/* <input 
          type="file" 
          // ref={fileInputRef} 
          style={{ display: "none" }} 
          // accept=".json"
          accept="application/json" 
          onChange={handleFileChange}
        /> */}
        <Box ml="auto" display="flex" alignItems="center" spacing={2}>
          <Button variant="outlined" size="small" startIcon={<Globe />} style={{ marginLeft: "10px" }} onClick={getSites}>
            Get Sites
          </Button>
          <Button variant="outlined" size="small" startIcon={<SitemapTree />} style={{ marginLeft: "10px" }} disabled={!selectedSiteUrl} onClick={getSitemaps}>
            Get Sitemaps
          </Button>
          <Button variant="outlined" size="small" startIcon={<TrendingUp />} style={{ marginLeft: "10px" }} disabled={!selectedSiteUrl} onClick={getSearchAnalytics}>
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
          <InputLabel>{tabValue === "ai-insights" ? "Select Sitemap" : "Select Site"}</InputLabel>
          <Select
            value={tabValue === "ai-insights" ? selectedSiteMapUrl : selectedSiteUrl}
            onChange={tabValue === "ai-insights" ? handleSiteMapSelection : handleSiteSelection}
            label={tabValue === "ai-insights" ? "Select Sitemap" : "Select Site"}
            fullWidth // Ensures Select is full width
          >
            {(tabValue === "ai-insights" ? sitemaps : sites).map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
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
                {analyticsData.length > 0
                  ? analyticsData.reduce((acc, data) => acc + data.impressions, 0) // Sum all impressions
                  : 0}
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
      {tabValue === "ai-insights" && <AiInsights selectedSitemap={selectedSiteMapUrl} />}
      
      {/* {tabValue === "ai-insights" && <AiInsights onConnect={() => console.log("Connecting to OpenAI...")} /> } */}


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
  );
}

export default GSCFeature;


