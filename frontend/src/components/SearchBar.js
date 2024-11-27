import React from 'react';
import './SearchBar.css';

const SearchBar = ({ placeholder, onSearch }) => {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder={placeholder || "Enter website URL..."}
        className="search-bar"
      />
      <button onClick={onSearch} className="search-button">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
