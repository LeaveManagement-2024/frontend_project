import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange, selectedType, onTypeChange, types }) => {
  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Rechercher une formation..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        <i className="search-icon">🔍</i>
      </div>
      
      <select 
        value={selectedType} 
        onChange={(e) => onTypeChange(e.target.value)}
        className="type-filter"
      >
        <option value="">Tous les types</option>
        {types.map(type => (
          <option key={type} value={type}>
            {type === 'TECHNIQUE' ? 'Technique' : 
             type === 'MANAGEMENT' ? 'Management' : 
             type === 'SECURITE' ? 'Sécurité' : type}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;