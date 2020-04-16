import { useState } from 'react';

const useFormValidation = (initialState, validate, action) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    e.persist();
    setValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
    } else {
      action();
    }
  };

  const clearError = (inputName) => {
    if (!errors[inputName]) return;
    const updatedErrors = { ...errors };
    delete updatedErrors[inputName];
    setErrors(updatedErrors);
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    clearError,
  };
};

export default useFormValidation;
