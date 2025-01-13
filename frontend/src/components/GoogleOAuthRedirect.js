// src/components/GoogleOAuthRedirect.js
import React from "react";


const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
const SCOPE = "https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/webmasters.readonly";

const GoogleOAuthRedirect = () => {
  const handleRedirect = () => {
    const authURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(
      SCOPE
    )}&access_type=offline`;
    window.location.href = authURL; // Redirect to Google's OAuth consent page
  };

  return (
    <button className="connect-button" onClick={handleRedirect}>
      Connect with GSC
    </button>
  );
};

export default GoogleOAuthRedirect;
