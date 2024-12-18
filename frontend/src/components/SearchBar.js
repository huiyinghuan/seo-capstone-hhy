  // import React from 'react';
  // import './SearchBar.css';

  // const SearchBar = ({ placeholder, onSearch }) => {
  //   return (
  //     <div className="search-bar-container">
  //       <input
  //         type="text"
  //         placeholder={placeholder || "Enter website URL..."}
  //         className="search-bar"
  //       />
  //       <button onClick={onSearch} className="search-button">
  //         Search
  //       </button> 
  //     </div>
  //   );
  // };

  // export default SearchBar;

  import React, { useState } from 'react';
  import { Search } from 'lucide-react';
  import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material'; 
  import './SearchBar.css'; // Import the CSS file
  import SEOAuditResultTable from "./SEOAuditResultTable";
  
  import { CheckCircle, XCircle } from "lucide-react";
  

  //for table 
  import Table from '@mui/material/Table';
  import TableBody from '@mui/material/TableBody';
  import TableCell from '@mui/material/TableCell';
  import TableContainer from '@mui/material/TableContainer';
  import TableHead from '@mui/material/TableHead';
  import TableRow from '@mui/material/TableRow';
  import Paper from '@mui/material/Paper';

  const SearchBar = ({ onSearch }) => {
    const [domain, setDomain] = useState('');
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      onSearch(domain);
    
    try {
        const response = await fetch(`http://localhost:8000/seo-audit/?url=${encodeURIComponent(domain)}`);
        
        // Log the raw response object for debugging
        console.log('Raw Response:', response);

        const data = await response.json();

        // Debug: log the parsed JSON data
        console.log('Parsed Response Data:', data);

        if (data.error) {
          alert(data.error);
        } else {
          setResult(data);
        }
      } catch (error) {
        console.error('Error fetching SEO data:', error);
        
      }
    };

    const validateLength = (value, min, max) => {
      return value.length >= min && value.length <= max;
    };

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
            requirement: 'Responsive & works well on mobile devices',
            valid: result.mobile_friendly === 'Yes', 
            recommendation: 'Ensure the site is responsive and mobile-friendly'
          },
          { label: 'Page Speed', 
            value: result.page_speed || 'Unknown', 
            requirement: 'Aim for faster loading times to improve user experience',
            valid: result.page_speed === 'Good', 
            recommendation: 'Improve page speed for better user experience'
          },

        ]
      : [];

    return (
      <div className="container">
        <form onSubmit={handleSubmit} className="search-bar-form">
          <div className="search-bar-container">
          <br></br>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter your website domain.com"
              className="search-bar-input"
            />
            <button type="submit" className="search-bar-button">
              <Search className="search-bar-icon" />
            </button>
          </div>
        </form>


        {/* <div className="scrollable-table-container">
          {result && (
            <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "8px" }}>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: "8px", maxHeight: "440px" }}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="SEO Audit Results">
          <TableHead sx={{ backgroundColor: "#f9fafb" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
                Attribute
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
                Value
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
                Requirement
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
                Valid
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
                Recommendation
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.label}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>{row.requirement}</TableCell>
                <TableCell>
                {row.valid ? (
                  <CheckIcon style={{ color: 'green' }} />
                ) : (
                  <CloseIcon style={{ color: 'red' }} />
                )}
                </TableCell>
                <TableCell>{row.recommendation}</TableCell>
              </TableRow>
            ))}
            {result.headings && (
              <TableRow>
                <TableCell component="th" scope="row">Headings</TableCell>
                <TableCell colSpan={4}>
                  {Object.entries(result.headings).map(([tag, headings]) => (
                    <div key={tag}>
                      <strong>{tag.toUpperCase()}:</strong>
                      <ul>
                        {headings.map((heading, index) => (
                          <li key={index}>{heading}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
          </Paper>
          )}
        </div> */}

      <div className="scrollable-table-container">
        {result && <SEOAuditResultTable rows={rows} headings={result.headings} />}
      </div>
      </div>
    );
  };

  export default SearchBar;

