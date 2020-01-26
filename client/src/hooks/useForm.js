import { useState, useCallback } from "react";
import { isEmpty } from "../utils";
import useRefState from "./useRefState";

export default (initValues, callback, validate) => {
  const [inputs, setInputs] = useState(initValues);
  const [errors, errorsRef, setErrors] = useRefState({});

  const handleSubmit = async event => {
    if (event) event.preventDefault();
    // check all inputs for mistakes before submitting
    if (validate) {
      for (const [key, val] of Object.entries(inputs)) {
        errorsRef.current = validate(key, val, errorsRef.current);
      }
      setErrors(errorsRef.current);
    }

    if (!isEmpty(errorsRef.current)) return;
    if (callback) await callback(inputs);
  };

  const handleInputChange = event => {
    event.persist();
    setInputs({ ...inputs, [event.target.name]: event.target.value });
    if (!validate) return;
    errorsRef.current = validate(event.target.name, event.target.value, errorsRef.current);
    setErrors(errorsRef.current);
  };

  const setField = useCallback((field, value) => {
    setInputs(i => {
      return { ...i, [field]: value };
    });
  }, []);

  const setFields = useCallback(fields => {
    setInputs(i => {
      return { ...i, ...fields };
    });
  }, []);

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
    setFields,
    resetField,
    resetForm,
    errors
  };
};
