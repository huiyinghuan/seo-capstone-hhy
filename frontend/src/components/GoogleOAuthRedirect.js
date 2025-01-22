// // src/components/GoogleOAuthRedirect.js
// import React from "react";
// import "../layout/NavBar.css"
// import {  Button } from "@mui/material";

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

import React from "react";
import "../layout/NavBar.css";
import { Button } from "@mui/material";

const GoogleOAuthRedirect = () => {
  // const [sites, setSites] = useState([]);
  // const [error, setError] = useState('');

  const handleRedirect = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth-url/"); // Update the URL as needed
      const data = await response.json();
      if (data.auth_url) {
        window.location.href = data.auth_url; // Redirect to Google's OAuth consent page
      } else {
        console.error("Failed to fetch auth URL");
      }
    } catch (error) {
      console.error("Error during auth URL fetch:", error);
    }
  };

  

  return (
    <Button className="connect-button" onClick={handleRedirect}>
      Connect with GSC
    </Button>
  );
};

export default GoogleOAuthRedirect;
