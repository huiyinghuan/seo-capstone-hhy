import React, { useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button, Card, Grid, Typography, Box, Paper, Tabs, Tab, TextField, Select, MenuItem, InputLabel,  Alert, FormControl } from "@mui/material";
import { Map, Upload, FileJson, CheckCircle, BarChart3, Search,Lock, Globe, Trees as SitemapTree, Brain, TrendingUp, AlertCircle } from "lucide-react";
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
  const [isLoadingSites, setIsLoadingSites] = useState(false);
  const [isLoadingSitemaps, setIsLoadingSitemaps] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [gscConnected, setGscConnected] = useState(false);

  // Handle file selection
  // const handleFileChange = (event) => {
  //   setFile(event.target.files[0]);
  // };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Simulate file upload
      setTimeout(() => {
        setFile(selectedFile);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }, 1000);
    }
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
      // const location = window.location.hostname;
      const response = await fetch(`http://${window.location.hostname}:8000/api/upload-auth-file`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setMessage(data.message || data.error);
      setGscConnected(true);
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
    setIsLoadingSites(true);
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/get-sites`);
      const data = await response.json();
      setSites(data.sites);
    } catch (error) {
      console.error("Error fetching sites:", error);
    } finally {
      setIsLoadingSites(false);
    }
  };

  const getSitemaps = async () => {
    if (!selectedSiteUrl) {
      alert('Please select a site first!');
      return;
    }
    setIsLoadingSitemaps(true);
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/get-sitemaps?site_url=${encodeURIComponent(selectedSiteUrl)}`);
      const data = await response.json();
      setSitemaps(data.sitemaps);  // Store all URLs in the sitemap
    } catch (error) {
      console.error("Error fetching sitemaps:", error);
    } finally {
      setIsLoadingSitemaps(false);
    }
  };

  const getSearchAnalytics = async () => {
    if (!selectedSiteUrl) {
      alert('Please select a site first!');
      return;
    }
    setIsLoadingAnalytics(true);
    const startDate = "2024-12-04";
    const endDate = "2025-04-31";
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/get-search-analytics?site_url=${encodeURIComponent(selectedSiteUrl)}&start_date=${startDate}&end_date=${endDate}`);
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching search analytics:", error);
    } finally {
      setIsLoadingAnalytics(false);
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
        
        {/* <Button 
            variant="contained" 
            className="connect-button" 
            // onClick={handleUpload}
            onClick={() => fileInputRef.current.click()}
            style={{ marginLeft: '20px' }}
          >
          Upload JSON File
        </Button> */}
        {/* Hidden file input with ref */}
        {/* <input 
            ref={fileInputRef}
            type="file" 
            style={{ display: "none" }} 
            accept="application/json" 
            onChange={handleFileChange}
          /> */}
        {/* Connect with GSC Test */}
        {/* <Button 
          variant="contained" 
          className="connect-button" 
          // onClick={() => fileInputRef.current.click()}
          onClick={handleUpload}
         >
          Connect with GSC
        </Button> */}
        {/* <input 
          type="file" 
          // ref={fileInputRef} 
          style={{ display: "none" }} 
          // accept=".json"
          accept="application/json" 
          onChange={handleFileChange}
        /> */}
        
      </Box>
    </header>
    <Box sx={{ padding: 4 }}> 
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>     
        <Box sx={{ backgroundColor: '#fff', padding: 3, borderRadius: 2, boxShadow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Upload className="h-6 w-6 text-gray-400" />
              <Typography variant="h6" sx={{ marginLeft: 2 }}>
                Upload JSON File
              </Typography>
            </Box>
            {file && <CheckCircle style={{ fontSize: 24, color: "green", ml: 1 }} />}
          </Box>
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ marginTop: 16 }}
            
          />
          
          {uploadSuccess && (
            <Alert sx={{ marginTop: 2 }} severity="success">
              Upload successful!
            </Alert>
          )}
        </Box>
        {/* GSC Connection Status */}
        <Box sx={{ backgroundColor: '#fff', padding: 3, borderRadius: 2, boxShadow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Globe className="h-6 w-6 text-gray-400" />
              <Typography variant="h6" sx={{ marginLeft: 2 }}>
                GSC Connection Status
              </Typography>
            </Box>
           
          </Box>
          
        
          <Box sx={{ paddingTop: 2, paddingBottom: 1, display: "flex", alignItems: "center", fontSize: "0.875rem", color: "text.secondary" }}>
            {gscConnected ? (
              <>
                <CheckCircle style={{ fontSize: 15, color: "#30bd69", marginLeft: 1 }} />
                <Typography sx={{ fontSize: 13, fontWeight: 'medium', color: "#3ea066", marginLeft: 0.5 }}>
                  Connected to Google Search Console
                </Typography>
              </>
            ) : (
              <>
                <Lock sx={{ fontSize: 15, color: "grey.500", marginLeft: 2 }} />
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: "text.secondary", marginLeft: 1  }}>
                  Not connected. Please connect to GSC first.
                </Typography>
              </>
            )}
          </Box>

          <Button
            variant="contained"
            sx={{
              mt: 2,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 1.5,
              fontSize: "0.875rem",
              borderRadius: 1,
              backgroundColor: gscConnected ? "green.100" : "green",
              color: gscConnected ? "green.700" : "white",
              "&:hover": {
                backgroundColor: gscConnected ? "green.200" : "darkgreen",
              },
            }}
            color={gscConnected ? 'success' : 'primary'}
            onClick={handleUpload}
            disabled={gscConnected}
            startIcon={gscConnected ? <CheckCircle style={{ fontSize: 20, color: "green", mr: 1 }} /> : null}
          >
            {gscConnected ? 'Connected to GSC' : 'Connect with GSC'}
        </Button>
       
        </Box>
      </Box>
    
    
    {/* Actions  */}
      <Box sx={{ backgroundColor: '#fff', padding: 3, borderRadius: 2, boxShadow: 1, marginTop: 4 }}>
        <Typography variant="h6" fontWeight={600}>Actions</Typography>
        {/* <Box ml="auto" display="flex" alignItems="center" spacing={2}> */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginTop: 2, marginBottom: 2 }}>
          <Button variant="contained"  color="primary"  startIcon={<Globe />} style={{ marginLeft: "10px" }} onClick={getSites}>
            Get Sites
          </Button>
          <Button variant="contained" color="secondary" startIcon={<Map />} style={{ marginLeft: "10px" }} disabled={!selectedSiteUrl} onClick={getSitemaps}>
            Get Sitemaps
          </Button>
          <Button variant="contained" color="warning" startIcon={<TrendingUp />} style={{ marginLeft: "10px" }} disabled={!selectedSiteUrl} onClick={getSearchAnalytics}>
            Get Data
          </Button>
        </Box>
      </Box>
    </Box>
              
    <main style={{ paddingLeft: "30px", paddingRight: "30px", paddingTop:"30px" }}>
      {/* Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
        <Tab label="Overview" value="overview" />
        <Tab label="AI Insights" value="ai-insights"  />
        {/* <Tab label="Keyword Research" value="keywords" /> */}
      </Tabs> 
      {/* form control */}
      <Box paddingTop={2} display="flex" flexDirection="column" alignItems="flex-start">
        <FormControl variant="filled" fullWidth style={{ marginTop: "10px", marginBottom: "15px" }}>
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
                  <Search style={{ fontSize: 24, color: "#4b80dc" }} />
                  <Typography variant="subtitle2" color="textSecondary" style={{ marginLeft: "10px" }}>
                    Total Clicks
                  </Typography>
                </Box>
                <Typography variant="h4" component="p" align="center" padding={2}>
                {analyticsData.length > 0
                  ? analyticsData.reduce((acc, data) => acc + data.clicks, 0) // Sum all clicks
                  :0}
                  
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <Box display="flex" alignItems="center" padding={2}>
                  <TrendingUp style={{ fontSize: 24, color: "#3db961" }} />
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
                  <FileJson style={{ fontSize: 24, color: "#9a5ddc" }} />
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
                  <AlertCircle style={{ fontSize: 24, color: "#cc4d52" }} />
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
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Performance Overview
            </Typography>
              <Card>
                <Box padding={2}>
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
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Sitemaps
            </Typography>
              <Card>
                <Box padding={4} >
                  {sitemaps.length === 0 ? (
                    <Typography color="textSecondary">No sitemaps available</Typography>
                  ) : (
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
                   )}
                </Box>
              </Card>
              <br></br>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* AI Insights */}
      {tabValue === "ai-insights" && <AiInsights selectedSitemap={selectedSiteMapUrl} />}
      
      {/* {tabValue === "ai-insights" && <AiInsights onConnect={() => console.log("Connecting to OpenAI...")} /> } */}


      {/* Keyword Research */}
      {/* {tabValue === "keywords" && (
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
      )} */}
    </main>
  </div>
  );
}

export default GSCFeature;


