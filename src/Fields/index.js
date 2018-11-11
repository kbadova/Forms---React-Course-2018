import React from 'react';
import _ from 'lodash';

const InputField = ({
  type,
  value,
  onChange,
  label,
  errors,
  validators,
  updateSyncErrors
}) => {
  const onFieldChange = event => {
    onChange(event);

    let errors = [];

    _.forEach(validators, validator => {
      const syncErrors = validator(event.target.value);

      if (syncErrors) {
        errors.push(syncErrors);
      }
    });

    updateSyncErrors('phone', errors);
  };

  return (
    <div className="InputField">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onFieldChange}
        placeholder="Type your name"
      />

      {errors && <div>{errors}</div>}
    </div>
  );
};

const RadioField = ({value, label, onChange, options}) => (
  <div className="RadioField">
    <label>{label}</label>
    <div className="options">
      {options.map(option => (
        <div key={option.id}>
          <label>{option.name}</label>
          <input
            key={option.id}
            type="radio"
            value={option.id}
            name="radio"
            onChange={onChange}
          />
        </div>
      ))}
    </div>
  </div>
);

const SelectField = ({label, value, onChange, options}) => (
  <div className="SelectField">
    <label>{label}</label>
    <select onChange={onChange} value={value}>
      {options.map(option => {
        return (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        );
      })}
    </select>
  </div>
);

export {InputField, RadioField, SelectField};
