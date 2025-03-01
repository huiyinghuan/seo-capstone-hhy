
import React from "react";
import { AppBar, Toolbar, Button, Typography, IconButton, Box } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link for navigation
import SearchIcon from "@mui/icons-material/Search";
import "bootstrap/dist/css/bootstrap.min.css";
// import GoogleOAuthRedirect from "../components/GoogleOAuthRedirect"; // Import the GoogleOAuthRedirects
import "./NavBar.css"; 

const Navbar = () => {
  return (
    <AppBar position="static" className="navbar-container">
      <Toolbar className="container">
        {/* Logo and Search Icon */}
        <Box display="flex" alignItems="center" flexGrow={1}>
          <IconButton>
            <SearchIcon className="search-icon" />
          </IconButton>
          <Typography variant="h6" className="navbar-title">
            SEO Tool
          </Typography>
        </Box>
        {/* Navigation Links */}
        <Box display={{ xs: "none", md: "flex" }} alignItems="center" className="ml-auto">
          {/* <a href="" className="nav-link">
            Home
          </a> */}
            {/* Updated Home Link */}
          <Link to="/" className="nav-link">Home</Link> 
          <Link to="/gsc-page" className="connect-button nav-link"> {/* New link to the new page */}
            Connect with GSC
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
