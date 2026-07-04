import { useState, useCallback } from 'react';

/**
 * Custom hook for managing form state and validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationSchema - Validation rules
 * @param {Function} onSubmit - Submit handler
 * @returns {Object} Form state and handlers
 */
export const useForm = (initialValues = {}, validationSchema = {}, onSubmit = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Clear error for this field when user starts typing
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [touched]);

  // Handle field blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate this field
    if (validationSchema[name]) {
      const error = validationSchema[name](values[name], values);
      setErrors((prev) => ({
        ...prev,
        [name]: error || '',
      }));
    }
  }, [validationSchema, values]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();
      setIsSubmitting(true);

      // Validate all fields
      const newErrors = {};
      let isValid = true;

      for (const [field, validator] of Object.entries(validationSchema)) {
        const error = validator(values[field], values);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }

      setErrors(newErrors);
      setTouched(
        Object.keys(validationSchema).reduce((acc, field) => {
          acc[field] = true;
          return acc;
        }, {})
      );

      if (isValid && onSubmit) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        }
      }

      setIsSubmitting(false);
    },
    [validationSchema, values, onSubmit]
  );

  // Set specific field value
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Set multiple field values
  const setFieldValues = useCallback((newValues) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Validate entire form
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    for (const [field, validator] of Object.entries(validationSchema)) {
      const error = validator(values[field], values);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [validationSchema, values]);

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    
    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldValues,
    resetForm,
    validateForm,
    
    // Computed
    isValid: Object.keys(errors).every((key) => !errors[key]),
    isDirty: JSON.stringify(values) !== JSON.stringify(initialValues),
  };
};
