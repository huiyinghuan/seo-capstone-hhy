
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
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import './SearchBar.css'; // Import the CSS file
import * as XLSX from "xlsx"; // Import the xlsx library
import { BsDashLg } from "react-icons/bs"; // Use this as a "half tick" placeholder

const SEOAuditResultTable = ({ rows, headings, domain}) => {
  const [expandedRow, setExpandedRow] = useState(null); // State to track expanded row

  // Function to toggle row expansion
  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

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

  // older version 
  // const getValidationIcon = (valid) => {
  //   if (valid === true) {
  //     return <CheckIcon style={{ color: 'green' }} />;
  //   } else if (valid === false) {
  //     return <CloseIcon style={{ color: 'red' }} />;
  //   } else {
  //     return <BsDashLg style={{ color: 'orange' }} />; // Half-tick icon for partially valid
  //   }
  // };

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

  // Calculate the total score
  const totalScore = rows.reduce((sum, row) => sum + (row.valid ? 1 : 0), 0);

  
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
                  <TableCell>{row.valid ? 1 : 0}</TableCell>  {/** for score */}
                </TableRow>
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
              <TableCell colSpan={7} align="right" sx={{ fontWeight: "bold" }}>
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

