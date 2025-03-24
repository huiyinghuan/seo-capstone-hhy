

//v2

import React, { useState } from 'react';
import { Box, Card, CardContent, Fab, Typography, Button, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, List, ListItem, Collapse, Chip,  CircularProgress   } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { BrainCog, Loader2, Bot, Target, FileText, AlertTriangle, CheckCircle, Lightbulb, Gauge } from 'lucide-react';

const AiInsights = ({ selectedSitemap }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [seoScore, setSEOScore] = useState(0);
  const [expandedSuggestions, setExpandedSuggestions] = useState([]);
  const [loadingFixes, setLoadingFixes] = useState({});
  const [recommendedActions, setRecommendedActions] = useState({});

  // Function to expand/collapse rows (define this if it doesn't exist)
  const toggleRow = (index) => {
    setExpandedSuggestions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAnalyze = async () => {
    if (!selectedSitemap) {
      alert("Please select a sitemap URL first.");
      return;
    }
    setIsAnalyzing(true);

    const seoData = await fetchSEOData(selectedSitemap);

    if (seoData) {
      const { totalScore, invalidFields } = calculateTotalScore(seoData);

      setAnalysisResult({
        readabilityScore: 85, // Placeholder
        seoScore: totalScore,
        keywordDensity:
          seoData.keyword_density?.top_keywords?.map((keywordData) => ({
            word: keywordData.keyword,
            count: keywordData.count,
            density: keywordData.density,
          })) || [],
        suggestions: [
          {
            title: "Consider adding more descriptive meta descriptions",
            description: "Meta descriptions should be compelling and between 150-160 characters to improve CTR.",
            impact: "medium",
            recommendations: [
              "Ensure meta descriptions are unique and relevant.",
              "Include target keywords naturally.",
            ],
          },
          {
            title: "Improve header hierarchy",
            description: "Using a proper heading structure (H1-H6) helps both users and search engines understand content better.",
            impact: "high",
            recommendations: [
              "Use only one H1 per page.",
              "Maintain a logical order of H2, H3, and H4 elements.",
            ],
          },
          {
            title: "Add more internal links",
            description: "Internal linking helps distribute page authority and improves user navigation.",
            impact: "low",
            recommendations: [
              "Link to relevant pages naturally within content.",
              "Ensure internal links use descriptive anchor text.",
            ],
          },
        ],
        invalidFields, // Capture fields with issues
      });

      setSEOScore(totalScore);
    }

    setIsAnalyzing(false);
  };

  console.log("Received selected sitemap:", selectedSitemap);

  const calculateTotalScore = (seoData) => {
    let invalidFields = [];
    
    const getScore = (condition, fieldName, actualValue, requirement) => {
      if (condition) return 1;
      invalidFields.push({ field: fieldName, value: actualValue, requirement });
      return 0;
    };
  
    const getPartialScore = (condition, fieldName, actualValue, requirement) => {
      if (condition) return 0.5;
      invalidFields.push({ field: fieldName, value: actualValue, requirement });
      return 0;
    };
  
    const titleScore = seoData.title
      ? getScore(validateLength(seoData.title, 50, 60), "Title Length", seoData.title, "Should be between 50-60 characters")
      : getPartialScore(validateLength(seoData.title, 30, 91), "Title Length", seoData.title, "Should be between 30-91 characters");
  
    const metaDescriptionScore = seoData.meta_description
      ? getScore(validateLength(seoData.meta_description, 150, 160), "Meta Description Length", seoData.meta_description, "Should be between 150-160 characters")
      : getPartialScore(validateLength(seoData.meta_description, 130, 170), "Meta Description Length", seoData.meta_description, "Should be between 130-170 characters");
  
    const canonicalScore = getScore(seoData.canonical !== "No canonical tag", "Canonical Tag", seoData.canonical, "A valid canonical tag should be present");
  
    const robotsMetaTagScore = getScore(seoData.robots !== "No robots meta tag", "Robots Meta Tag", seoData.robots, "A robots meta tag should be included");
  
    const sitemapScore = getScore(seoData.sitemap_status?.sitemap_found === true, "Sitemap", seoData.sitemap_status?.sitemap_found, "A valid sitemap should be found");
  
    const mobileFriendlyScore = getScore(seoData.mobile_friendly === "Mobile-friendly", "Mobile Friendliness", seoData.mobile_friendly, "Page should be mobile-friendly");
  
    const pageSpeedScore = getScore(seoData.page_speed?.result === "Pass", "Page Speed", seoData.page_speed?.result, "Page speed should pass performance benchmarks");
  
    const httpsAuditScore = getScore(seoData.httpsAuditResult === "Pass", "HTTPS Audit", seoData.httpsAuditResult, "Website should have a secure HTTPS implementation");
  
    const imageAltTextScore = getScore(
      seoData.image_alt_text?.total_images > 0 && seoData.image_alt_text?.missing_alt === 0,
      "Image Alt Text",
      seoData.image_alt_text?.missing_alt,
      "All images should have alt text"
    );
  
    const structuredDataScore = getScore(
      seoData.structured_data_validation?.totalValidItems > 0,
      "Structured Data",
      seoData.structured_data_validation?.totalValidItems,
      "Valid structured data should be present"
    );
  
    const keywordDensityScore = getScore(
      seoData.keyword_density?.top_keywords?.every(
        (keywordData) => keywordData.density >= 1 && keywordData.density <= 3
      ),
      "Keyword Density",
      seoData.keyword_density?.top_keywords,
      "Keyword density should be between 1% and 3%"
    );
  
    const totalScore =
      ((titleScore +
        metaDescriptionScore +
        canonicalScore +
        robotsMetaTagScore +
        sitemapScore +
        mobileFriendlyScore +
        pageSpeedScore +
        httpsAuditScore +
        imageAltTextScore +
        structuredDataScore +
        keywordDensityScore) /
        11) *
      100;
  
    return { totalScore, invalidFields };
  };
  
  const fetchRecommendedFixes = async (index) => {
    try {
      setLoadingFixes((prev) => ({ ...prev, [index]: true }));
  
      const { field, value, requirement } = analysisResult.invalidFields[index]; // Extract field details
  
      const response = await fetch("http://127.0.0.1:8000/api/give_suggestion/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ label: field, value, requirement }) // Send field data to backend
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }
  
      const data = await response.json();
      const recommendation = data.recommendation || "No recommendation available";
  
      setRecommendedActions((prev) => ({ ...prev, [index]: recommendation })); // Store recommendation
      // toggleRow(index); // Expand the row to show fixes
      // Ensure the corresponding row expands
      setExpandedSuggestions((prev) => [...prev, index]);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoadingFixes((prev) => ({ ...prev, [index]: false }));
    }
  };
  

  const validateLength = (str, min, max) => {
    const length = str.length;
    return length >= min && length <= max;
  };
  const toggleSuggestion = (index) => {
    setExpandedSuggestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };
  const fetchSEOData = async (url) => {
    console.log("Fetching SEO audit for URL:", url);
    try {
      const response = await fetch(`http://localhost:8000/seo-audit/?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();

      if (!data.hasOwnProperty('httpsAuditResult')) {
        alert(`httpsAuditResult is missing for ${url}`);
      }

      if (data.error) {
        alert(`Error fetching data for ${url}: ${data.error}`);
        return null;
      }

      return {
        ...data,
        httpsAuditResult: data.httpsAuditResult,
        mobile_friendly: data.mobile_friendly,
        page_speed: data.page_speed,
        structured_data_validation: data.structured_data_validation,
        validation: data.validation,
        keyword_density: data.keyword_density,
      };
    } catch (error) {
      console.error(`Error fetching data for ${url}:`, error);
      alert('Failed to fetch SEO data. Please try again later.');
      return null;
    }
  };

  return (
    <Box mt={4}>
      <Card>
        <Box padding={2}>
          <Box display="flex" alignItems="center">
            <BrainCog className="h-6 w-6 text-blue-600" />
            <Typography variant="h6" fontWeight="bold" style={{ marginLeft: "10px" }}>
              AI Content Analysis
            </Typography>
          </Box>
          <Typography color="text.secondary" mt={1}>
            AI-powered insights about your content and SEO opportunities.
          </Typography>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            variant="contained"
            color="primary"
          //   startIcon={isAnalyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Bot className="h-5 w-5" />}
          //   sx={{ mt: 2 }}
          // >
          //   {isAnalyzing ? "Analyzing..." : "Analyze"}
          startIcon={isAnalyzing ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            <Bot className="h-5 w-5" />
          )}
          sx={{ mt: 2, position: 'relative' }}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze"}
          </Button>
        </Box>
      </Card>

      {isAnalyzing && (
        <Box mt={2} display="flex" alignItems="center" justifyContent="center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <Typography ml={2}>Analyzing your content...</Typography>
        </Box>
      )}

      {analysisResult && !isAnalyzing && (   
        <Box mt={4}>
          <Card className="p-4 shadow-md rounded-lg bg-white">
            <Box display="flex" alignItems="center" marginBottom={2}>
              <Gauge className="h-5 w-5 text-blue-600" />
              <Typography variant="h6" fontWeight="bold" style={{ marginLeft: "10px" }}>
                Content Scores
              </Typography>
            </Box>

            {/* Readability Score */}
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2" color="text.secondary">
                  Readability
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {analysisResult.readabilityScore}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={analysisResult.readabilityScore}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#2463eb', // Blue color for readability
                  },
              }}
              />
            </Box>

            {/* SEO Score */}
            <Box>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2" color="text.secondary">
                  SEO Score
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {analysisResult.seoScore}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={analysisResult.seoScore}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#16a349', // Green color for SEO score
                  },
                }}
              />
            </Box>
          </Card>
          <br></br>

          {/* Keyword Density Table */}
          <Card>
             <Box padding={2}>
               <Box display="flex" alignItems="center" marginBottom={2}>
                 <Target className="h-5 w-5 text-blue-600" />
                 <Typography variant="h6" fontWeight="bold" style={{ marginLeft: "10px" }}>
                   Keyword Density Analysis
                 </Typography>
               </Box>

               <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: "transparent" }}>
                 <Table size="small">
                   <TableHead>
                     <TableRow>
                       <TableCell style={{ fontWeight: 'bold', color: '#888' }}>Word</TableCell>
                       <TableCell style={{ fontWeight: 'bold', color: '#888' }}>Count</TableCell>
                       <TableCell style={{ fontWeight: 'bold', color: '#888' }}>Density</TableCell>
                     </TableRow>
                  </TableHead>
                   <TableBody>
                    {/* Render keyword density data as table rows */}
                    {analysisResult.keywordDensity && Array.isArray(analysisResult.keywordDensity) && analysisResult.keywordDensity.length > 0 ? (
                     analysisResult.keywordDensity.map((keyword, index) => (
                      <TableRow key={index}>
                        <TableCell>{keyword.word}</TableCell>
                        <TableCell>{keyword.count}x</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <LinearProgress
                              variant="determinate"
                              value={keyword.density}
                              sx={{
                                height: 6,
                                borderRadius: 4,
                                width: "100%",
                                backgroundColor: '#f3f4f6',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: '#2563eb',
                                },
                              }}
                            />
                            <Typography variant="body2" style={{ marginLeft: '10px' }}>
                              {keyword.density}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">No keyword density data available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Card>
          <br></br>                   
          {/* <Card>
            <Box padding={2}>
              <Box display="flex" alignItems="center">
                <Lightbulb className="h-5 w-5" style={{ color: "#2563eb" }} />
                <Typography variant="h6" fontWeight="bold" style={{ marginLeft: "10px" }}>
                  Improvement Suggestions
                </Typography>
              </Box>

              <Box mt={2}>
                <List sx={{ padding: 0 }}>
                  {analysisResult.invalidFields.length > 0 ? (
                    analysisResult.invalidFields.map((field, index) => (
                      <ListItem key={index} sx={{ display: "flex", alignItems: "center", padding: 0,  mb: 1.5 }}>
                        <AlertTriangle className="h-5 w-5" style={{ color: "#facc15", marginRight: "8px" }} />
                        <Typography variant="body3" color="text.primary">
                          {field}
                        </Typography>
                      </ListItem>
                    ))
                  ) : (
                    <Typography variant="body2" color="success.main">
                      ✅ No major SEO issues detected!
                    </Typography>
                  )}
                </List>
              </Box>
            </Box>
          </Card> */}
        
          {/* <Card elevation={2} sx={{ borderRadius: 2, p: 2, mb: 2 }}> */}
            {/* <Box display="flex" alignItems="center" mb={2}>
              <Lightbulb sx={{ color: "primary.main", fontSize: 24 }} />
              <Typography variant="h6" fontWeight="bold" ml={1}>
                Identified Issues
              </Typography>
            </Box> */}

            {/* {analysisResult.invalidFields.map((issue, index) => ( */}
              
              {/* <Card key={index} variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                <Button
                  onClick={() => toggleSuggestion(index)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    textAlign: "left",
                    backgroundColor: "#f8fafc",
                    "&:hover": { backgroundColor: "#f1f5f9" },
                    p: 2,
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <AlertTriangle sx={{ color: "warning.main", mr: 1 }} />
                    <Typography fontWeight="bold" color="text.primary">
                      {issue.field}
                    </Typography>
                  </Box>
                  {expandedSuggestions.includes(index) ? <ExpandLess /> : <ExpandMore />}
                </Button>
                {/* Button under Typography */}
              {/* <Box p={2} display="flex" justifyContent="flex-end">
                <Typography>
                  {JSON.stringify(issue.value)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CheckCircle />}
                  //onClick={() => fetchRecommendedFixes(index, issue.field, issue.value, issue.requirement )}
                  onClick={() => fetchRecommendedFixes(index)}
                  disabled={loadingFixes[index]} // Disable button while fetching
                >
                  {loadingFixes[index] ? "Fetching..." : "Fix Issue"}
                </Button>
              </Box>
              {/* Display the fetched recommendation inside a collapsible section */}
              {/* <Collapse in={expandedSuggestions.includes(index)}>
                <CardContent sx={{ backgroundColor: "white", borderTop: "1px solid #e5e7eb" }}>
                  {loadingFixes[index] ? (
                    <Typography color="text.secondary">Fetching recommendation...</Typography>
                  ) : recommendedActions[index] ? (
                    <>
                      <Typography fontWeight="bold" color="text.primary" mb={1}>
                        Suggested Fix:
                      </Typography>
                      <Typography color="text.secondary">{recommendedActions[index]}</Typography>
                    </>
                  ) : (
                    <Typography color="text.secondary">No suggestion available.</Typography>
                  )}
                </CardContent>
              </Collapse>
              </Card>
            ))} */}
          {/* </Card> */}

      
          {/* Suggestions Section */}
          {/* <Card elevation={2} sx={{ borderRadius: 2, p: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Lightbulb sx={{ color: "primary.main", fontSize: 24 }} />
              <Typography variant="h6" fontWeight="bold" ml={1}>
                Improvement Suggestions
              </Typography>
            </Box>

            {analysisResult.suggestions.map((suggestion, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                <Button
                  onClick={() => toggleSuggestion(index)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    textAlign: "left",
                    backgroundColor: "#f8fafc",
                    "&:hover": { backgroundColor: "#f1f5f9" },
                    p: 2,
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <AlertTriangle sx={{ color: "warning.main", mr: 1 }} />
                    <Typography fontWeight="bold" color="text.primary">
                      {suggestion.title}
                    </Typography>
                    <Chip
                      label={`${suggestion.impact} impact`}
                      color={getImpactColor(suggestion.impact)}
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  {expandedSuggestions.includes(index) ? <ExpandLess /> : <ExpandMore />}
                </Button>

                <Collapse in={expandedSuggestions.includes(index)}>
                  <CardContent sx={{ backgroundColor: "white", borderTop: "1px solid #e5e7eb" }}>
                    <Typography color="text.secondary" mb={2}>
                      {suggestion.description}
                    </Typography>

                    <Typography fontWeight="bold" color="text.primary" mb={1}>
                      Recommendations:
                    </Typography>
                    <ul style={{ paddingLeft: "20px", margin: 0 }}>
                      {suggestion.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} style={{ marginBottom: "4px", color: "#4b5563" }}>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Collapse>
              </Card>
            ))}
          </Card> */}
       
          {/* Identified Issues Card */}
          <Card elevation={2} sx={{ borderRadius: 2, p: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
            <Lightbulb sx={{ color: "primary.main", fontSize: 24 }} />
              <Typography variant="h6" fontWeight="bold" ml={1}>
                Identified Issues
              </Typography>
            </Box>

            {analysisResult.invalidFields.map((issue, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2, borderRadius: 2, p: 2 }}>
                <Box  display="flex" alignItems="center" >
                <AlertTriangle sx={{ color: "warning.main",  mr: 2 }} />
                <Typography fontWeight="bold" color="text.primary" sx={{ ml: 2 }}>
                  {issue.field}
                </Typography>
                <Box ml="auto" >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CheckCircle />}
                    onClick={() => fetchRecommendedFixes(index)}
                    disabled={loadingFixes[index]}
                  >
                    {loadingFixes[index] ? "Fetching..." : "Fix Issue"}
                  </Button>
                </Box>
                </Box>
              </Card>
            ))}
          </Card>
              
          {/* Improvement Suggestions Card */}
          <Card elevation={2} sx={{ borderRadius: 2, p: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Lightbulb sx={{ color: "primary.main", fontSize: 24 }} />
              <Typography variant="h6" fontWeight="bold" ml={1}>
                Improvement Suggestions
              </Typography>
            </Box>
            
            {analysisResult.invalidFields.map((issue, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                <Button
                  onClick={() => toggleSuggestion(index)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    textAlign: "left",
                    backgroundColor: "#f8fafc",
                    "&:hover": { backgroundColor: "#f1f5f9" },
                    p: 2,
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <AlertTriangle sx={{ color: "warning.main",  mr: 2}} />
                    <Typography fontWeight="bold" color="text.primary" sx={{ ml: 2 }} >
                      {issue.field}
                    </Typography>
                    {/* <Chip label={`${suggestion.impact} impact`} color="primary" size="small" sx={{ ml: 2 }} /> */}
                  </Box>
                  {expandedSuggestions.includes(index) ? <ExpandLess /> : <ExpandMore />}
                </Button>


                {/* Display the fetched recommendation inside a collapsible section */}
                <Collapse in={expandedSuggestions.includes(index)}>
                    <CardContent sx={{ backgroundColor: "white", borderTop: "1px solid #e5e7eb" }}>
                      {loadingFixes[index] ? (
                        <Typography color="text.secondary">Fetching recommendation...</Typography>
                      ) : recommendedActions[index] ? (
                        <>
                          <Typography fontWeight="bold" color="text.primary" mb={1}>
                            Suggested Fix:
                          </Typography>
                          <Typography color="text.secondary">{recommendedActions[index]}</Typography>
                        </>
                      ) : (
                        <Typography color="text.secondary">No suggestion available.</Typography>
                      )}
                    </CardContent>
                  </Collapse>
              </Card>
            ))}
          </Card>
          

        </Box>
      )}
    </Box>
  );
};

export default AiInsights;
