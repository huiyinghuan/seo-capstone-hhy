
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material'; 
import './SearchBar.css'; // Import the CSS file
import SEOAuditResultTable from "./SEOAuditResultTable";
import { FaPlusCircle } from "react-icons/fa";
import Button from '@mui/material/Button';
import SEOCompetitorAnalysisSummaryTable from './SEOCompetitorAnalysisSummaryTable';


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

  //new one
  const SearchBar = ({ onSearch }) => {
    const [domain, setDomain] = useState('');
    const [result, setResult] = useState(null);
    const [competitorDomain, setCompetitorDomain] = useState('');
    const [competitorResult, setCompetitorResult] = useState(null);
  
    const handleCombinedSubmit = async (e) => {
      if (!domain || !competitorDomain) {
        e.preventDefault();
        alert("Please enter both domains before submitting.");
        return;
      }
      // section that handles 1 search button with searching of 2 domains
  
      try {
        // Fetch user domain SEO data
        const domainResponse = await fetch(`http://localhost:8000/seo-audit/?url=${encodeURIComponent(domain)}`);
        if (!domainResponse.ok) throw new Error(`Error for domain: ${domainResponse.statusText}`);
        const domainData = await domainResponse.json();
  
        if (domainData.error) {
          alert(`Error fetching data for domain: ${domainData.error}`);
        } else {
          setResult({
            ...domainData,
            mobile_friendly: domainData.mobile_friendly,
            page_speed: domainData.page_speed,
          });
        }
  
        // Fetch competitor domain SEO data
        const competitorResponse = await fetch(`http://localhost:8000/seo-audit/?url=${encodeURIComponent(competitorDomain)}`);
        if (!competitorResponse.ok) throw new Error(`Error for competitor domain: ${competitorResponse.statusText}`);
        const competitorData = await competitorResponse.json();
  
        if (competitorData.error) {
          alert(`Error fetching data for competitor domain: ${competitorData.error}`);
        } else {
          setCompetitorResult({
            ...competitorData,
            mobile_friendly: competitorData.mobile_friendly,
            page_speed: competitorData.page_speed,
          });
        }
      } catch (error) {
        console.error('Error fetching SEO data:', error);
        alert('Failed to fetch SEO data. Please try again later.');
      }
    };
    
    // validating the length of meta description and title text 
    const validateLength = (value, min, max) => value.length >= min && value.length <= max;
  
    const rows = result
        ? [
            { label: 'HTML Type', 
              value: result.html_type, 
              requirement:'NIL',
              valid: 'N/A', 
              recommendation: 'N/A',
            },
            { label: 'Title', 
              value: result.title || 'No title', 
              requirement:'50 - 60 Characters',
              valid: validateLength(result.title || '', 50, 60), 
              recommendation: 'Ensure the title is between 50 - 60 characters'
            },
            { label: 'Meta Description', 
              value: result.meta_description || 'No meta description', 
              requirement: '150 - 160 Characters',
              valid: validateLength(result.meta_description || '', 150, 160), 
              recommendation: 'Ensure the meta descrption is between 150 - 160 characters'
            },
            { label: 'Canonical', 
              value: result.canonical || 'No canonical tag', 
              requirement: 'Point to preferred version of page to avoid duplicate content issues',
              valid: result.canonical !== 'No canonical tag', 
              recommendation: 'Add a canonical tag to prevent duplicate content issues'
            },
            { label: 'Robots Meta Tag', 
              value: result.robots || 'No robots meta tag', 
              requirement: 'Use no noindex to prevent page from being indexed & nofollow to prevent links from being followed',
              valid: result.robots !== 'No robots meta tag', 
              recommendation: 'Ensure robots meta tag is properly set'
            },
            { label: 'Sitemap Status', 
              value: result.sitemap_status || 'No sitemap', 
              requirement: 'Submmited to Search Engine',
              valid: result.sitemap_status !== 'No sitemap', 
              recommendation: 'Submit a sitemap to search engines for better crawling'
  
            },
            { label: 'Mobile Friendly', 
              value: result.mobile_friendly || 'Unknown', 
              requirement: 'Responsive & works well on mobile',
              valid: result.mobile_friendly === 'Mobile-friendly',
              recommendation: 'Ensure the site is responsive and mobile-friendly'
            },
            { label: 'Page Speed', 
              value: result.page_speed || 'Unknown', 
              requirement: 'Aim for faster loading times to improve user experience',
              valid: result.page_speed === 'Pass', 
              recommendation: 'Improve page speed for better user experience'
            },
  
          ]
        : [];
  
        const competitorRows = competitorResult
        ? [
            { label: 'HTML Type', value: competitorResult.html_type || 'Unknown', requirement: 'N/A', valid: 'N/A', recommendation: 'N/A' },
            { label: 'Title', value: competitorResult.title || 'No title', requirement: '50 - 60 Characters', valid: validateLength(competitorResult.title || '', 50, 60), recommendation: 'Ensure the title is between 50 - 60 characters' },
            { label: 'Meta Description', value: competitorResult.meta_description || 'No meta description', requirement: '150 - 160 Characters', valid: validateLength(competitorResult.meta_description || '', 150, 160), recommendation: 'Ensure the meta description is between 150 - 160 characters' },
            { label: 'Canonical', value: competitorResult.canonical || 'No canonical tag', requirement: 'Point to preferred version of page to avoid duplicate content issues', valid: competitorResult.canonical !== 'No canonical tag', recommendation: 'Add a canonical tag to prevent duplicate content issues' },
            { label: 'Robots Meta Tag', value: competitorResult.robots || 'No robots meta tag', requirement: 'Use noindex to prevent page from being indexed & nofollow to prevent links from being followed', valid: competitorResult.robots !== 'No robots meta tag', recommendation: 'Ensure robots meta tag is properly set' },
            { label: 'Sitemap Status', value: competitorResult.sitemap_status || 'No sitemap', requirement: 'Submitted to Search Engine', valid: competitorResult.sitemap_status !== 'No sitemap', recommendation: 'Submit a sitemap to search engines for better crawling' },
            { label: 'Mobile Friendly', value: competitorResult.mobile_friendly || 'Unknown', requirement: 'Responsive & works well on mobile devices', valid: competitorResult.mobile_friendly === 'Yes', recommendation: 'Ensure the site is responsive and mobile-friendly' },
            { label: 'Page Speed', value: competitorResult.page_speed || 'Unknown', requirement: 'Aim for faster loading times to improve user experience', valid: competitorResult.page_speed === 'Pass', recommendation: 'Improve page speed for better user experience' },
          ]
        : [];

        // const combinedRows = [...rows, ...competitorRows].map((row, index) => ({
        //   ...row,
        //   source: index < rows.length ? "Domain" : "Competitor",
        // }));

        const combinedRows = result && competitorResult
        ? [
            { label: 'HTML Type', 
              domainValid: 'N/A', 
              competitorValid: 'N/A'
            },
            { label: 'Title', 
              domainValid: validateLength(result.title || '', 50, 60), 
              competitorValid: validateLength(competitorResult.title || '', 50, 60)
            },
            { label: 'Meta Description', 
              domainValid: validateLength(result.meta_description || '', 150, 160), 
              competitorValid: validateLength(competitorResult.meta_description || '', 150, 160)
            },
            { label: 'Canonical', 
              domainValid: result.canonical !== 'No canonical tag', 
              competitorValid: competitorResult.canonical !== 'No canonical tag'
            },
            { label: 'Robots Meta Tag', 
              domainValid: result.robots !== 'No robots meta tag', 
              competitorValid: competitorResult.robots !== 'No robots meta tag'
            },
            { label: 'Sitemap Status', 
              domainValid: result.sitemap_status !== 'No sitemap', 
              competitorValid: competitorResult.sitemap_status !== 'No sitemap'
            },
            { label: 'Mobile Friendly', 
              domainValid: result.mobile_friendly === 'Mobile-friendly', 
              competitorValid: competitorResult.mobile_friendly === 'Yes'
            },
            { label: 'Page Speed', 
              domainValid: result.page_speed === 'Pass', 
              competitorValid: competitorResult.page_speed === 'Pass'
            }
          ]
        : [];

  
    return (
      <div className="container">
        <div className="search-bar-form">
          <div className="search-bar-container">
            <div className="search-bar-wrapper">
              <label
                  htmlFor="search-input"
                  className={`search-bar-label ${
                    domain ? "active" : ""
                  }`}
                >
                  {/* Enter your website domain.com */}
              </label>
              <br></br>
              <input
                id="search-input"
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder=" "
                className="search-bar-input"
              />
              <label htmlFor="search-input" className="search-bar-label">
                 Enter your website domain.com
              </label>
            </div>
          </div>
          <div className="search-bar-container">
            <div className="search-bar-wrapper">
              <label
                  htmlFor="search-input"
                  className={`search-bar-label ${
                    competitorDomain ? "active" : ""
                  }`}
                >
                  {/* Enter your website domain.com */}
                </label>
              <br></br>
              <input
                id="search-input"
                type="text"
                value={competitorDomain}
                onChange={(e) => setCompetitorDomain(e.target.value)}
                placeholder=" "
                className="search-bar-input"
              />
              <label htmlFor="search-input" className="search-bar-label">
                Enter competitor website domain.com
              </label>
            </div>
          </div>  
            <Button variant="contained" onClick={handleCombinedSubmit}>
              Search
            </Button>
          
        </div>
        <div className="scrollable-table-container">
          {result && <SEOCompetitorAnalysisSummaryTable rows={combinedRows} headings={result.headings} />}
        </div>
        <br></br>
        <div className="scrollable-table-container">
          {result && <SEOAuditResultTable rows={rows} headings={result.headings} />}
        </div>
        <br></br>
        <div className="scrollable-table-container">
          {competitorResult && <SEOAuditResultTable rows={competitorRows} headings={competitorResult.headings} />}
        </div>
      </div>
    );
  };
  
   export default SearchBar;
  

