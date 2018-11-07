import React from 'react';

const InputField = ({type, value, onChange, label, errors}) => (
  <div className="InputField">
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder="Type your name"
    />

    {errors && <div>{errors}</div>}
  </div>
);

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
    <select onChange={onChange}>
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
