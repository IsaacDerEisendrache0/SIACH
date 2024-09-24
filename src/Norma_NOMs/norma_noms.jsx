// En Norma_NOMs/norma_noms.jsx

import React, { useState } from 'react';

const NormaNOMs = () => {
  const [formData, setFormData] = useState({
    razonSocial: '',
    rfc: '',
    codigoPostal: '',
    correoElectronico: '',
    telefono: '',
    estado: '',
    sector: '',
    actividadEconomica: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica para enviar los datos, como enviarlos a un backend o realizar alguna acción
    console.log(formData);
  };

  return (
    <div className="container mt-5">
      <h2>Asistente para Identificar NOMs</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="razonSocial" className="form-label">Razón Social o Nombre</label>
          <input type="text" className="form-control" id="razonSocial" name="razonSocial" value={formData.razonSocial} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="rfc" className="form-label">RFC</label>
          <input type="text" className="form-control" id="rfc" name="rfc" value={formData.rfc} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="codigoPostal" className="form-label">Código Postal</label>
          <input type="text" className="form-control" id="codigoPostal" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="correoElectronico" className="form-label">Correo Electrónico</label>
          <input type="email" className="form-control" id="correoElectronico" name="correoElectronico" value={formData.correoElectronico} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">Teléfono</label>
          <input type="tel" className="form-control" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="estado" className="form-label">Estado</label>
          <select className="form-select" id="estado" name="estado" value={formData.estado} onChange={handleChange} required>
            <option value="">Selecciona...</option>
            <option value="CDMX">Ciudad de México</option>
            <option value="JAL">Jalisco</option>
            <option value="NL">Nuevo León</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="sector" className="form-label">Sector</label>
          <select className="form-select" id="sector" name="sector" value={formData.sector} onChange={handleChange} required>
            <option value="">Selecciona...</option>
            <option value="Publico">Público</option>
            <option value="Privado">Privado</option>
            <option value="Social">Social</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="actividadEconomica" className="form-label">Actividad Económica Principal</label>
          <input type="text" className="form-control" id="actividadEconomica" name="actividadEconomica" value={formData.actividadEconomica} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Buscar</button>
      </form>
    </div>
  );
};

export default NormaNOMs;
