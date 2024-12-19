import React from "react";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import './SearchBar.css'; // Import the CSS file
import * as XLSX from "xlsx"; // Import the xlsx library

const SEOAuditResultTable = ({ rows, headings }) => {
   // Function to export data to Excel
   const exportToExcel = () => {
    const formattedRows = rows.map((row) => ({
      Attribute: row.label,
      Value: row.value,
      Requirement: row.requirement,
      Valid: row.valid ? "✔️" : "❌",
      Recommendation: row.recommendation,
    }));

    if (headings) {
      formattedRows.push({
        Attribute: "Headings",
        Value: Object.entries(headings)
          .map(([tag, headingsList]) => `${tag.toUpperCase()}: ${headingsList.join(", ")}`)
          .join("; "),
        Requirement: "",
        Valid: "",
        Recommendation: "",
      });
    }

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SEO Audit Results");

    // Trigger download
    XLSX.writeFile(workbook, "SEO_Audit_Results.xlsx");
  };
  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "8px" }}>
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
                    <CheckIcon style={{ color: "green" }} />
                  ) : (
                    <CloseIcon style={{ color: "red" }} />
                  )}
                </TableCell>
                <TableCell>{row.recommendation}</TableCell>
              </TableRow>
            ))}
            {headings && (
              <TableRow>
                <TableCell component="th" scope="row">
                  Headings
                </TableCell>
                <TableCell colSpan={4}>
                  {Object.entries(headings).map(([tag, headingsList]) => (
                    <div key={tag}>
                      <strong>{tag.toUpperCase()}:</strong>
                      <ul>
                        {headingsList.map((heading, index) => (
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
  );
};

export default SEOAuditResultTable;

