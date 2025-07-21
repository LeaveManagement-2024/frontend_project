import React from 'react';

const FormationCard = ({ formation, onSelect }) => {
  const getTypeColor = (type) => {
    switch(type) {
      case 'TECHNIQUE': return '#3498db';
      case 'MANAGEMENT': return '#e74c3c';
      case 'SECURITE': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const formatType = (type) => {
    switch(type) {
      case 'TECHNIQUE': return 'Technique';
      case 'MANAGEMENT': return 'Management';
      case 'SECURITE': return 'Sécurité';
      default: return type;
    }
  };

  return (
    <div className="formation-card" onClick={onSelect}>
      <div className="formation-header">
        <h3>{formation.nom}</h3>
        <span 
          className="formation-type"
          style={{ backgroundColor: getTypeColor(formation.type) }}
        >
          {formatType(formation.type)}
        </span>
      </div>
      
      <div className="formation-content">
        <p className="formation-description">{formation.description}</p>
        <div className="formation-details">
          <span className="formation-duration">
            <i className="icon-clock"></i>
            {formation.dureeJours} jour{formation.dureeJours > 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FormationCard;