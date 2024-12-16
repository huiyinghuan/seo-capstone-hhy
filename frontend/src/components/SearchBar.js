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

  //for table 
  import Table from '@mui/material/Table';
  import TableBody from '@mui/material/TableBody';
  import TableCell from '@mui/material/TableCell';
  import TableContainer from '@mui/material/TableContainer';
  import TableHead from '@mui/material/TableHead';
  import TableRow from '@mui/material/TableRow';
  import Paper from '@mui/material/Paper';

  import Box from '@mui/material/Box';
  import TextField from '@mui/material/TextField';

  import InputBase from '@mui/material/InputBase';
  import Divider from '@mui/material/Divider';
  import IconButton from '@mui/material/IconButton';
  import MenuIcon from '@mui/icons-material/Menu';
  import SearchIcon from '@mui/icons-material/Search';
  import DirectionsIcon from '@mui/icons-material/Directions';

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
            recommendation: 'Ensure the title is between 50-60 characters'
          },
          { label: 'Meta Description', 
            value: result.meta_description || 'No meta description', 
            requirement: '150 - 160 Characters'
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
          <Paper
            component="form"
            sx={{
              p: '0px', 
              display: 'flex', 
              alignItems: 'center', 
              width: '100%',
              maxWidth: '100%', 
              borderRadius: '34px', // Fully rounded corners
              border: '1px solid #d1d5db', /* border-gray-300 */
              outline: 'none',
              transition: 'all 0.2s',
              padding: '0.5rem 3rem 0.5rem 1.25rem',
              overflow: 'hidden', // Ensures no overflow from children
              '&:focus-within': {
                
                color: '#d1d5db', /* focus:ring-blue-500 */
                bordeColor: '#3b82f6',
              },
              
            }}
          >
            <InputBase 
              sx={{
                flex: 1,
                px: 2, // Adjust padding inside the input
                py: 1.5, // Vertical padding for height
                fontSize: '1rem', // Adjust font size
              }}
              placeholder="Search "
              inputProps={{ 'aria-label': 'Enter your website domain.com ' }}
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              // className="search-bar-input"
            />
            <IconButton type="button" 
              sx={{ 
                p: 0, // Remove padding from the button
                width: 50, // Circle size
                height: 50, // Circle size
                backgroundColor: '#3b82f6', // Blue background
                color: 'white',
                borderRadius: '50%', // Circular button
                '&:hover': {
                  backgroundColor: '#2563eb', // Darker blue on hover
                },
              }} 
              aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
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

        <div className="scrollable-table-container">
          {result && (
              <TableContainer component={Paper} className="results-table" 
              style={{ 
                marginTop: '20px',
                maxHeight: '400px', // Restrict the height
                overflowY: 'auto', // Ensure scrolling only within the container
                }}>
                <Table stickyHeader sx={{ minWidth: 650 }} aria-label="SEO Audit Results">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Attribute</strong></TableCell>
                      <TableCell><strong>Value</strong></TableCell>
                      <TableCell><strong>Requirement</strong></TableCell>
                      <TableCell><strong>Valid</strong></TableCell>
                      <TableCell><strong>Recommendation</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {row.label}
                        </TableCell>
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
                        <TableCell>
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
                    {/* {result.structured_data && (
                      <TableRow>
                        <TableCell component="th" scope="row">Structured Data</TableCell>
                        <TableCell>
                          <pre>{JSON.stringify(result.structured_data, null, 2)}</pre>
                        </TableCell>
                      </TableRow>
                    )} */}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>
    );
  };

  export default SearchBar;

