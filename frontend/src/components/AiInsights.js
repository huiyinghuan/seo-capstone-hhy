// import React from "react";
// import { Box, Card, Typography, Button } from "@mui/material";
// import { Brain } from "lucide-react";

// const AiInsights = ({ onConnect }) => {
//   return (
//     <Box mt={4}>
//         <Card>
//         <Box padding={2}>
//             <Box display="flex" alignItems="center">
//             <Brain style={{ fontSize: 24 }} />
//             <Typography variant="h6" fontWeight="bold" style={{ marginLeft: "10px" }}>
//                 AI Content Analysis
//             </Typography>
//             </Box>
//             <Typography color="textSecondary" paragraph style={{ marginTop: "10px" }}>
//             Connect OpenAI to get AI-powered insights about your content and SEO opportunities.
//             </Typography>
//             <Button variant="contained" color="primary">
//             Connect OpenAI
//             </Button>
//         </Box>
//         </Card>
//     </Box>
//   );
// };

// export default AiInsights;

import React, { useState } from 'react';
import { Box, Card, Typography, Button } from "@mui/material";
import { BrainCog, Loader2, Bot, Target } from 'lucide-react';
import {  FileText, AlertTriangle, CheckCircle, Lightbulb, Gauge } from 'lucide-react';

const AiInsights = ({ onConnect }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate an API call
    setTimeout(() => {
      setAnalysisResult({
        readabilityScore: 85,
        seoScore: 90,
        keywordDensity: [
          { word: "content", count: 12 },
          { word: "analysis", count: 8 },
          { word: "optimization", count: 6 },
        ],
        suggestions: [
          "Consider adding more descriptive meta descriptions",
          "Improve header hierarchy",
          "Add more internal links",
        ],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <Box mt={4}>
      <Card>
        <Box padding={2}>
          <Box display="flex" alignItems="center">
            <BrainCog className="h-6 w-6 text-blue-600" />
            <Typography variant="h6" fontWeight="bold" style={{ marginLeft: "10px" }}>
              AI Content Analysis
            </Typography>
          </Box>
          <Typography color="text.secondary" mt={1}>
            AI-powered insights about your content and SEO opportunities.
          </Typography>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            variant="contained"
            color="primary"
            startIcon={isAnalyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Bot className="h-5 w-5" />}
            sx={{ mt: 2 }}
          >
            {isAnalyzing ? "Analyzing..." : "Connect to OpenAI"}
          </Button>
        </Box>
      </Card>

      {isAnalyzing && (
        <Box mt={2} display="flex" alignItems="center" justifyContent="center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <Typography ml={2}>Analyzing your content...</Typography>
        </Box>
      )}

      {analysisResult && !isAnalyzing && (
        <Box mt={4}>
          <Card>
            <Box padding={2}>
            <Box display="flex" alignItems="center">
                <Gauge className="h-5 w-5 text-blue-600" />  
                <Typography variant="h6" fontWeight="bold" style={{ marginLeft: "10px" }}>
                Content Scores
                </Typography>
            </Box>    
              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Readability</span>
                    <span className="text-sm font-medium text-gray-900">{analysisResult.readabilityScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-600 rounded-full"
                      style={{ width: `${analysisResult.readabilityScore}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">SEO Score</span>
                    <span className="text-sm font-medium text-gray-900">{analysisResult.seoScore}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${analysisResult.seoScore}%` }} />
                  </div>
                </div>
              </div>
            </Box>
            </Card>
            <br></br>
            <Card>
                <Box padding={2}>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <Box display="flex" alignItems="center">
                            <Target className="h-5 w-5 text-blue-600" /> 
                            <Typography variant="h6" fontWeight="bold" style={{ marginLeft: "10px" }}>
                            Keyword Density
                            </Typography>
                        </Box>    
                    
                    <div className="mt-4 space-y-3">
                        <ul>
                        {analysisResult.keywordDensity?.map((keyword, index) => (
                            <li key={index} className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{keyword.word}</span>
                            <span className="text-sm font-medium text-gray-900">{keyword.count} occurrences</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                    </div>
                </Box>
            </Card>
            <br></br>            
            <Card>
                <Box padding={2}>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <Box display="flex" alignItems="center">
                            <Lightbulb className="h-5 w-5 text-blue-600" />
                            <Typography variant="h6" fontWeight="bold" style={{ marginLeft: "10px" }}>
                            Improvement Suggestions
                            </Typography>
                        </Box>    

                        <div className="mt-4 space-y-3">
                            <ul>
                            {analysisResult.suggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700">{suggestion}</span>
                                </li>
                            ))}
                            </ul>
                        </div>
                    
                    </div>
                </Box>
            </Card>
        </Box>
      )}
    </Box>
  );
};


export default AiInsights;
