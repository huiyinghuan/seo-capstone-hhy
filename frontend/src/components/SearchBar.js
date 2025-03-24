import React, { useState,  useEffect } from 'react';
import { Search } from 'lucide-react';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material'; 
import './SearchBar.css'; // Import the CSS file
import SEOAuditResultTable from "./SEOAuditResultTable";
import { FaPlusCircle } from "react-icons/fa";
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import Button from '@mui/material/Button';
import SEOCompetitorAnalysisSummaryTable from './SEOCompetitorAnalysisSummaryTable';
import { Card, CardHeader, CardContent, Typography, LinearProgress, Box,  } from '@mui/material';

  const SearchBar = ({ onSearch }) => {
    const [domains, setDomains] = useState([{ domain: "", result: null }]);
    const [searchTriggered, setSearchTriggered] = useState(false);  // Track if search has been triggered
    const [searchCompleted, setSearchCompleted] = useState(false);
    
    //for loading progress bar
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

  //   useEffect(() => {
  //     let timer;
  //     if (loading) {
  //         setProgress(0);
  //         timer = setInterval(() => {
  //             setProgress((prev) => (prev >= 90 ? 90 : prev + 10)); // Simulate progress up to 90%
  //         }, 500);
  //     } else {
  //         clearInterval(timer);
  //         setProgress(100); // Complete the progress when loading stops
  //         setTimeout(() => setProgress(0), 500); // Reset progress after completion
  //     }
  //     return () => clearInterval(timer);
  // }, [loading]);

  // segreate

    const validateLength = (value, min, max) => value.length >= min && value.length <= max;

    const fetchSEOData = async (url) => {
      try {
          const location = window.location.hostname;
          const response = await fetch(`http://${location}:8000/seo-audit/?url=${encodeURIComponent(url)}`);
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

      
    // Add a new search bar
    const handleAddSearchBar = () => {
      if (domains.length < 5) {
        setDomains([...domains, { domain: "", result: null }]);
      } else {
        alert("You can only add up to 5 search bars.");
      }
    };

    // Remove a specific search bar
    const handleRemoveSearchBar = (index) => {
      setDomains(domains.filter((_, i) => i !== index));
    };

    // Update a specific domain input
    const handleDomainChange = (index, value) => {
      const updatedDomains = [...domains];
      updatedDomains[index].domain = value;
      updatedDomains[index].result = null; // Reset result when domain changes
      setDomains(updatedDomains);
    };

    const handleSearch = async () => {
      console.log("Domains before search:", domains);

      const emptyDomain = domains.some(entry => !entry.domain.trim());
      if (emptyDomain) {
        alert("Please fill in all domain fields before searching.");
        return;
      }

      // // Mark the search as triggered, if not it will be rendered immediately, affect ui view 
      // setSearchTriggered(true);

      setLoading(true); // start loading
      setProgress(0);
      // Reset searchTriggered before starting a new search
      setSearchTriggered(false);
      setSearchCompleted(false); // Reset search completed state


      // Reset previous results but do NOT reset searchTriggered yet
      setDomains((prevDomains) => prevDomains.map(entry => ({ ...entry, result: null })));
      // Start a timer to increment progress gradually (simulate progress while waiting)
      const progressTimer = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 1 : prev));
      }, 1000); // Increase progress by 1% every 50ms up to 90%

      // Allow React to process state updates before fetching data
      await new Promise((resolve) => setTimeout(resolve, 0));
      
      // Clear previous results before fetching new data
      // const resetDomains = domains.map(entry => ({ ...entry, result: null }));
      // setDomains(resetDomains);

      // Mark the search as triggered (so the summary table re-renders properly)
      setSearchTriggered(true);
    
      // Proceed with SEO data fetching for each domain
      const updatedDomains = await Promise.all(
        domains.map(async (entry) => {
          const data = await fetchSEOData(entry.domain);
          console.log("Fetched data for domain:", entry.domain, data);
          return {
            ...entry,
            result: data || null,
          };
        })
      );
    // Stop the gradual timer
    clearInterval(progressTimer);

    // Now, complete the progress from the current value to 100 gradually
    const completeTimer = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 1;
        } else {
          clearInterval(completeTimer);
          return prev;
        }
      });
    }, 50); // Increase progress by 1% every 20ms until reaching 100%

    // Update the domains with fetched data
    console.log("Updated domains:", updatedDomains);
    setDomains(updatedDomains);
    // setSearchTriggered(false);  //Reset search state
    setSearchTriggered(true);
    setSearchCompleted(true);
    setLoading(false);
  };

  const handleRefresh = () => {
    setDomains([{ domain: "", result: null }]);
    setSearchTriggered(false);
    setSearchCompleted(false);
    setLoading(false);
    setProgress(0);
  };

  const createRows = (data) => {
    console.log("Creating rows for data:", data);
    if (!data) {
      return []; // Return empty array if data is undefined or null
    }

    return [
      // { label: 'HTML Type', value: data.html_type || 'Unknown', requirement: 'N/A', valid: 'N/A', recommendation: 'N/A' },
      //  valid: validateLength(data.title || '', 50, 60)
      //{ label: 'Title', value: data.title || 'No title', requirement: '50 - 60 Characters', validation: data.validation?.title?.half_valid, recommendation: 'Ensure the title is between 50 - 60 characters' },
      { label: 'Title', value: data.title || 'No title', requirement: '50 - 60 Characters', valid: validateLength(data.title || '', 30, 91) ? (validateLength(data.title || '', 50, 60) ? true : "partial") : false, recommendation: 'Ensure the title is between 50 - 60 characters' },
      //{ label: 'Meta Description', value: data.meta_description || 'No meta description', requirement: '150 - 160 Characters', valid: validateLength(data.meta_description || '', 150, 160), recommendation: 'Ensure the meta description is between 150 - 160 characters' },
      { label: 'Meta Description', value: data.meta_description || 'No meta description', requirement: '150 - 160 Characters', valid: validateLength(data.meta_description || '', 130, 170) ? (validateLength(data.meta_description || '', 150, 160) ? true : "partial") : false, recommendation: 'Ensure the meta description is between 150 - 160 characters' },
      { label: 'Canonical', value: data.canonical || 'No canonical tag', requirement: 'Point to preferred version of page to avoid duplicate content issues', valid: data.canonical !== 'No canonical tag', recommendation: 'Add a canonical tag to prevent duplicate content issues' },
      { label: 'Robots Meta Tag', value: data.robots || 'No robots meta tag', requirement: 'Use noindex to prevent page from being indexed & nofollow to prevent links from being followed', valid: data.robots !== 'No robots meta tag', recommendation: 'Ensure robots meta tag is properly set' },
      //{ label: 'Sitemap Status', value: data.sitemap_status.sitemaps.length > 0 ? data.sitemap_status.sitemaps.map(url => ` ${url}`).join('\n'): 'No sitemap' , requirement: 'Submitted to Search Engine', valid: data.sitemap_status.sitemap_found === true , recommendation: 'Submit a sitemap to search engines for better crawling' },
      {
        label: 'Sitemap Status',
        value: data.sitemap_status && data.sitemap_status.sitemaps && data.sitemap_status.sitemaps.length > 0
          ? data.sitemap_status.sitemaps.map(url => ` ${url}`).join('\n')
          : 'No sitemap',
        requirement: 'Submitted to Search Engine',
        valid: data.sitemap_status && data.sitemap_status.sitemap_found === true,
        recommendation: 'Submit a sitemap to search engines for better crawling'
      },
      { label: 'Mobile Friendly', value: data.mobile_friendly || 'Unknown', requirement: 'Responsive & works well on mobile', valid: data.mobile_friendly === 'Mobile-friendly', recommendation: 'Ensure the site is responsive and mobile-friendly' },
      //{ label: 'Page Speed', value: data.page_speed || 'Unknown', requirement: 'Aim for faster loading times to improve user experience', valid: data.page_speed === 'Pass', recommendation: 'Improve page speed for better user experience' },
      { label: 'Page Speed', value: data.page_speed.result || 'Unknown', details: data.page_speed.details || 'No details available', valid: data.page_speed.result === 'Pass', recommendation: 'Improve page speed for better user experience' },
      { label: 'HTTPS Audit', value: data.httpsAuditResult || 'Unknown', requirement: 'HTTPS ensures secure communication', valid: data.httpsAuditResult === 'Pass', recommendation: 'Ensure the website uses HTTPS for secure communication' },
      
    

      // Add a row for image alt text validation
      {
        label: 'Image Alt Text',
        value: data.image_alt_text.total_images > 0
            ? data.image_alt_text.missing_alt_images.length > 0
                ? data.image_alt_text.missing_alt_images.map(src => `${src} → No alt text`).join(', ')
                : `All ${data.image_alt_text.total_images} images have alt text`
            : 'No images found',
        requirement: 'All images should have descriptive alt text',
        valid: data.image_alt_text.missing_alt === 0, // Passes validation if no images are missing alt text
        recommendation: 'Ensure all images have meaningful alt text for accessibility and SEO'
    },

    {
      label: 'Structured Data',
      value: data.structured_data_validation
        ? `Detected Valid Items: ${data.structured_data_validation.totalValidItems}\nValid Item Types: ${data.structured_data_validation.validItemTypes?.join(', ') || 'No valid item types found'}`
        : 'No structured data found',
      requirement: 'Ensure correct structured data for SEO purposes',
      valid: data.structured_data_validation?.totalValidItems > 0,
      recommendation: 'Ensure the structured data is properly implemented according to Schema.org.'
    },

    {
      label: 'Keyword Density',
      value: data.keyword_density.top_keywords && data.keyword_density.top_keywords.length > 0 
        ? data.keyword_density.top_keywords.map(keywordData => 
            `${keywordData.keyword} - Count: ${keywordData.count} - Density: ${keywordData.density}%`).join('\n') 
        : 'No data available',
      requirement: 'Ensure the keyword density is within the recommended range (usually 1-3%) for SEO purposes',
      valid: data.keyword_density.top_keywords && data.keyword_density.top_keywords.every(keywordData => 
        keywordData.density >= 1 && keywordData.density <= 3),
      recommendation: 'Ensure keyword density is between 1-3% to avoid keyword stuffing and maintain natural readability'
    }
    
    ];
  };
    
  const combinedRows = domains
    .map((entry) => {
      const rows = entry.result ? createRows(entry.result) : [];
      return rows.map((row) => ({
        label: row.label,
        domainValid: row.valid,
      }));
    })
    .flat();

    const combinedScores = domains.map((entry) => {
      if (!entry.result) return { domain: entry.domain, scores: [] };

      const rows = createRows(entry.result);
      const scores = rows.map((row) => ({
        label: row.label,
        valid: row.valid,
      }));

      return { domain: entry.domain, scores };
    });


    console.log("Combined rows:", combinedRows);

  return (
    <div className="container">
      {/* <Card className="max-w-4xl mx-auto mb-12"> */}
      <Card sx={{ maxWidth: 1000, margin: '0 auto', padding: 2, marginBottom: 4, textAlign: "center" }}>
      <CardHeader title="Website SEO Analysis" subheader="Enter up to 5 domains to analyze their SEO performance" />
        <CardContent>
        {loading && (
          <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
                  {progress}% Analyzing...
              </Typography>
          </Box>
        )}
          <div className="search-bar-form">
            {/* Add a flex container to arrange search bars horizontally */}
            <div className="search-bar-flex-container">
              {domains.map((entry, index) => (
                <div key={index} className="search-bar-container relative">
                  <div className="search-bar-wrapper">
                    <input
                      type="text"
                      value={entry.domain}
                      onChange={(e) => handleDomainChange(index, e.target.value)}
                      placeholder={`Enter domain ${index + 1}`}
                      className="search-bar-input"
                    />
                    {domains.length > 1 && (
                      <Button
                        sx={{
                          position: "absolute",
                          right: "20px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                        onClick={() => handleRemoveSearchBar(index)}
                      >
                        <DisabledByDefaultRoundedIcon sx={{ fontSize: 30 }} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="button-group" style={{ width: '100%' }}>
              {/* add another domain */}
              <Button 
                variant="outlined"
                disabled = {searchTriggered}
                onClick={handleAddSearchBar} 
                sx={{
                  margin: "20px 0px", // Adjust top/bottom margin for spacing
                  width: '100%', // Set width to 100% for full width
                  borderColor: 'lightgrey', // to ensure the border has color
                  borderStyle: 'dashed', // Dashed border style
                  borderWidth: 2, // Border width
                  color: 'text.primary', // Text color
                  padding: '8px 16px', // Adjust padding for the button
                  '&:hover': {
                    borderColor: 'primary.main', // Change border color on hover
                   // backgroundColor: 'transparent', // Keep background transparent on hover
                  }
                }}>
                Add Another Domain
              </Button>
              <br></br>

              {/* Search Button */}
              {!searchCompleted && (  
                <Button variant="contained" onClick={handleSearch} disabled={loading} 
                sx={{ 
                  width: '100%',    
                  }}>
                  {loading ? "Analyzing..." : "Search"}               
                </Button>
              )}

              {/* Refresh Button (Shown after Search is Complete) */}
              {searchCompleted && (
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={handleRefresh} 
                  sx={{ width: '100%' }}
                >
                  Refresh
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitor Summary Table */}
      <div className="scrollable-table-container">
        {searchTriggered && combinedScores.length > 0 && (
          <SEOCompetitorAnalysisSummaryTable data={combinedScores} />
        )}
      </div>
      <br />
      {domains.map((entry, index) => (
        <div key={index} className="scrollable-table-container">
          {entry.result && <SEOAuditResultTable rows={createRows(entry.result)} domain={entry.domain} />}
        </div>
      ))}
      <br />
    </div>
  );
}


export default SearchBar;      






 