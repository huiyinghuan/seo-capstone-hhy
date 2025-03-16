
import React, { useState } from 'react';
import { Box, Card, Typography, Button, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { BrainCog, Loader2, Bot, Target } from 'lucide-react';
import {  FileText, AlertTriangle, CheckCircle, Lightbulb, Gauge } from 'lucide-react';

const AiInsights = ({ selectedSitemap }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [seoScore, setSEOScore] = useState(0);  

  const handleAnalyze = async () => {
    if (!selectedSitemap) {
      alert("Please select a sitemap URL first.");
      return;
    }
    setIsAnalyzing(true);
  
    const seoData = await fetchSEOData(selectedSitemap);
  
    if (seoData) {
      const seoScore = calculateTotalScore(seoData);  // Calculate total score
      
      setAnalysisResult({
        readabilityScore: 85,  // Placeholder since this isn't coming from SEO audit
        seoScore: seoScore,          // Placeholder
        // keywordDensity: seoData.keyword_density && seoData.keyword_density.top_keywords && seoData.keyword_density.top_keywords.length > 0 
        // ? seoData.keyword_density.top_keywords.map(keywordData => 
        //     `${keywordData.keyword} - Count: ${keywordData.count} - Density: ${keywordData.density}%`
        //   ).join('\n') 
        // : 'No data available',
        keywordDensity: seoData.keyword_density && seoData.keyword_density.top_keywords && seoData.keyword_density.top_keywords.length > 0 
        ? seoData.keyword_density.top_keywords.map(keywordData => ({
            word: keywordData.keyword,
            count: keywordData.count,
            density: keywordData.density,
          })) 
        : [],
        suggestions: [
          "Consider adding more descriptive meta descriptions",
          "Improve header hierarchy",
          "Add more internal links",
        ],
      }); 
      setSEOScore(seoScore);
    }
  
    setIsAnalyzing(false);
  };
  // For debugging: log the received selected sitemap
  console.log("Received selected sitemap:", selectedSitemap);

  const calculateTotalScore = (seoData) => {
    // Calculate score for Title length (50-60 characters)
    const titleScore = seoData.title && validateLength(seoData.title, 50, 60) ? 1 : (validateLength(seoData.title, 30, 91) ? 0.5 : 0);
  
    // Calculate score for Meta Description length (150-160 characters)
    const metaDescriptionScore = seoData.meta_description && validateLength(seoData.meta_description, 150, 160) ? 1 : (validateLength(seoData.meta_description, 130, 170) ? 0.5 : 0);
  
    // Calculate score for Canonical tag (present or not)
    const canonicalScore = seoData.canonical !== 'No canonical tag' ? 1 : 0;
  
    // Calculate score for Robots Meta Tag (present or not)
    const robotsMetaTagScore = seoData.robots !== 'No robots meta tag' ? 1 : 0;
  
    // Calculate score for Sitemap Status (submitted)
    const sitemapScore = seoData.sitemap_status && seoData.sitemap_status.sitemap_found === true ? 1 : 0;
  
    // Calculate score for Mobile Friendly (is mobile-friendly)
    const mobileFriendlyScore = seoData.mobile_friendly === 'Mobile-friendly' ? 1 : 0;
  
    // Calculate score for Page Speed (Pass or Fail)
    const pageSpeedScore = seoData.page_speed.result === 'Pass' ? 1 : 0;
  
    // Calculate score for HTTPS Audit (Pass or Fail)
    const httpsAuditScore = seoData.httpsAuditResult === 'Pass' ? 1 : 0;
  
    // Calculate score for Image Alt Text (all images have alt text)
    const imageAltTextScore = seoData.image_alt_text.total_images > 0 && seoData.image_alt_text.missing_alt === 0 ? 1 : 0;
  
    // Calculate score for Structured Data (valid items found)
    const structuredDataScore = seoData.structured_data_validation?.totalValidItems > 0 ? 1 : 0;
  
    // Calculate score for Keyword Density (1-3% for SEO)
    const keywordDensityScore = seoData.keyword_density.top_keywords && seoData.keyword_density.top_keywords.every(keywordData => keywordData.density >= 1 && keywordData.density <= 3) ? 1 : 0;
  
    // Calculate total score based on individual scores
    const totalScore = (
      titleScore +
      metaDescriptionScore +
      canonicalScore +
      robotsMetaTagScore +
      sitemapScore +
      mobileFriendlyScore +
      pageSpeedScore +
      httpsAuditScore +
      imageAltTextScore +
      structuredDataScore +
      keywordDensityScore
    ) / 11 * 100; // Dividing by 11 for total criteria, then multiplying by 100 for percentage
  
    return totalScore;
  };
  
  // Helper function for validating length (to be used with title and meta description)
  const validateLength = (str, min, max) => {
    const length = str.length;
    return length >= min && length <= max;
  };
  


  // for getting SEO audit score --   new 
  const fetchSEOData = async (url) => {
    console.log("Fetching SEO audit for URL:", url);
    try {
        const response = await fetch(`http://localhost:8000/seo-audit/?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();

        console.log("Fetched data:", data); // Check if httpsAuditResult is part of the data object
        if (!data.hasOwnProperty('httpsAuditResult')) {
            alert(`httpsAuditResult is missing for ${url}`);
        }


        if (data.error) {
            alert(`Error fetching data for ${url}: ${data.error}`);
            return null;
        }
        
        console.log("Fetched data:", data);
        //console.log("Fetched data keys:", Object.keys(data));
        const httpsAudit = data.httpsAuditResult;
        console.log("Fetched httpdata:", httpsAudit);  // Should log "Pass"
        console.log("Fetched pageSpeedInsight", data.page_speed )
        console.log("keyword density is: ", data.keyword_density)
      
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
            startIcon={isAnalyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Bot className="h-5 w-5" />}
            sx={{ mt: 2 }}
          >
            {isAnalyzing ? "Analyzing..." : "Connect to OpenAI"}
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
          <Card>
              <Box padding={2}>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                      <Box display="flex" alignItems="center">
                          <Lightbulb className="h-5 w-5 text-blue-600" />
                          <Typography variant="h6" fontWeight="bold" style={{ marginLeft: "10px" }}>
                          Improvement Suggestions
                          </Typography>
                      </Box>    

                      <div className="mt-4 space-y-3">
                          <ul>
                          {analysisResult.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start space-x-2">
                              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">{suggestion}</span>
                              </li>
                          ))}
                          </ul>
                      </div>
                  </div>
              </Box>
          </Card>
        </Box>
      )}
    </Box>
  );
};


export default AiInsights;
