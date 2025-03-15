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

// working v2
const SEOCompetitorAnalysisSummaryTable = ({ data }) => {
  // Extract unique metrics (row labels) from the scores
  const metrics = data.length > 0 ? data[0].scores.map((score) => score.label) : [];

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

  const getValidationScore = (valid) => {
    if (valid === true) {
      return 1;
    } else if (valid === false) {
      return 0;
    } else {
      return 0.5; // Score of 0.5 for partially valid cases
    }
  };
  

  // Function to calculate the total score for a domain
  // const calculateTotalScore = (domainScores) => {
  //   return domainScores.reduce((total, score) => total + (score.valid ? 1 : 0), 0);
  // };
  const calculateTotalScore = (domainScores) => {
    return domainScores.reduce((total, score) => total + getValidationScore(score.valid), 0);
  };

  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '8px', maxHeight: '440px' }}>
      <Table stickyHeader sx={{ minWidth: 300 }} aria-label="SEO Competitor Analysis Summary">
        <TableHead sx={{ backgroundColor: "#f9fafb" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280" }}>Metric</TableCell>
            {data.map((entry, index) => (
              <>
                <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280", textAlign: "center" }} key={`domain-${entry.domain}`}>
                  {entry.domain}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#6b7280", textAlign: "center" }} key={`score-${entry.domain}`}>
                  Score
                </TableCell>
              </>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {metrics.map((metric, metricIndex) => (
            <TableRow key={`metric-row-${metricIndex}`}>
              <TableCell sx={{ textAlign: "center" }}>{metric}</TableCell>
              {data.map((entry, domainIndex) => {
                const score = entry.scores.find((s) => s.label === metric);
                return (
                  <>
                    <TableCell
                      key={`metric-${metricIndex}-domain-${domainIndex}`}
                      className={score.valid ? "valid" : "invalid"}
                      sx={{ textAlign: "center" }}
                    >
                      {/* {score.valid ? (
                        <CheckIcon sx={{ color: "green" }} />
                      ) : (
                        <CloseIcon sx={{ color: "red" }} />
                      )} */}
                      {getValidationIcon(score.valid)}
                    </TableCell>
                    <TableCell key={`score-${metricIndex}-domain-${domainIndex}`} sx={{ textAlign: "center" }}>
                      {/* {score.valid ? 1 : 0} */}
                      {getValidationScore(score.valid)}
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
        }}>
          <TableRow>
            <TableCell>
              <Typography sx={{ fontWeight: "bold", textAlign: 'center' }}>Total</Typography>
            </TableCell>
            {data.map((entry, index) => {
              const totalScore = calculateTotalScore(entry.scores);
              return (
                <>
                  <TableCell key={`total-score-${entry.domain}`} />
                  <TableCell key={`total-score-value-${entry.domain}`} sx={{ fontWeight: "bold", textAlign: 'center' }}>
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
