import React from 'react';
import SearchBar from '../components/SearchBar';
// import Navbar from '../layout/NavBar';
import GSCData from '../components/ConnectGSC';
import './HomePage.css';

const HomePage = () => {
  const handleSearch = () => {
    // alert("Search functionality not implemented yet!");
  };

  return (
    <div className="homepage-container">
      <div className="container">
          <div className="section">
            <h1 className="heading">
              Optimize Your Website's SEO
            </h1>
            <p className="subheading">
              Get detailed insights and recommendations to improve your website's search engine rankings
            </p>
            <SearchBar placeholder="Enter website URL..." onSearch={handleSearch} />
            
          </div>
          <GSCData />
      </div>
    </div>
  );
};

export default HomePage;