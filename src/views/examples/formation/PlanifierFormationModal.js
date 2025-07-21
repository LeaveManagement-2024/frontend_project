import React, { useState, useEffect } from 'react';

const PlanifierFormationModal = ({ formations, salarie, onPlanifier, onClose }) => {
  const [formData, setFormData] = useState({
    salarieId: salarie.id,
    formationId: '',
    dateDebut: '',
    commentaires: ''
  });
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Définir la date minimale à aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, dateDebut: today }));
  }, []);

  const handleFormationChange = (formationId) => {
    const formation = formations.find(f => f.id === parseInt(formationId));
    setSelectedFormation(formation);
    setFormData(prev => ({ ...prev, formationId }));
    
    // Calculer la date de fin automatiquement
    if (formation && formData.dateDebut) {
      const dateDebut = new Date(formData.dateDebut);
      const dateFin = new Date(dateDebut);
      dateFin.setDate(dateFin.getDate() + formation.dureeJours - 1);
      setFormData(prev => ({ ...prev, dateFin: dateFin.toISOString().split('T')[0] }));
    }
  };

  const handleDateDebutChange = (dateDebut) => {
    setFormData(prev => ({ ...prev, dateDebut }));
    
    // Recalculer la date de fin
    if (selectedFormation && dateDebut) {
      const date = new Date(dateDebut);
      const dateFin = new Date(date);
      dateFin.setDate(dateFin.getDate() + selectedFormation.dureeJours - 1);
      setFormData(prev => ({ ...prev, dateFin: dateFin.toISOString().split('T')[0] }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.formationId) {
      newErrors.formationId = 'Veuillez sélectionner une formation';
    }
    
    if (!formData.dateDebut) {
      newErrors.dateDebut = 'Veuillez sélectionner une date de début';
    } else {
      const selectedDate = new Date(formData.dateDebut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dateDebut = 'La date de début ne peut pas être antérieure à aujourd\'hui';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onPlanifier(formData);
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Planifier une Formation</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="salarie-info">
            <h3>Salarié sélectionné</h3>
            <p><strong>{salarie.prenom} {salarie.nom}</strong></p>
            <p>{salarie.poste} - {salarie.departement}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="formation-form">
            <div className="form-group">
              <label htmlFor="formation">Formation *</label>
              <select
                id="formation"
                value={formData.formationId}
                onChange={(e) => handleFormationChange(e.target.value)}
                className={`form-control ${errors.formationId ? 'error' : ''}`}
              >
                <option value="">Sélectionner une formation</option>
                {formations.map(formation => (
                  <option key={formation.id} value={formation.id}>
                    {formation.nom} - {formatType(formation.type)} ({formation.dureeJours} jour{formation.dureeJours > 1 ? 's' : ''})
                  </option>
                ))}
              </select>
              {errors.formationId && <span className="error-text">{errors.formationId}</span>}
            </div>
            
            {selectedFormation && (
              <div className="formation-details">
                <h4>Détails de la formation</h4>
                <p><strong>Type:</strong> {formatType(selectedFormation.type)}</p>
                <p><strong>Durée:</strong> {selectedFormation.dureeJours} jour{selectedFormation.dureeJours > 1 ? 's' : ''}</p>
                <p><strong>Description:</strong> {selectedFormation.description}</p>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="dateDebut">Date de début *</label>
              <input
                type="date"
                id="dateDebut"
                value={formData.dateDebut}
                onChange={(e) => handleDateDebutChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`form-control ${errors.dateDebut ? 'error' : ''}`}
              />
              {errors.dateDebut && <span className="error-text">{errors.dateDebut}</span>}
            </div>
            
            {formData.dateFin && (
              <div className="form-group">
                <label>Date de fin prévue</label>
                <input
                  type="date"
                  value={formData.dateFin}
                  disabled
                  className="form-control disabled"
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="commentaires">Commentaires</label>
              <textarea
                id="commentaires"
                value={formData.commentaires}
                onChange={(e) => setFormData(prev => ({ ...prev, commentaires: e.target.value }))}
                className="form-control"
                rows="3"
                placeholder="Commentaires optionnels..."
              />
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                Planifier la Formation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlanifierFormationModal;