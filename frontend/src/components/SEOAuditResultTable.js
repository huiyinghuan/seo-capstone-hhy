
import React, { useState } from "react";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Button from '@mui/material/Button';
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { WandSparkles } from 'lucide-react';
import './SearchBar.css'; // Import the CSS file
import * as XLSX from "xlsx"; // Import the xlsx library
import { BsDashLg } from "react-icons/bs"; // Use this as a "half tick" placeholder

const SEOAuditResultTable = ({ rows, setRows, headings, domain}) => {
  const [expandedRow, setExpandedRow] = useState(null); // State to track expanded row
  const [loadingFixes, setLoadingFixes] = useState({}); // Track loading state
  const [recommendedActions, setRecommendedActions] = useState({});


  // Function to toggle row expansion
  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

   // Function to handle expanding the row when the "Recommended Fixes" button is clicked, although it works the same as the toggleRow function
   // however, i do not want both expansion to appear when the button is clicked, i want each to appear based on its needs. so another function 
   // is created for a clear segregation 
  //  const handleRecommendedFixesClick = (index) => {
  //   toggleRow(index); // Expand the row when button is clicked
  // };

  //test
  // Function to handle fetching recommendations when button is clicked
  const fetchRecommendedFixes = async (index, label) => {
    try {
      setLoadingFixes((prev) => ({ ...prev, [index]: true }));
      const { value, requirement, details} = rows[index]; // Extract value and requirement
      const location = window.location.hostname;
      // const response = await fetch("http://127.0.0.1:8000/api/get_recommended_fixes/"
      // const response = await fetch('http://${location}:8000/api/get_recommended_fixes/', {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },ss
      //   body: JSON.stringify({label, value, requirement, details}) // pass additional data 
      // });

      const response = await fetch(`http://${window.location.hostname}:8000/api/get_recommended_fixes/`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ label, value, requirement, details }) // pass additional data
      });  
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      const recommendation = data.recommendation || "No recommendation available";

      // // Update the row with the recommendation
      // const updatedRows = [...rows];
      // updatedRows[index].recommendation = recommendation;
      // setRows(updatedRows);

      setRecommendedActions((prev) => ({ ...prev, [index]: recommendation })); // Store in new state

      // Set expanded row
      toggleRow(index);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoadingFixes((prev) => ({ ...prev, [index]: false }));
    }
  };
  
    // segreate

  

  //check validation
  // new version
  const getValidationIcon = (valid) => {
    if (valid === true) {
      return <CheckIcon style={{ color: 'green' }} />;
    } else if (valid === false) {
      return <CloseIcon style={{ color: 'red' }} />;
    } else if (valid === 'N/A') {
      return 
    } else {
      return (
        <div style={{ position: 'relative', display: 'inline-block', width: '24px', height: '24px' }}>
          {/* Green tick */}
          <CheckIcon style={{ color: 'green', width: '100%', height: '100%' }} />
          
          {/* Shorter and thicker red cross in the center */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '55%',
              width: '60%',
              height: '2px',
              backgroundColor: 'green',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              borderRadius: '2px',
            }}
          />
        </div>
      );; // Half-tick icon for partially valid
    }
  };

   // Function to export data to Excel
   const exportToExcel = () => {
    const formattedRows = rows.map((row) => ({
      Attribute: row.label,
      Value: row.value,
      Requirement: row.requirement,
      Valid: row.valid ? "✔️" : "❌",
      Details: typeof row.details === "object" 
      ? JSON.stringify(row.details, null, 2)  // Convert object to string for readability
      : row.details || "No details available",
      Recommendation: row.recommendation,
      Score: row.valid ? 1 : 0, //(1 if valid, 0 if not)
    }));

    if (headings) {
      formattedRows.push({
        Attribute: "Headings",
        Value: Object.entries(headings)
          .map(([tag, headingsList]) => `${tag.toUpperCase()}: ${headingsList.join(", ")}`)
          .join("; "),
        Requirement: "",
        Valid: "",
        Details: "",
        Recommendation: "",
        Score: "", // No score for the headings row
      });
    }

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SEO Audit Results");

    // Trigger download
    XLSX.writeFile(workbook, "SEO_Audit_Results.xlsx");
  };

  const getValidationScore = (valid) => {
    if (valid === true) {
      return 1;
    } else if (valid === false) {
      return 0;
    } else {
      return 0.5; // Score of 0.5 for partially valid cases
    }
  };
  
  // Calculate the total score
  //const totalScore = rows.reduce((sum, row) => sum + (row.valid ? 1 : 0), 0);
  const totalScore = rows.reduce((sum, row) => sum + getValidationScore(row.valid), 0);
  
  return (
    
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "8px" }}>
      {/* Domain Header */}
      <div style={{ 
        padding: "12px", 
        backgroundColor: "#eeeeee", 
        color: "#101010", 
        textAlign: "center", 
        fontSize: "18px", 
        fontWeight: "bold" 
      }}>
        SEO Audit Results for: {domain}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px" }}>
        <button onClick={exportToExcel} style={{ padding: "8px 16px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Export to Excel
        </button>
      </div>
      
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: "8px", maxHeight: "440px" }}
      >
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="SEO Audit Results" >
          <TableHead sx={{ backgroundColor: "#f9fafb" }}>
            
            <TableRow>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
                
              </TableCell>
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
              <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
                Actions
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
                Score
              </TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <React.Fragment key={index}>
                <TableRow
                  style={{
                    backgroundColor: row.valid ? "white" : "#ffcccc", // Highlight invalid rows with light red
                  }}
                >
                  <TableCell>
                    <IconButton onClick={() => toggleRow(index)} size="small">
                      {expandedRow === index ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{row.label}</TableCell>
                  <TableCell className="value-cell">{row.value}</TableCell>
                  <TableCell>{row.requirement}</TableCell>
                  {/* <TableCell>
                    {row.valid ? <CheckIcon style={{ color: "green" }} /> : <CloseIcon style={{ color: "red" }} />}
                  </TableCell> */}
                  <TableCell>{getValidationIcon(row.valid)}</TableCell>
                  <TableCell>{row.recommendation}</TableCell>
                  <TableCell >
                    {(row.valid === false || row.valid === null || row.valid === 'partial') && (
                      <Button variant="contained" color="purple" 
                        sx={{ display: 'inline-flex',
                              alignItems: 'center',
                              // padding: '0.5rem 3rem',
                              backgroundColor: '#F3E7FF',  
                              color: '#581C87', 
                              fontSize: '1rem',
                              fontWeight: 'bold',  // To make the font bold
                              textTransform: 'none',  // To uncapitalize the letters
                              whiteSpace: 'nowrap', // Prevents the text from wrapping to the next line
                              gap: '0.5rem', 
                              borderRadius: '10px',  
                              
                              '&:hover': {
                                backgroundColor: '#e9d5ff', 
                            },
                          }} 
                        // onClick={() => alert(`Action for ${row.label}`)}>
                        // Expanding the row when button is clicked
                        // onClick={() => handleRecommendedFixesClick(index)} > 
                        disabled={loadingFixes[index]}
                        onClick={() => fetchRecommendedFixes(index, row.label, row.value)}
                      >
                        <WandSparkles 
                          sx={{ 
                            marginRight: 2, 
                            fontSize: '0.1rem',
                           }}
                        />
                        {/* Recommended Fixes */}
                        {loadingFixes[index] ? "Fetching..." : "Recommended Fixes"}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>{getValidationScore(row.valid)} </TableCell>  {/** {row.valid ? 1 : 0}   for score */}
                </TableRow>
                {/* {expandedRow === index && (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                        <div style={{ padding: "16px", background: "#FaF5FF", borderRadius: "8px", color: "#581C87", fontSize: '1rem',
                              fontWeight: 'bold' }}>
                          <h4 style={{color: "#581C87", fontSize: '1rem', fontWeight: 'bold'}} >Recommendations: {row.label}</h4>
                          <pre>{row.recommendation}</pre>
                        </div>
                      </Collapse>
                    </TableCell>
                  </TableRow> */}
                {/* Expanded Row for Recommendation */}
                {expandedRow === index && (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                        <div style={{ padding: "16px", background: "#FaF5FF", borderRadius: "8px", color: "#581C87", fontSize: "1rem", fontWeight: "bold" }}>
                          <h4 style={{ color: "#581C87" }}>Recommended Actions: {row.label}</h4>
                          <pre>{loadingFixes[index] ? "Fetching recommendation..." : recommendedActions[index] || "No recommendation available"}</pre>
                        </div>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
                {row.label === "Page Speed" && (
                  <TableRow>
                    {/* <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                      <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                        <div style={{ padding: "16px", background: "#f9fafb", borderRadius: "8px" }}>
                          <h4>Core Web Vitals Assessment: {pageSpeedDetails["Core Web Vitals Assessment"]}</h4>
                          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {JSON.stringify(pageSpeedDetails.DetailedOutput, null, 2)}
                          </pre>
                        </div>
                      </Collapse>
                    </TableCell> */}
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                      <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                        <div style={{ padding: "16px", background: "#f9fafb", borderRadius: "8px" }}>
                          <h4>Core Web Vitals Assessment: {row?.value || "No data available"}</h4>
                          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {row.details ? JSON.stringify(row.details, null, 2) : "No details available"}
                          </pre>
                        </div>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
                {row.label === "Structured Data" && (
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                      <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                        <div style={{ padding: "16px", background: "#f9fafb", borderRadius: "8px" }}>
                          <h4>Structured Data: {row?.value || "No structured data available"}</h4>
                          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {row.value ? JSON.stringify(row.value, null, 2) : "No details available"}
                          </pre>
                        </div>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
            <TableRow
              sx={{
                position: "sticky",
                bottom: 0,
                zIndex: 3,
                backgroundColor: "#f9fafb", // Match header background for better visibility
                fontWeight: "bold",
              }}
            >
              <TableCell colSpan={8} align="right" sx={{ fontWeight: "bold" }}>
                Total Score: {totalScore}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>

    
    
  );
};

export default SEOAuditResultTable;

