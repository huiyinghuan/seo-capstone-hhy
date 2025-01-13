import React from "react";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// const SEOCompetitorAnalysisSummaryTable = ({ rows }) => {
//   return (
//     <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "8px" }}>
//       <TableContainer
//         component={Paper}
//         elevation={3}
//         sx={{ borderRadius: "8px", maxHeight: "440px" }}
//       >
//         <Table stickyHeader sx={{ minWidth: 300 }} aria-label="SEO Audit Summary">
//           <TableHead sx={{ backgroundColor: "#f9fafb" }}>
//             <TableRow>
//               <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
//                 Attribute
//               </TableCell>
//               <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
//                 Valid
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.map((row, index) => (
//               <TableRow key={index}>
//                 <TableCell>{row.label}</TableCell>
//                 <TableCell>
//                   {row.valid ? (
//                     <CheckIcon style={{ color: "green" }} />
//                   ) : (
//                     <CloseIcon style={{ color: "red" }} />
//                   )}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Paper>
//   );
// };
 
// v2
// const SEOCompetitorAnalysisSummaryTable = ({ rows }) => {
//     return (
//       <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "8px" }}>
//         <TableContainer
//           component={Paper}
//           elevation={3}
//           sx={{ borderRadius: "8px", maxHeight: "440px" }}
//         >
//           <Table stickyHeader sx={{ minWidth: 300 }} aria-label="SEO Combined Analysis">
//             <TableHead sx={{ backgroundColor: "#f9fafb" }}>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
//                   Attribute
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
//                   Source
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
//                   Valid
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {rows.map((row, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{row.label}</TableCell>
//                   <TableCell>{row.source}</TableCell>
//                   <TableCell>
//                     {row.valid ? (
//                       <CheckIcon style={{ color: "green" }} />
//                     ) : (
//                       <CloseIcon style={{ color: "red" }} />
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//     );
//   };
  
//v3
const SEOCompetitorAnalysisSummaryTable = ({ rows, domain, competitorDomain }) => {
  // Calculate the total scores
  const totalDomainScore = rows.reduce((sum, row) => sum + (row.domainValid ? 1 : 0), 0);
  const totalCompetitorScore = rows.reduce((sum, row) => sum + (row.competitorValid ? 1 : 0), 0);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "8px" }}>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: "8px", maxHeight: "440px" }}
      >
        <Table stickyHeader sx={{ minWidth: 300 }} aria-label="SEO Audit Summary">
          <TableHead sx={{ backgroundColor: "#f9fafb" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
                Attribute
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
                {domain} Domain
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
                {domain} Score
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
                {competitorDomain} Competitor 1
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
                {competitorDomain} Score
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}
                sx={{
                  backgroundColor:
                    !row.domainValid || !row.competitorValid ? "#ffcccc" : "white", // Highlight invalid rows in red
                }}
              >
                <TableCell>{row.label} </TableCell>
                <TableCell>
                  {row.domainValid ? (
                    <CheckIcon style={{ color: "green" }} />
                  ) : (
                    <CloseIcon style={{ color: "red" }} />
                  )}
                </TableCell>
                <TableCell>{row.domainValid ? 1 : 0}</TableCell>
                <TableCell>
                  {row.competitorValid ? (
                    <CheckIcon style={{ color: "green" }} />
                  ) : (
                    <CloseIcon style={{ color: "red" }} />
                  )}
                </TableCell>
                <TableCell>{row.competitorValid ? 1 : 0}</TableCell>  
              </TableRow>
            ))}
            {/* Summary Row for Total Scores */}
            <TableRow
              
              sx={{
                position: "sticky",
                bottom: 0,
                zIndex: 3,
                backgroundColor: "#f9fafb", // Match header background for better visibility
                fontWeight: "bold",
              }}
            >
              <TableCell sx={{ fontWeight: "bold" }}>Total Score</TableCell>
              <TableCell />
              <TableCell sx={{ fontWeight: "bold" }}>{totalDomainScore}</TableCell>
              <TableCell />
              <TableCell sx={{ fontWeight: "bold" }}>{totalCompetitorScore}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

  
export default SEOCompetitorAnalysisSummaryTable;
