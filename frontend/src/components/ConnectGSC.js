// src/components/GoogleOAuthRedirect.js
// import React from "react";
// import "../layout/NavBar.css";
// import { Button } from "@mui/material";

// const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
// const REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
// const SCOPE = "https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/webmasters.readonly";

// const GoogleOAuthRedirect = () => {
//   const handleRedirect = () => {
//     const authURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(
//       SCOPE
//     )}&access_type=offline`;
//     window.location.href = authURL; // Redirect to Google's OAuth consent page
//   };

//   return (
//     <Button className="connect-button" onClick={handleRedirect}>
//       Connect with GSC
//     </Button>
//   );
// };

// export default GoogleOAuthRedirect;


import React, { useState } from "react";
import { Button } from "@mui/material";

const ConnectGSC = () => {
  const [gscData, setGscData] = useState(null);

  const handleRedirect = () => {
    console.log("Redirecting to Google OAuth...");  // Log when the redirect is triggered

    const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
    const SCOPE = "https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/webmasters.readonly";
    
    const authURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(SCOPE)}&access_type=offline`;
    window.location.href = authURL;
  };

  const handleFetchData = async () => {
    console.log("Attempting to fetch GSC data...");  // Log when data fetching is triggered
    
    try {
      const response = await fetch('/fetch_gsc_data/?code=<authorization_code_from_google>'); // Replace with actual code from the URL
      console.log("Received response from backend:", response);  // Log the response from the backend
      
      if (!response.ok) {
        console.error("Failed to fetch GSC data:", response.statusText);  // Log if there's an error
        return;
      }

      const data = await response.json();
      console.log("Data fetched from GSC:", data);  // Log the data received from the backend

      setGscData(data);
    } catch (error) {
      console.error("Error fetching GSC data:", error);  // Log any error during the fetch process
    }
  };

  return (
    <div>
      <Button onClick={handleRedirect}>Connect with GSC</Button>
      <Button onClick={handleFetchData}>Pull GSC Data</Button>
      
      {gscData && (
        <div>
          <pre>{JSON.stringify(gscData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};


export default ConnectGSC;
