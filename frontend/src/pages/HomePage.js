import React from 'react';
import SearchBar from '../components/SearchBar';
import './HomePage.css';

const HomePage = () => {
  const handleSearch = () => {
    alert("Search functionality not implemented yet!");
  };

  return (
    <div className="homepage-container">
      <SearchBar placeholder="Enter website URL..." onSearch={handleSearch} />
    </div>
  );
};

export default HomePage;
