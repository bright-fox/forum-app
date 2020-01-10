import { useState } from "react";

export default (initValues, callback) => {
  const [inputs, setInputs] = useState(initValues);

  const handleSubmit = async e => {
    if (e) e.preventDefault();
    await callback(inputs);
  };

  const handleInputChange = e => {
    e.persist();
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const setField = (field, value) => {
    setInputs({ ...inputs, [field]: value });
  };

  const resetField = field => {
    setInputs({ ...inputs, [field]: initValues[field] });
  };

  const resetForm = () => {
    setInputs(initValues);
  };

  return {
    inputs,
    handleInputChange,
    handleSubmit,
    setField,
    resetField,
    resetForm
  };
};
