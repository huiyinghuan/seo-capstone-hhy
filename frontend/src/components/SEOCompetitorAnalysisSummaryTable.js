import React from "react";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography, TableFooter } from '@mui/material';
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
// const SEOCompetitorAnalysisSummaryTable = ({ rows, domain, competitorDomain }) => {
//   // Calculate the total scores
//   const totalDomainScore = rows.reduce((sum, row) => sum + (row.domainValid ? 1 : 0), 0);
//   const totalCompetitorScore = rows.reduce((sum, row) => sum + (row.competitorValid ? 1 : 0), 0);

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
//                 {domain} Domain
//               </TableCell>
//               <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
//                 {domain} Score
//               </TableCell>
//               <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
//                 {competitorDomain} Competitor 1
//               </TableCell>
//               <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>
//                 {competitorDomain} Score
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.map((row, index) => (
//               <TableRow key={index}
//                 sx={{
//                   backgroundColor:
//                     !row.domainValid || !row.competitorValid ? "#ffcccc" : "white", // Highlight invalid rows in red
//                 }}
//               >
//                 <TableCell>{row.label} </TableCell>
//                 <TableCell>
//                   {row.domainValid ? (
//                     <CheckIcon style={{ color: "green" }} />
//                   ) : (
//                     <CloseIcon style={{ color: "red" }} />
//                   )}
//                 </TableCell>
//                 <TableCell>{row.domainValid ? 1 : 0}</TableCell>
//                 <TableCell>
//                   {row.competitorValid ? (
//                     <CheckIcon style={{ color: "green" }} />
//                   ) : (
//                     <CloseIcon style={{ color: "red" }} />
//                   )}
//                 </TableCell>
//                 <TableCell>{row.competitorValid ? 1 : 0}</TableCell>  
//               </TableRow>
//             ))}
//             {/* Summary Row for Total Scores */}
//             <TableRow
              
//               sx={{
//                 position: "sticky",
//                 bottom: 0,
//                 zIndex: 3,
//                 backgroundColor: "#f9fafb", // Match header background for better visibility
//                 fontWeight: "bold",
//               }}
//             >
//               <TableCell sx={{ fontWeight: "bold" }}>Total Score</TableCell>
//               <TableCell />
//               <TableCell sx={{ fontWeight: "bold" }}>{totalDomainScore}</TableCell>
//               <TableCell />
//               <TableCell sx={{ fontWeight: "bold" }}>{totalCompetitorScore}</TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Paper>
//   );
// };

  
// export default SEOCompetitorAnalysisSummaryTable;




// v4
// const SEOCompetitorAnalysisSummaryTable = ({ data }) => {
//   // Extract unique metrics (row labels) from the scores
//   const metrics = data.length > 0 ? data[0].scores.map((score) => score.label) : [];

//   // Function to calculate the total score for a domain
//   const calculateTotalScore = (domainScores) => {
//     return domainScores.reduce((total, score) => total + (score.valid ? 1 : 0), 0);
//   };

//   return (
//     <div className="competitor-table-container">
//       <table className="competitor-table">
//         <thead>
//           <tr>
//             <th>Metric</th>
//             {data.map((entry, index) => (
//               <>
//                 <th key={`domain-${index}`}>{entry.domain}</th>
//                 <th key={`score-${index}`}>Score</th>
//               </>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {metrics.map((metric, metricIndex) => (
//             <tr key={metricIndex}>
//               <td>{metric}</td>
//               {data.map((entry, domainIndex) => {
//                 const score = entry.scores.find((s) => s.label === metric);
//                 return (
//                   <>
//                     <td key={`metric-${domainIndex}`} className={score.valid ? "valid" : "invalid"}>
//                       {score.valid ? "✔️" : "❌"}
//                     </td>
//                     <td key={`score-${domainIndex}`}>
//                       {/* Calculate and display the score for this domain */}
//                       {score.valid ? 1 : 0}
//                     </td>
//                   </>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//         <tfoot>
//           <tr>
//             <td><strong>Total</strong></td>
//             {data.map((entry, index) => {
//               const totalScore = calculateTotalScore(entry.scores);
//               return (
//                 <>
//                   <td></td>
//                   <td key={`total-score-${index}`}><strong>{totalScore}</strong></td> 
//                   {/* Total score directly under the Score column */}
//                 </>
//               );
//             })}
//           </tr>
//         </tfoot>
//       </table>
//     </div>
//   );
// };

// export default SEOCompetitorAnalysisSummaryTable;

const SEOCompetitorAnalysisSummaryTable = ({ data }) => {
  // Extract unique metrics (row labels) from the scores
  const metrics = data.length > 0 ? data[0].scores.map((score) => score.label) : [];

  // Function to calculate the total score for a domain
  const calculateTotalScore = (domainScores) => {
    return domainScores.reduce((total, score) => total + (score.valid ? 1 : 0), 0);
  };

  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '8px', maxHeight: '440px' }}>
      <Table stickyHeader sx={{ minWidth: 300 }} aria-label="SEO Competitor Analysis Summary">
        <TableHead sx={{ backgroundColor: "#f9fafb" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>Metric</TableCell>
            {data.map((entry, index) => (
              <>
                <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280",  textAlign: "center"}} key={`domain-${index}`}>
                  {entry.domain}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280",  textAlign: "center"}} key={`score-${index}`}>
                  Score
                </TableCell>
              </>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {metrics.map((metric, metricIndex) => (
            <TableRow key={metricIndex}>
              <TableCell sx={{ textAlign: "center" }} >{metric}</TableCell>
              {data.map((entry, domainIndex) => { 
                const score = entry.scores.find((s) => s.label === metric);
                return (
                  <>
                    <TableCell 
                      key={`metric-${domainIndex}`} c
                      lassName={score.valid ? "valid" : "invalid"}
                      sx={{ textAlign: "center" }}
                    >
                      {score.valid ? (
                        <CheckIcon sx={{ color: "green" }} />
                      ) : (
                        <CloseIcon sx={{ color: "red" }} />
                      )}
                    </TableCell>
                    <TableCell key={`score-${domainIndex}`} sx={{ textAlign: "center" }}>
                      {/* Calculate and display the score for this domain */}
                      {score.valid ? 1 : 0}
                    </TableCell>
                  </>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter sx={{ 
          backgroundColor: "#f9fafb", // Match header background for better visibility
          fontWeight: "bold",
          position: "sticky",
          bottom: 0,
          zIndex: 3, // Ensures it's above the rest of the table rows
          }}
        >
          <TableRow>
            <TableCell>
              <Typography sx={{ fontWeight: "bold", textAlign:'center' }}>Total</Typography>
            </TableCell>
            {data.map((entry, index) => {
              const totalScore = calculateTotalScore(entry.scores);
              return (
                <>
                  <TableCell />
                  <TableCell key={`total-score-${index}`} sx={{ fontWeight: "bold", textAlign: 'center' }}>
                    {totalScore}
                  </TableCell>
                </>
              );
            })}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default SEOCompetitorAnalysisSummaryTable;