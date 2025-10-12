// components/common/FormField.jsx
import React from 'react';

const FormField = ({ id, label, error, ...props }) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default FormField;