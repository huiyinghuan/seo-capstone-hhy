
// import React, { useState } from 'react';
// import { Search } from 'lucide-react';
// import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material'; 
// import './SearchBar.css'; // Import the CSS file
// import SEOAuditResultTable from "./SEOAuditResultTable";
// import { FaPlusCircle } from "react-icons/fa";
// import Button from '@mui/material/Button';
// import SEOCompetitorAnalysisSummaryTable from './SEOCompetitorAnalysisSummaryTable';


//   const SearchBar = ({ onSearch }) => {
//     const [domains, setDomains] = useState([{ domain: "", result: null }]);
//     const [searchTriggered, setSearchTriggered] = useState(false);  // Track if search has been triggered


//     const validateLength = (value, min, max) => value.length >= min && value.length <= max;

//     const fetchSEOData = async (url) => {
//       try {
//           const response = await fetch(`http://localhost:8000/seo-audit/?url=${encodeURIComponent(url)}`);
//           if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//           const data = await response.json();

//           console.log("Fetched data:", data); // Check if httpsAuditResult is part of the data object
//           if (!data.hasOwnProperty('httpsAuditResult')) {
//               alert(`httpsAuditResult is missing for ${url}`);
//           }

//           if (data.error) {
//               alert(`Error fetching data for ${url}: ${data.error}`);
//               return null;
//           }
          
//           console.log("Fetched data:", data);
//           //console.log("Fetched data keys:", Object.keys(data));
//           const httpsAudit = data.httpsAuditResult;
//           console.log("Fetched httpdata:", httpsAudit);  // Should log "Pass"
//           console.log("Fetched pageSpeedInsight", data.page_speed )
        
//           return {
//               ...data,
//               httpsAuditResult: data.httpsAuditResult,
//               mobile_friendly: data.mobile_friendly,
//               page_speed: data.page_speed,
//               structured_data_validation: data.structured_data_validation,
//               validation: data.validation,
              
//           };
//       } catch (error) {
//           console.error(`Error fetching data for ${url}:`, error);
//           alert('Failed to fetch SEO data. Please try again later.');
//           return null;
//       }
//   };

      
//     // Add a new search bar
//     const handleAddSearchBar = () => {
//       if (domains.length < 5) {
//         setDomains([...domains, { domain: "", result: null }]);
//       } else {
//         alert("You can only add up to 5 search bars.");
//       }
//     };

//     // Remove a specific search bar
//     const handleRemoveSearchBar = (index) => {
//       setDomains(domains.filter((_, i) => i !== index));
//     };

//     // Update a specific domain input
//     const handleDomainChange = (index, value) => {
//       const updatedDomains = [...domains];
//       updatedDomains[index].domain = value;
//       setDomains(updatedDomains);
//     };

//     const handleSearch = async () => {
//       console.log("Domains before search:", domains);

//       const emptyDomain = domains.some(entry => !entry.domain.trim());
//       if (emptyDomain) {
//         alert("Please fill in all domain fields before searching.");
//         return;
//       }

//       // Mark the search as triggered, if not it will be rendered immediately, affect ui view 
//       setSearchTriggered(true);
    
//     // Proceed with SEO data fetching for each domain
//     const updatedDomains = await Promise.all(
//       domains.map(async (entry) => {
//         const data = await fetchSEOData(entry.domain);
//         console.log("Fetched data for domain:", entry.domain, data);
//         return {
//           ...entry,
//           result: data || null,
//         };
//       })
//     );

//     // Update the domains with fetched data
//     console.log("Updated domains:", updatedDomains);
//     setDomains(updatedDomains);
//     //setSearchTriggered(false);  Reset search state
//   };

//   const createRows = (data) => {
//     console.log("Creating rows for data:", data);
//     if (!data) {
//       return []; // Return an empty array if data is undefined or null
//     }

//     return [
//       { label: 'HTML Type', value: data.html_type || 'Unknown', requirement: 'N/A', valid: 'N/A', recommendation: 'N/A' },
//       //  valid: validateLength(data.title || '', 50, 60)
//       //{ label: 'Title', value: data.title || 'No title', requirement: '50 - 60 Characters', validation: data.validation?.title?.half_valid, recommendation: 'Ensure the title is between 50 - 60 characters' },
//       { label: 'Title', value: data.title || 'No title', requirement: '50 - 60 Characters', valid: validateLength(data.title || '', 30, 91) ? (validateLength(data.title || '', 50, 60) ? true : "partial") : false, recommendation: 'Ensure the title is between 50 - 60 characters' },
//       //{ label: 'Meta Description', value: data.meta_description || 'No meta description', requirement: '150 - 160 Characters', valid: validateLength(data.meta_description || '', 150, 160), recommendation: 'Ensure the meta description is between 150 - 160 characters' },
//       { label: 'Meta Description', value: data.meta_description || 'No meta description', requirement: '150 - 160 Characters', valid: validateLength(data.meta_description || '', 130, 170) ? (validateLength(data.meta_description || '', 150, 160) ? true : "partial") : false, recommendation: 'Ensure the meta description is between 150 - 160 characters' },
//       { label: 'Canonical', value: data.canonical || 'No canonical tag', requirement: 'Point to preferred version of page to avoid duplicate content issues', valid: data.canonical !== 'No canonical tag', recommendation: 'Add a canonical tag to prevent duplicate content issues' },
//       { label: 'Robots Meta Tag', value: data.robots || 'No robots meta tag', requirement: 'Use noindex to prevent page from being indexed & nofollow to prevent links from being followed', valid: data.robots !== 'No robots meta tag', recommendation: 'Ensure robots meta tag is properly set' },
//       { label: 'Sitemap Status', value: data.sitemap_status || 'No sitemap', requirement: 'Submitted to Search Engine', valid: data.sitemap_status !== 'No sitemap', recommendation: 'Submit a sitemap to search engines for better crawling' },
//       { label: 'Mobile Friendly', value: data.mobile_friendly || 'Unknown', requirement: 'Responsive & works well on mobile', valid: data.mobile_friendly === 'Mobile-friendly', recommendation: 'Ensure the site is responsive and mobile-friendly' },
//       //{ label: 'Page Speed', value: data.page_speed || 'Unknown', requirement: 'Aim for faster loading times to improve user experience', valid: data.page_speed === 'Pass', recommendation: 'Improve page speed for better user experience' },
//       { label: 'Page Speed', value: data.page_speed.result || 'Unknown', details: data.page_speed.details || 'No details available', valid: data.page_speed.result === 'Pass', recommendation: 'Improve page speed for better user experience' },
//       { label: 'HTTPS Audit', value: data.httpsAuditResult || 'Unknown', requirement: 'HTTPS ensures secure communication', valid: data.httpsAuditResult === 'Pass', recommendation: 'Ensure the website uses HTTPS for secure communication' },
      
//        // Add a row for Structured Data
//        { 
//         label: 'Structured Data', 
//         value: data.structured_data ? JSON.stringify(data.structured_data, null, 2) : 'No structured data found',
//         requirement: 'Ensure correct structured data for SEO purposes', 
//         valid: data.structured_data ? 'Valid' : 'Invalid', 
//         recommendation: 'Ensure the structured data is properly implemented according to Schema.org' 
//       },

//       // Add a row for image alt text validation
//       {
//         label: 'Image Alt Text',
//         value: data.image_alt_text.total_images > 0
//             ? data.image_alt_text.missing_alt_images.length > 0
//                 ? data.image_alt_text.missing_alt_images.map(src => `${src} → No alt text`).join(', ')
//                 : `All ${data.image_alt_text.total_images} images have alt text`
//             : 'No images found',
//         requirement: 'All images should have descriptive alt text',
//         valid: data.image_alt_text.missing_alt === 0, // Passes validation if no images are missing alt text
//         recommendation: 'Ensure all images have meaningful alt text for accessibility and SEO'
//     },

//     // Add a row for Structured Data
//     {
//       label: 'Structured Data',
//       // value: data.structured_data_validation ? JSON.stringify({
//       //   totalValidItems: data.structured_data_validation.totalValidItems,
//       //   // validItems: data.structuredData_Validation.validItems,
//       //   validItemTypes: data.structured_data_validation.validItemTypes
//       // }, null, 2) : 'No structured data found',
//       value: data.structured_data_validation
//       ? `Detected Valid Items: ${data.structured_data_validation.totalValidItems}\nValid Item Types: ${data.structured_data_validation.validItemTypes.join(', ')}`
//       : 'No structured data found',

//       requirement: 'Ensure correct structured data for SEO purposes',
//       valid: data.structured_data_validation.totalValidItems > 0,
//       recommendation: 'Ensure the structured data is properly implemented according to Schema.org. Based on the result, there are ' + data.structured_data_validation.totalValidItems + ' valid items with the types: ' + (data.structured_data_validation.validItemTypes.join(", ") || 'No valid item types found.')
//     }
    
    
//     ];
//   };
    
//   const combinedRows = domains
//     .map((entry) => {
//       const rows = entry.result ? createRows(entry.result) : [];
//       return rows.map((row) => ({
//         label: row.label,
//         domainValid: row.valid,
//       }));
//     })
//     .flat();

//     const combinedScores = domains.map((entry) => {
//       if (!entry.result) return { domain: entry.domain, scores: [] };

//       const rows = createRows(entry.result);
//       const scores = rows.map((row) => ({
//         label: row.label,
//         valid: row.valid,
//       }));

//       return { domain: entry.domain, scores };
//     });


//     console.log("Combined rows:", combinedRows);
   
//     return (
//       <div className="container">
//         <div className="search-bar-form">
//           {/* Add a flex container to arrange search bars horizontally */}
//           <div className="search-bar-flex-container">
//           {/* <div className={`search-bar-flex-container ${domains.length === 1 ? "centered" : ""}`}> */}
//             {domains.map((entry, index) => (
//               <div key={index} className="search-bar-container">
//                 <div className="search-bar-wrapper">
//                   <input
//                     type="text"
//                     value={entry.domain}
//                     onChange={(e) => handleDomainChange(index, e.target.value)}
//                     placeholder={`Enter domain ${index + 1}`}
//                     className="search-bar-input"
//                   />
//                   <Button
//                     sx={{
//                       position: "absolute",
//                       right: "20px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       minWidth: "50px",
//                       height: "50%",
//                       borderRadius: "5px",
//                     }}
//                     variant="outlined"
//                     color="secondary"
//                     onClick={() => handleRemoveSearchBar(index)}
//                   >
//                     Remove
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
    
//           <Button 
//             variant="contained" 
//             onClick={handleAddSearchBar} 
//             sx={{
//               margin: "20px 0px 20px 0px"
//             }}>
//             Add Search Bar
//           </Button>
//           <Button variant="contained" onClick={handleSearch}>
//             Search
//           </Button>
//         </div>
    
//         {/* Competitor Summary Table */}
//         <div className="scrollable-table-container">
//           {searchTriggered && combinedScores.length > 0 && (
//             <SEOCompetitorAnalysisSummaryTable data={combinedScores} />
//           )}
//         </div>
    
//         <br />
    
//         {domains.map((entry, index) => (
//           <div key={index} className="scrollable-table-container">
//               {entry.result && <SEOAuditResultTable rows={createRows(entry.result)} domain={entry.domain} />}
//           </div>
//         ))}
    
//         <br />
//       </div>
//     );
    
//   };

//   export default SearchBar;      

// above is working version



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
    
    //for loading progress bar
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      let timer;
      if (loading) {
          setProgress(0);
          timer = setInterval(() => {
              setProgress((prev) => (prev >= 90 ? 90 : prev + 10)); // Simulate progress up to 90%
          }, 500);
      } else {
          clearInterval(timer);
          setProgress(100); // Complete the progress when loading stops
          setTimeout(() => setProgress(0), 500); // Reset progress after completion
      }
      return () => clearInterval(timer);
  }, [loading]);

  // segreate

    const validateLength = (value, min, max) => value.length >= min && value.length <= max;

    const fetchSEOData = async (url) => {
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
        
          return {
              ...data,
              httpsAuditResult: data.httpsAuditResult,
              mobile_friendly: data.mobile_friendly,
              page_speed: data.page_speed,
              structured_data_validation: data.structured_data_validation,
              validation: data.validation,
              
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

      // Reset searchTriggered before starting a new search
      setSearchTriggered(false);

      // Reset previous results but do NOT reset searchTriggered yet
      setDomains((prevDomains) => prevDomains.map(entry => ({ ...entry, result: null })));
     
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

    // Update the domains with fetched data
    console.log("Updated domains:", updatedDomains);
    setDomains(updatedDomains);
    // setSearchTriggered(false);  //Reset search state

    setTimeout(() => {
      setLoading(false); // Stop loading AFTER fetching data
      setProgress(100); // Complete progress bar
      setTimeout(() => setProgress(0), 500); // Reset progress
    }, 500);

  };

  const createRows = (data) => {
    console.log("Creating rows for data:", data);
    if (!data) {
      return []; // Return an empty array if data is undefined or null
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
      { label: 'Sitemap Status', value: data.sitemap_status || 'No sitemap', requirement: 'Submitted to Search Engine', valid: data.sitemap_status !== 'No sitemap', recommendation: 'Submit a sitemap to search engines for better crawling' },
      { label: 'Mobile Friendly', value: data.mobile_friendly || 'Unknown', requirement: 'Responsive & works well on mobile', valid: data.mobile_friendly === 'Mobile-friendly', recommendation: 'Ensure the site is responsive and mobile-friendly' },
      //{ label: 'Page Speed', value: data.page_speed || 'Unknown', requirement: 'Aim for faster loading times to improve user experience', valid: data.page_speed === 'Pass', recommendation: 'Improve page speed for better user experience' },
      { label: 'Page Speed', value: data.page_speed.result || 'Unknown', details: data.page_speed.details || 'No details available', valid: data.page_speed.result === 'Pass', recommendation: 'Improve page speed for better user experience' },
      { label: 'HTTPS Audit', value: data.httpsAuditResult || 'Unknown', requirement: 'HTTPS ensures secure communication', valid: data.httpsAuditResult === 'Pass', recommendation: 'Ensure the website uses HTTPS for secure communication' },
      
       // Add a row for Structured Data
      //  { 
      //   label: 'Structured Data', 
      //   value: data.structured_data ? JSON.stringify(data.structured_data, null, 2) : 'No structured data found',
      //   requirement: 'Ensure correct structured data for SEO purposes', 
      //   valid: data.structured_data ? 'Valid' : 'Invalid', 
      //   recommendation: 'Ensure the structured data is properly implemented according to Schema.org' 
      // },

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

    // Add a row for Structured Data
    {
      label: 'Structured Data',
      // value: data.structured_data_validation ? JSON.stringify({
      //   totalValidItems: data.structured_data_validation.totalValidItems,
      //   // validItems: data.structuredData_Validation.validItems,
      //   validItemTypes: data.structured_data_validation.validItemTypes
      // }, null, 2) : 'No structured data found',
      value: data.structured_data_validation
      ? `Detected Valid Items: ${data.structured_data_validation.totalValidItems}\nValid Item Types: ${data.structured_data_validation.validItemTypes.join(', ')}`
      : 'No structured data found',

      requirement: 'Ensure correct structured data for SEO purposes',
      valid: data.structured_data_validation.totalValidItems > 0,
      recommendation: 'Ensure the structured data is properly implemented according to Schema.org. Based on the result, there are ' + data.structured_data_validation.totalValidItems + ' valid items with the types: ' + (data.structured_data_validation.validItemTypes.join(", ") || 'No valid item types found.')
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
              <Button variant="contained" onClick={handleSearch} disabled={loading} 
              
              sx={{ 
                width: '100%',
                }}>
                {loading ? "Analyzing..." : "Search"}  
                Search
              </Button>
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






 // return (
    //   <div className="container">
    //     <div className="search-bar-form">
    //       {domains.map((entry, index) => (
    //         <div key={index} className="search-bar-container">
    //           <div className="search-bar-wrapper">
    //             <input
    //               type="text"
    //               value={entry.domain}
    //               onChange={(e) => handleDomainChange(index, e.target.value)}
    //               placeholder={`Enter domain ${index + 1}`}
    //               className="search-bar-input"
    //             />
                
    //             <Button
    //             sx={{
    //               marginTop: "10px"
    //             }}
    //               variant="outlined"
    //               color="secondary"
    //               onClick={() => handleRemoveSearchBar(index)}
    //             >
    //               Remove
    //             </Button>
    //           </div>
    //         </div>
    //       ))}
    //       <Button 
    //         variant="contained" 
    //         onClick={handleAddSearchBar} 
    //         sx={{
    //           margin: "0px 0px 10px 0px"
    //         }}>
    //         Add Search Bar
    //       </Button>
    //       <Button variant="contained" onClick={handleSearch}>
    //         Search
    //       </Button>
    //     </div>

    //     {/* Competitor Summary Table */}
    //     <div className="scrollable-table-container">
    //       {searchTriggered && combinedScores.length > 0 && (
    //         <SEOCompetitorAnalysisSummaryTable data={combinedScores} />
    //       )}
    //     </div>

    //     <br />

    //     {domains.map((entry, index) => (
    //       <div key={index} className="scrollable-table-container">
    //           {entry.result && <SEOAuditResultTable rows={createRows(entry.result) } />}
    //       </div>
        
    //     ))}

    //     <br />
    //   </div>
    // );


// new new new one (for up to 5 searchbar)
// const SearchBar = () => {
//   const [domains, setDomains] = useState([{ domain: "", result: null }]);

//   // Add a new search bar
//   const handleAddSearchBar = () => {
//     if (domains.length < 5) {
//       setDomains([...domains, { domain: "", result: null }]);
//     } else {
//       alert("You can only add up to 5 search bars.");
//     }
//   };

//   // Remove a specific search bar
//   const handleRemoveSearchBar = (index) => {
//     setDomains(domains.filter((_, i) => i !== index));
//   };

//   // Update a specific domain input
//   const handleDomainChange = (index, value) => {
//     const updatedDomains = [...domains];
//     updatedDomains[index].domain = value;
//     setDomains(updatedDomains);
//   };

//   // Perform search for all domains
//   const handleSearch = async () => {
//     const updatedDomains = await Promise.all(
//       domains.map(async (entry) => {
//         const { domain } = entry;
//         if (!domain) {
//           alert("Please fill in all domain fields before searching.");
//           return entry;
//         }

//         try {
//           const response = await fetch(`http://localhost:8000/seo-audit/?url=${encodeURIComponent(domain)}`);
//           if (!response.ok) throw new Error(`Error fetching data for ${domain}: ${response.statusText}`);
//           const data = await response.json();

//           if (data.error) {
//             alert(`Error fetching data for ${domain}: ${data.error}`);
//             return { domain, result: null };
//           }

//           return { domain, result: data };
//         } catch (error) {
//           console.error(`Error fetching SEO data for ${domain}:`, error);
//           alert(`Failed to fetch SEO data for ${domain}. Please try again later.`);
//           return { domain, result: null };
//         }
//       })
//     );

//     setDomains(updatedDomains);
//   };

//   return (
//     <div className="container">
//       <div className="search-bar-form">
//         {domains.map((entry, index) => (
//           <div key={index} className="search-bar-container">
//             <div className="search-bar-wrapper">
//               <input
//                 type="text"
//                 value={entry.domain}
//                 onChange={(e) => handleDomainChange(index, e.target.value)}
//                 placeholder={`Enter domain ${index + 1}`}
//                 className="search-bar-input"
//               />
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 onClick={() => handleRemoveSearchBar(index)}
//               >
//                 Remove
//               </Button>
//             </div>
//           </div>
//         ))}
//         <Button variant="contained" onClick={handleAddSearchBar}>
//           Add Search Bar
//         </Button>
//         <Button variant="contained" onClick={handleSearch}>
//           Search
//         </Button>
//       </div>

//       {/* Display results */}
//       {domains.map(
//         (entry, index) =>
//           entry.result && (
//             <div key={index} className="scrollable-table-container">
//               <h3>Results for {entry.domain}</h3>
//               {/* Replace the following table with your actual result display */}
//               <pre>{JSON.stringify(entry.result, null, 2)}</pre>
//             </div>
//           )
//       )}
//     </div>
//   );
// };

// export default SearchBar;


// 2 searchbar only
// const SearchBar = ({ onSearch }) => {
  //   // for setting use state for the my domain and competitor domain
  //   const [domain, setDomain] = useState('');
  //   const [result, setResult] = useState(null);
  //   const [competitorDomain, setCompetitorDomain] = useState('');
  //   const [competitorResult, setCompetitorResult] = useState(null);

  //   // handle domain submit 
  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     onSearch(domain);
    
  //     try {
  //         const response = await fetch(`http://localhost:8000/seo-audit/?url=${encodeURIComponent(domain)}`);
          
  //         if (!response.ok) {
  //           throw new Error(`Error: ${response.statusText}`);
  //         }

  //         // Log the raw response object for debugging
  //         console.log('Raw Response:', response);

  //         const data = await response.json();

  //         // Debug: log the parsed JSON data
  //         console.log('Parsed Response Data:', data);

  //         if (data.error) {
  //           alert(data.error);
  //         } else {
  //           setResult({
  //               ...data,
  //               mobile_friendly: data.mobile_friendly,
  //               page_speed:data.page_speed
  //           });
  //         }
  //       } catch (error) {
  //         console.error('Error fetching SEO data:', error);
  //         alert('Failed to fetch SEO data. Please try again later.');
          
  //       }
  //   };

  //   // handle comptitor submit request 
  //   const handleCompetitorDomainSubmit = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const response = await fetch(`http://localhost:8000/seo-audit/?url=${encodeURIComponent(competitorDomain)}`);
  //       const data = await response.json();
  //       if (data.error) {
  //         alert(data.error);
  //       } else {
  //         setCompetitorResult(data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching SEO data for competitor website:', error);
  //     }
  //   };

  //   const validateLength = (value, min, max) => {
  //     return value.length >= min && value.length <= max;
  //   };

  //   const rows = result
  //     ? [
  //         { label: 'HTML Type', 
  //           value: result.html_type, 
  //           requirement:'NIL',
  //           valid: 'N/A', 
  //           recommendation: 'N/A',
  //         },
  //         { label: 'Title', 
  //           value: result.title || 'No title', 
  //           requirement:'50 - 60 Characters',
  //           valid: validateLength(result.title || '', 50, 60), 
  //           recommendation: 'Ensure the title is between 50 - 60 characters'
  //         },
  //         { label: 'Meta Description', 
  //           value: result.meta_description || 'No meta description', 
  //           requirement: '150 - 160 Characters',
  //           valid: validateLength(result.meta_description || '', 150, 160), 
  //           recommendation: 'Ensure the meta descrption is between 150 - 160 characters'
  //         },
  //         { label: 'Canonical', 
  //           value: result.canonical || 'No canonical tag', 
  //           requirement: 'Point to preferred version of page to avoid duplicate content issues',
  //           valid: result.canonical !== 'No canonical tag', 
  //           recommendation: 'Add a canonical tag to prevent duplicate content issues'
  //         },
  //         { label: 'Robots Meta Tag', 
  //           value: result.robots || 'No robots meta tag', 
  //           requirement: 'Use no noindex to prevent page from being indexed & nofollow to prevent links from being followed',
  //           valid: result.robots !== 'No robots meta tag', 
  //           recommendation: 'Ensure robots meta tag is properly set'
  //         },
  //         { label: 'Sitemap Status', 
  //           value: result.sitemap_status || 'No sitemap', 
  //           requirement: 'Submmited to Search Engine',
  //           valid: result.sitemap_status !== 'No sitemap', 
  //           recommendation: 'Submit a sitemap to search engines for better crawling'

  //         },
  //         { label: 'Mobile Friendly', 
  //           value: result.mobile_friendly || 'Unknown', 
  //           requirement: 'Responsive & works well on mobile',
  //           valid: result.mobile_friendly === 'Mobile-friendly',
  //           recommendation: 'Ensure the site is responsive and mobile-friendly'
  //         },
  //         { label: 'Page Speed', 
  //           value: result.page_speed || 'Unknown', 
  //           requirement: 'Aim for faster loading times to improve user experience',
  //           valid: result.page_speed === 'Pass', 
  //           recommendation: 'Improve page speed for better user experience'
  //         },

  //       ]
  //     : [];

  //     const competitorRows = competitorResult
  //     ? [
  //         { label: 'HTML Type', value: competitorResult.html_type || 'Unknown', requirement: 'N/A', valid: 'N/A', recommendation: 'N/A' },
  //         { label: 'Title', value: competitorResult.title || 'No title', requirement: '50 - 60 Characters', valid: validateLength(competitorResult.title || '', 50, 60), recommendation: 'Ensure the title is between 50 - 60 characters' },
  //         { label: 'Meta Description', value: competitorResult.meta_description || 'No meta description', requirement: '150 - 160 Characters', valid: validateLength(competitorResult.meta_description || '', 150, 160), recommendation: 'Ensure the meta description is between 150 - 160 characters' },
  //         { label: 'Canonical', value: competitorResult.canonical || 'No canonical tag', requirement: 'Point to preferred version of page to avoid duplicate content issues', valid: competitorResult.canonical !== 'No canonical tag', recommendation: 'Add a canonical tag to prevent duplicate content issues' },
  //         { label: 'Robots Meta Tag', value: competitorResult.robots || 'No robots meta tag', requirement: 'Use noindex to prevent page from being indexed & nofollow to prevent links from being followed', valid: competitorResult.robots !== 'No robots meta tag', recommendation: 'Ensure robots meta tag is properly set' },
  //         { label: 'Sitemap Status', value: competitorResult.sitemap_status || 'No sitemap', requirement: 'Submitted to Search Engine', valid: competitorResult.sitemap_status !== 'No sitemap', recommendation: 'Submit a sitemap to search engines for better crawling' },
  //         { label: 'Mobile Friendly', value: competitorResult.mobile_friendly || 'Unknown', requirement: 'Responsive & works well on mobile devices', valid: competitorResult.mobile_friendly === 'Yes', recommendation: 'Ensure the site is responsive and mobile-friendly' },
  //         { label: 'Page Speed', value: competitorResult.page_speed || 'Unknown', requirement: 'Aim for faster loading times to improve user experience', valid: competitorResult.page_speed === 'Good', recommendation: 'Improve page speed for better user experience' },
  //       ]
  //     : [];  

  //   return (
  //     <div className="container">
  //       <form onSubmit={handleSubmit} className="search-bar-form">
  //         <div className="search-bar-container">
  //           <div className="search-bar-wrapper">
  //             <label
  //               htmlFor="search-input"
  //               className={`search-bar-label ${
  //                 domain ? "active" : ""
  //               }`}
  //             >
  //               {/* Enter your website domain.com */}
  //             </label>
  //             <br></br>
  //             <input
  //               id="search-input"
  //               type="text"
  //               value={domain}
  //               onChange={(e) => setDomain(e.target.value)}
  //               placeholder=""
  //               className="search-bar-input"
  //             />
  //             <label htmlFor="search-input" className="search-bar-label">
  //               Enter your website domain.com
  //             </label>
  //           </div>
  //           <button type="submit" className="search-bar-button">
  //             <Search className="search-bar-icon" />
  //           </button>
  //         </div>
  //       </form>

  //       {/* Competitor's Searchbar */}
  //       <br></br>
  //       <form onSubmit={handleCompetitorDomainSubmit} className="search-bar-form">
  //         <div className="search-bar-container">
  //           <div className="search-bar-wrapper">
  //             <label
  //               htmlFor="search-input"
  //               className={`search-bar-label ${
  //                 competitorDomain ? "active" : ""
  //               }`}
  //             >
  //               {/* Enter your website domain.com */}
  //             </label>
  //             <br></br>
  //             <input
  //               id="search-input"
  //               type="text"
  //               value={competitorDomain}
  //               onChange={(e) => setCompetitorDomain(e.target.value)}
  //               placeholder=""
  //               className="search-bar-input"
  //             />
  //             <label htmlFor="search-input" className="search-bar-label">
  //               Enter competitor website domain.com
  //             </label>
  //           </div>
  //           <button type="submit" className="search-bar-button">
  //             <Search className="search-bar-icon" />
  //           </button>
  //         </div>
  //       </form>

  //       <Button variant="contained">Contained</Button>
        

  //       <div className="scrollable-table-container">
  //         {result && <SEOAuditResultTable rows={rows} headings={result.headings} />}
  //       </div>
  //       <br></br>
  //       <div className="scrollable-table-container">
  //         {competitorResult && <SEOAuditResultTable rows={competitorRows} headings={competitorResult.headings} />}
  //       </div>
  //     </div>
  //   );
  // };

  //new one ( for 2 search bar)
  // const SearchBar = ({ onSearch }) => {
  //   const [domain, setDomain] = useState('');
  //   const [result, setResult] = useState(null);
  //   const [competitorDomain, setCompetitorDomain] = useState('');
  //   const [competitorResult, setCompetitorResult] = useState(null);
  
  //   const handleCombinedSubmit = async (e) => {
  //     if (!domain || !competitorDomain) {
  //       e.preventDefault();
  //       alert("Please enter both domains before submitting.");
  //       return;
  //     }
  //     // section that handles 1 search button with searching of 2 domains
  
  //     try {
  //       // Fetch user domain SEO data
  //       const domainResponse = await fetch(`http://localhost:8000/seo-audit/?url=${encodeURIComponent(domain)}`);
  //       if (!domainResponse.ok) throw new Error(`Error for domain: ${domainResponse.statusText}`);
  //       const domainData = await domainResponse.json();
  
  //       if (domainData.error) {
  //         alert(`Error fetching data for domain: ${domainData.error}`);
  //       } else {
  //         setResult({
  //           ...domainData,
  //           mobile_friendly: domainData.mobile_friendly,
  //           page_speed: domainData.page_speed,
  //         });
  //       }
  
  //       // Fetch competitor domain SEO data
  //       const competitorResponse = await fetch(`http://localhost:8000/seo-audit/?url=${encodeURIComponent(competitorDomain)}`);
  //       if (!competitorResponse.ok) throw new Error(`Error for competitor domain: ${competitorResponse.statusText}`);
  //       const competitorData = await competitorResponse.json();
  
  //       if (competitorData.error) {
  //         alert(`Error fetching data for competitor domain: ${competitorData.error}`);
  //       } else {
  //         setCompetitorResult({
  //           ...competitorData,
  //           mobile_friendly: competitorData.mobile_friendly,
  //           page_speed: competitorData.page_speed,
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Error fetching SEO data:', error);
  //       alert('Failed to fetch SEO data. Please try again later.');
  //     }
  //   };
    
  //   // validating the length of meta description and title text 
  //   const validateLength = (value, min, max) => value.length >= min && value.length <= max;
  
  //   const rows = result
  //       ? [
  //           { label: 'HTML Type', 
  //             value: result.html_type, 
  //             requirement:'NIL',
  //             valid: 'N/A', 
  //             recommendation: 'N/A',
  //           },
  //           { label: 'Title', 
  //             value: result.title || 'No title', 
  //             requirement:'50 - 60 Characters',
  //             valid: validateLength(result.title || '', 50, 60), 
  //             recommendation: 'Ensure the title is between 50 - 60 characters'
  //           },
  //           { label: 'Meta Description', 
  //             value: result.meta_description || 'No meta description', 
  //             requirement: '150 - 160 Characters',
  //             valid: validateLength(result.meta_description || '', 150, 160), 
  //             recommendation: 'Ensure the meta descrption is between 150 - 160 characters'
  //           },
  //           { label: 'Canonical', 
  //             value: result.canonical || 'No canonical tag', 
  //             requirement: 'Point to preferred version of page to avoid duplicate content issues',
  //             valid: result.canonical !== 'No canonical tag', 
  //             recommendation: 'Add a canonical tag to prevent duplicate content issues'
  //           },
  //           { label: 'Robots Meta Tag', 
  //             value: result.robots || 'No robots meta tag', 
  //             requirement: 'Use no noindex to prevent page from being indexed & nofollow to prevent links from being followed',
  //             valid: result.robots !== 'No robots meta tag', 
  //             recommendation: 'Ensure robots meta tag is properly set'
  //           },
  //           { label: 'Sitemap Status', 
  //             value: result.sitemap_status || 'No sitemap', 
  //             requirement: 'Submmited to Search Engine',
  //             valid: result.sitemap_status !== 'No sitemap', 
  //             recommendation: 'Submit a sitemap to search engines for better crawling'
  
  //           },
  //           { label: 'Mobile Friendly', 
  //             value: result.mobile_friendly || 'Unknown', 
  //             requirement: 'Responsive & works well on mobile',
  //             valid: result.mobile_friendly === 'Mobile-friendly',
  //             recommendation: 'Ensure the site is responsive and mobile-friendly'
  //           },
  //           { label: 'Page Speed', 
  //             value: result.page_speed || 'Unknown', 
  //             requirement: 'Aim for faster loading times to improve user experience',
  //             valid: result.page_speed === 'Pass', 
  //             recommendation: 'Improve page speed for better user experience'
  //           },
  
  //         ]
  //       : [];
  
  //       const competitorRows = competitorResult
  //       ? [
  //           { label: 'HTML Type', value: competitorResult.html_type || 'Unknown', requirement: 'N/A', valid: 'N/A', recommendation: 'N/A' },
  //           { label: 'Title', value: competitorResult.title || 'No title', requirement: '50 - 60 Characters', valid: validateLength(competitorResult.title || '', 50, 60), recommendation: 'Ensure the title is between 50 - 60 characters' },
  //           { label: 'Meta Description', value: competitorResult.meta_description || 'No meta description', requirement: '150 - 160 Characters', valid: validateLength(competitorResult.meta_description || '', 150, 160), recommendation: 'Ensure the meta description is between 150 - 160 characters' },
  //           { label: 'Canonical', value: competitorResult.canonical || 'No canonical tag', requirement: 'Point to preferred version of page to avoid duplicate content issues', valid: competitorResult.canonical !== 'No canonical tag', recommendation: 'Add a canonical tag to prevent duplicate content issues' },
  //           { label: 'Robots Meta Tag', value: competitorResult.robots || 'No robots meta tag', requirement: 'Use noindex to prevent page from being indexed & nofollow to prevent links from being followed', valid: competitorResult.robots !== 'No robots meta tag', recommendation: 'Ensure robots meta tag is properly set' },
  //           { label: 'Sitemap Status', value: competitorResult.sitemap_status || 'No sitemap', requirement: 'Submitted to Search Engine', valid: competitorResult.sitemap_status !== 'No sitemap', recommendation: 'Submit a sitemap to search engines for better crawling' },
  //           { label: 'Mobile Friendly', value: competitorResult.mobile_friendly || 'Unknown', requirement: 'Responsive & works well on mobile devices', valid: competitorResult.mobile_friendly === 'Yes', recommendation: 'Ensure the site is responsive and mobile-friendly' },
  //           { label: 'Page Speed', value: competitorResult.page_speed || 'Unknown', requirement: 'Aim for faster loading times to improve user experience', valid: competitorResult.page_speed === 'Pass', recommendation: 'Improve page speed for better user experience' },
  //         ]
  //       : [];

  //       // const combinedRows = [...rows, ...competitorRows].map((row, index) => ({
  //       //   ...row,
  //       //   source: index < rows.length ? "Domain" : "Competitor",
  //       // }));

  //       const combinedRows = result && competitorResult
  //       ? [
  //           { label: 'HTML Type', 
  //             domainValid: 'N/A', 
  //             competitorValid: 'N/A'
  //           },
  //           { label: 'Title', 
  //             domainValid: validateLength(result.title || '', 50, 60), 
  //             competitorValid: validateLength(competitorResult.title || '', 50, 60)
  //           },
  //           { label: 'Meta Description', 
  //             domainValid: validateLength(result.meta_description || '', 150, 160), 
  //             competitorValid: validateLength(competitorResult.meta_description || '', 150, 160)
  //           },
  //           { label: 'Canonical', 
  //             domainValid: result.canonical !== 'No canonical tag', 
  //             competitorValid: competitorResult.canonical !== 'No canonical tag'
  //           },
  //           { label: 'Robots Meta Tag', 
  //             domainValid: result.robots !== 'No robots meta tag', 
  //             competitorValid: competitorResult.robots !== 'No robots meta tag'
  //           },
  //           { label: 'Sitemap Status', 
  //             domainValid: result.sitemap_status !== 'No sitemap', 
  //             competitorValid: competitorResult.sitemap_status !== 'No sitemap'
  //           },
  //           { label: 'Mobile Friendly', 
  //             domainValid: result.mobile_friendly === 'Mobile-friendly', 
  //             competitorValid: competitorResult.mobile_friendly === 'Yes'
  //           },
  //           { label: 'Page Speed', 
  //             domainValid: result.page_speed === 'Pass', 
  //             competitorValid: competitorResult.page_speed === 'Pass'
  //           }
  //         ]
  //       : [];

  
  //   return (
  //     <div className="container">
  //       <div className="search-bar-form">
  //         <div className="search-bar-container">
  //           <div className="search-bar-wrapper">
  //             <label
  //                 htmlFor="search-input"
  //                 className={`search-bar-label ${
  //                   domain ? "active" : ""
  //                 }`}
  //               >
  //                 {/* Enter your website domain.com */}
  //             </label>
  //             <br></br>
  //             <input
  //               id="search-input"
  //               type="text"
  //               value={domain}
  //               onChange={(e) => setDomain(e.target.value)}
  //               placeholder=" "
  //               className="search-bar-input"
  //             />
  //             <label htmlFor="search-input" className="search-bar-label">
  //                Enter your website domain.com
  //             </label>
  //           </div>
  //         </div>
  //         <div className="search-bar-container">
  //           <div className="search-bar-wrapper">
  //             <label
  //                 htmlFor="search-input"
  //                 className={`search-bar-label ${
  //                   competitorDomain ? "active" : ""
  //                 }`}
  //               >
  //                 {/* Enter your website domain.com */}
  //               </label>
  //             <br></br>
  //             <input
  //               id="search-input"
  //               type="text"
  //               value={competitorDomain}
  //               onChange={(e) => setCompetitorDomain(e.target.value)}
  //               placeholder=" "
  //               className="search-bar-input"
  //             />
  //             <label htmlFor="search-input" className="search-bar-label">
  //               Enter competitor website domain.com
  //             </label>
  //           </div>
  //         </div>  
  //           <Button variant="contained" onClick={handleCombinedSubmit}>
  //             Search
  //           </Button>
          
  //       </div>
  //       <div className="scrollable-table-container">
  //         {result && <SEOCompetitorAnalysisSummaryTable rows={combinedRows} headings={result.headings} />}
  //       </div>
  //       <br></br>
  //       <div className="scrollable-table-container">
  //         {result && <SEOAuditResultTable rows={rows} headings={result.headings} />}
  //       </div>
  //       <br></br>
  //       <div className="scrollable-table-container">
  //         {competitorResult && <SEOAuditResultTable rows={competitorRows} headings={competitorResult.headings} />}
  //       </div>
  //     </div>
  //   );
  // };
  
  //  export default SearchBar;
  
  // new one but better logic with out repetition
//   const SearchBar = ({ onSearch }) => {
//     const [domain, setDomain] = useState('');
//     const [result, setResult] = useState(null);
//     const [competitorDomain, setCompetitorDomain] = useState('');
//     const [competitorResult, setCompetitorResult] = useState(null);

//     const validateLength = (value, min, max) => value.length >= min && value.length <= max;

//     const fetchSEOData = async (url) => {
//         try {
//             const response = await fetch(`http://localhost:8000/seo-audit/?url=${encodeURIComponent(url)}`);
//             if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//             const data = await response.json();

//             if (data.error) {
//                 alert(`Error fetching data for ${url}: ${data.error}`);
//                 return null;
//             }

//             return {
//                 ...data,
//                 mobile_friendly: data.mobile_friendly,
//                 page_speed: data.page_speed,
//             };
//         } catch (error) {
//             console.error(`Error fetching data for ${url}:`, error);
//             alert('Failed to fetch SEO data. Please try again later.');
//             return null;
//         }
//     };

//     const handleCombinedSubmit = async (e) => {
//         e.preventDefault();

//         if (!domain || !competitorDomain) {
//             alert('Please enter both domains before submitting.');
//             return;
//         }

//         const domainData = await fetchSEOData(domain);
//         const competitorData = await fetchSEOData(competitorDomain);

//         setResult(domainData);
//         setCompetitorResult(competitorData);
//     };

//     const createRows = (data) => ([
//         { label: 'HTML Type', value: data.html_type || 'Unknown', requirement: 'N/A', valid: 'N/A', recommendation: 'N/A' },
//         { label: 'Title', value: data.title || 'No title', requirement: '50 - 60 Characters', valid: validateLength(data.title || '', 50, 60), recommendation: 'Ensure the title is between 50 - 60 characters' },
//         { label: 'Meta Description', value: data.meta_description || 'No meta description', requirement: '150 - 160 Characters', valid: validateLength(data.meta_description || '', 150, 160), recommendation: 'Ensure the meta description is between 150 - 160 characters' },
//         { label: 'Canonical', value: data.canonical || 'No canonical tag', requirement: 'Point to preferred version of page to avoid duplicate content issues', valid: data.canonical !== 'No canonical tag', recommendation: 'Add a canonical tag to prevent duplicate content issues' },
//         { label: 'Robots Meta Tag', value: data.robots || 'No robots meta tag', requirement: 'Use noindex to prevent page from being indexed & nofollow to prevent links from being followed', valid: data.robots !== 'No robots meta tag', recommendation: 'Ensure robots meta tag is properly set' },
//         { label: 'Sitemap Status', value: data.sitemap_status || 'No sitemap', requirement: 'Submitted to Search Engine', valid: data.sitemap_status !== 'No sitemap', recommendation: 'Submit a sitemap to search engines for better crawling' },
//         { label: 'Mobile Friendly', value: data.mobile_friendly || 'Unknown', requirement: 'Responsive & works well on mobile', valid: data.mobile_friendly === 'Mobile-friendly', recommendation: 'Ensure the site is responsive and mobile-friendly' },
//         { label: 'Page Speed', value: data.page_speed || 'Unknown', requirement: 'Aim for faster loading times to improve user experience', valid: data.page_speed === 'Pass', recommendation: 'Improve page speed for better user experience' },
//     ]);

//     const rows = result ? createRows(result) : [];
//     const competitorRows = competitorResult ? createRows(competitorResult) : [];

//     const combinedRows = result && competitorResult
//         ? rows.map((row, index) => ({
//             label: row.label,
//             domainValid: row.valid,
//             competitorValid: competitorRows[index].valid,
//         }))
//         : [];

//     return (
//         <div className="container">
//             <div className="search-bar-form">
//                 <div className="search-bar-container">
//                     <div className="search-bar-wrapper">
//                         <label htmlFor="domain" className={`search-bar-label ${domain ? 'active' : ''}`}>
//                             Enter your website domain.com
//                         </label>
//                         <input
//                             id="domain"
//                             type="text"
//                             value={domain}
//                             onChange={(e) => setDomain(e.target.value)}
//                             placeholder=" "
//                             className="search-bar-input"
//                         />
//                     </div>
//                 </div>

//                 <div className="search-bar-container">
//                     <div className="search-bar-wrapper">
//                         <label htmlFor="competitorDomain" className={`search-bar-label ${competitorDomain ? 'active' : ''}`}>
//                             Enter competitor website domain.com
//                         </label>
//                         <input
//                             id="competitorDomain"
//                             type="text"
//                             value={competitorDomain}
//                             onChange={(e) => setCompetitorDomain(e.target.value)}
//                             placeholder=" "
//                             className="search-bar-input"
//                         />
//                     </div>
//                 </div>

//                 <Button variant="contained" onClick={handleCombinedSubmit}>
//                     Search
//                 </Button>
//             </div>

//             <div className="scrollable-table-container">
//                 {result && <SEOCompetitorAnalysisSummaryTable rows={combinedRows} headings={result.headings} />}
//             </div>

//             <br />

//             <div className="scrollable-table-container">
//                 {result && <SEOAuditResultTable rows={rows} headings={result.headings} />}
//             </div>

//             <br />

//             <div className="scrollable-table-container">
//                 {competitorResult && <SEOAuditResultTable rows={competitorRows} headings={competitorResult.headings} />}
//             </div>
//         </div>
//     );
// };

// export default SearchBar;


// // new new new one ( for up to 5 searchbar and fully)

// const SearchBar = ({ onSearch }) => {
//   const [domains, setDomains] = useState([{ domain: '', competitorDomain: '', result: null }]);

//   const validateLength = (value, min, max) => value.length >= min && value.length <= max;

//   const fetchSEOData = async (url) => {
//       try {
//           const response = await fetch(`http://localhost:8000/seo-audit/?url=${encodeURIComponent(url)}`);
//           if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//           const data = await response.json();

//           if (data.error) {
//               alert(`Error fetching data for ${url}: ${data.error}`);
//               return null;
//           }

//           return {
//               ...data,
//               mobile_friendly: data.mobile_friendly,
//               page_speed: data.page_speed,
//           };
//       } catch (error) {
//           console.error(`Error fetching data for ${url}:`, error);
//           alert('Failed to fetch SEO data. Please try again later.');
//           return null;
//       }
//   };

//   const handleCombinedSubmit = async (e) => {
//       e.preventDefault();

//       // Check if all domain and competitorDomain fields are filled
//       if (domains.some(entry => !entry.domain || !entry.competitorDomain)) {
//           alert('Please enter both domains for all entries before submitting.');
//           return;
//       }

//       const updatedDomains = await Promise.all(
//           domains.map(async (entry) => {
//               const domainData = await fetchSEOData(entry.domain);
//               const competitorData = await fetchSEOData(entry.competitorDomain);

//               return {
//                   ...entry,
//                   result: { domainData, competitorData },
//               };
//           })
//       );

//       setDomains(updatedDomains);
//   };

//   const handleAddSearchBar = () => {
//       if (domains.length < 5) {
//           setDomains([...domains, { domain: '', competitorDomain: '', result: null }]);
//       } else {
//           alert('You can only add up to 5 domains.');
//       }
//   };

//   const handleRemoveSearchBar = (index) => {
//       setDomains(domains.filter((_, i) => i !== index));
//   };

//   const handleDomainChange = (index, value) => {
//       const updatedDomains = [...domains];
//       updatedDomains[index].domain = value;
//       setDomains(updatedDomains);
//   };

//   const handleCompetitorDomainChange = (index, value) => {
//       const updatedDomains = [...domains];
//       updatedDomains[index].competitorDomain = value;
//       setDomains(updatedDomains);
//   };

//   const createRows = (data) => ([
//       { label: 'HTML Type', value: data.html_type || 'Unknown', requirement: 'N/A', valid: 'N/A', recommendation: 'N/A' },
//       { label: 'Title', value: data.title || 'No title', requirement: '50 - 60 Characters', valid: validateLength(data.title || '', 50, 60), recommendation: 'Ensure the title is between 50 - 60 characters' },
//       { label: 'Meta Description', value: data.meta_description || 'No meta description', requirement: '150 - 160 Characters', valid: validateLength(data.meta_description || '', 150, 160), recommendation: 'Ensure the meta description is between 150 - 160 characters' },
//       { label: 'Canonical', value: data.canonical || 'No canonical tag', requirement: 'Point to preferred version of page to avoid duplicate content issues', valid: data.canonical !== 'No canonical tag', recommendation: 'Add a canonical tag to prevent duplicate content issues' },
//       { label: 'Robots Meta Tag', value: data.robots || 'No robots meta tag', requirement: 'Use noindex to prevent page from being indexed & nofollow to prevent links from being followed', valid: data.robots !== 'No robots meta tag', recommendation: 'Ensure robots meta tag is properly set' },
//       { label: 'Sitemap Status', value: data.sitemap_status || 'No sitemap', requirement: 'Submitted to Search Engine', valid: data.sitemap_status !== 'No sitemap', recommendation: 'Submit a sitemap to search engines for better crawling' },
//       { label: 'Mobile Friendly', value: data.mobile_friendly || 'Unknown', requirement: 'Responsive & works well on mobile', valid: data.mobile_friendly === 'Mobile-friendly', recommendation: 'Ensure the site is responsive and mobile-friendly' },
//       { label: 'Page Speed', value: data.page_speed || 'Unknown', requirement: 'Aim for faster loading times to improve user experience', valid: data.page_speed === 'Pass', recommendation: 'Improve page speed for better user experience' },
//   ]);

//   const combinedRows = domains
//       .map((entry, index) => {
//           const rows = entry.result ? createRows(entry.result.domainData) : [];
//           const competitorRows = entry.result ? createRows(entry.result.competitorData) : [];

//           return rows.map((row, i) => ({
//               label: row.label,
//               domainValid: row.valid,
//               competitorValid: competitorRows[i]?.valid || 'N/A',
//           }));
//       })
//       .flat();

//   return (
//       <div className="container">
//           <div className="search-bar-form">
//               {domains.map((entry, index) => (
//                   <div key={index} className="search-bar-container">
//                       <div className="search-bar-wrapper">
//                           <label htmlFor={`domain-${index}`} className={`search-bar-label ${entry.domain ? 'active' : ''}`}>
//                               Enter your website domain.com
//                           </label>
//                           <input
//                               id={`domain-${index}`}
//                               type="text"
//                               value={entry.domain}
//                               onChange={(e) => handleDomainChange(index, e.target.value)}
//                               placeholder=" "
//                               className="search-bar-input"
//                           />
//                       </div>

//                       <div className="search-bar-wrapper">
//                           <label htmlFor={`competitorDomain-${index}`} className={`search-bar-label ${entry.competitorDomain ? 'active' : ''}`}>
//                               Enter competitor website domain.com
//                           </label>
//                           <input
//                               id={`competitorDomain-${index}`}
//                               type="text"
//                               value={entry.competitorDomain}
//                               onChange={(e) => handleCompetitorDomainChange(index, e.target.value)}
//                               placeholder=" "
//                               className="search-bar-input"
//                           />
//                       </div>

//                       <Button variant="outlined" color="secondary" onClick={() => handleRemoveSearchBar(index)}>
//                           Remove
//                       </Button>
//                   </div>
//               ))}

//               <Button variant="contained" onClick={handleAddSearchBar}>
//                   Add Domain Search Bar
//               </Button>

//               <Button variant="contained" onClick={handleCombinedSubmit}>
//                   Search
//               </Button>
//           </div>

//           <div className="scrollable-table-container">
//               {combinedRows.length > 0 && <SEOCompetitorAnalysisSummaryTable rows={combinedRows} />}
//           </div>

//           <br />

//           {domains.map((entry, index) => (
//               <div key={index} className="scrollable-table-container">
//                   {entry.result && <SEOAuditResultTable rows={createRows(entry.result.domainData)} />}
//               </div>
//           ))}

//           <br />

//           {domains.map((entry, index) => (
//               <div key={index} className="scrollable-table-container">
//                   {entry.result && <SEOAuditResultTable rows={createRows(entry.result.competitorData)} />}
//               </div>
//           ))}
//       </div>
//   );
// };

// export default SearchBar;


// testing code 