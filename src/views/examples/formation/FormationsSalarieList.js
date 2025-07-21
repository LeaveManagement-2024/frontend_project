import React from 'react';

const FormationsSalarieList = ({ formations, onUpdateStatut, onAnnuler }) => {
  const getStatutColor = (statut) => {
    switch(statut) {
      case 'PLANIFIEE': return '#f39c12';
      case 'EN_COURS': return '#3498db';
      case 'TERMINEE': return '#27ae60';
      case 'ANNULEE': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const formatStatut = (statut) => {
    switch(statut) {
      case 'PLANIFIEE': return 'Planifiée';
      case 'EN_COURS': return 'En cours';
      case 'TERMINEE': return 'Terminée';
      case 'ANNULEE': return 'Annulée';
      default: return statut;
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAvailableStatuts = (currentStatut) => {
    switch(currentStatut) {
      case 'PLANIFIEE':
        return ['EN_COURS', 'ANNULEE'];
      case 'EN_COURS':
        return ['TERMINEE', 'ANNULEE'];
      case 'TERMINEE':
        return [];
      case 'ANNULEE':
        return [];
      default:
        return [];
    }
  };

  if (formations.length === 0) {
    return (
      <div className="empty-state">
        <p>Aucune formation planifiée pour ce salarié.</p>
      </div>
    );
  }

  return (
    <div className="formations-salarie-list">
      {formations.map(formationSalarie => (
        <div key={formationSalarie.id} className="formation-salarie-card">
          <div className="formation-header">
            <div className="formation-title">
              <h3>{formationSalarie.formation.nom}</h3>
              <span 
                className="formation-statut"
                style={{ backgroundColor: getStatutColor(formationSalarie.statut) }}
              >
                {formatStatut(formationSalarie.statut)}
              </span>
            </div>
            
            <div className="formation-actions">
              {getAvailableStatuts(formationSalarie.statut).length > 0 && (
                <select
                  onChange={(e) => onUpdateStatut(formationSalarie.id, e.target.value)}
                  className="statut-select"
                  defaultValue=""
                >
                  <option value="" disabled>Changer le statut</option>
                  {getAvailableStatuts(formationSalarie.statut).map(statut => (
                    <option key={statut} value={statut}>
                      {formatStatut(statut)}
                    </option>
                  ))}
                </select>
              )}
              
              {formationSalarie.statut === 'PLANIFIEE' && (
                <button
                  onClick={() => onAnnuler(formationSalarie.id)}
                  className="btn btn-danger btn-sm"
                >
                  Annuler
                </button>
              )}
            </div>
          </div>
          
          <div className="formation-details">
            <div className="detail-item">
              <span className="label">Type:</span>
              <span className="value">{formatType(formationSalarie.formation.type)}</span>
            </div>
            
            <div className="detail-item">
              <span className="label">Date de début:</span>
              <span className="value">{formatDate(formationSalarie.dateDebut)}</span>
            </div>
            
            {formationSalarie.dateFin && (
              <div className="detail-item">
                <span className="label">Date de fin:</span>
                <span className="value">{formatDate(formationSalarie.dateFin)}</span>
              </div>
            )}
            
            <div className="detail-item">
              <span className="label">Durée:</span>
              <span className="value">{formationSalarie.formation.dureeJours} jour{formationSalarie.formation.dureeJours > 1 ? 's' : ''}</span>
            </div>
            
            {formationSalarie.commentaires && (
              <div className="detail-item full-width">
                <span className="label">Commentaires:</span>
                <span className="value">{formationSalarie.commentaires}</span>
              </div>
            )}
          </div>
          
          <div className="formation-description">
            <p>{formationSalarie.formation.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormationsSalarieList;