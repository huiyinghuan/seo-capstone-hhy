
import React from "react";
import { AppBar, Toolbar, Button, Typography, IconButton, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "bootstrap/dist/css/bootstrap.min.css";
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
          <a href="#" className="nav-link">
            Home
          </a>
          <a href="#" className="nav-link">
            Technical Audits
          </a>
          <a href="#" className="nav-link">
            Keywords
          </a>
          <a href="#" className="nav-link">
            Reports
          </a>
          {/* Connect Button */}
          <Button className="connect-button">
            Connect with GSC
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
