import { useState, useCallback } from "react";

const useFormHandler = (initialValues = {}) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleChange = useCallback((field, e) => {
        let value;
        let key = field;

        if (e && e.target) {
            const { type, checked, value: inputValue, name } = e.target;
            value = type === 'checkbox' ? checked : inputValue;
            key = name || field;  // Prefer name if available, fallback to field
        } else {
            value = e;
        }

        setFormData((prev) => ({
            ...prev,
            [key]: value
        }));

        setErrors((prev) => ({
            ...prev,
            [key]: ""
        }));
    }, []);

    const handleSelectChange = useCallback((field, value, isMulti = false) => {
        // Normalize to array if multi-select
        let newValue = isMulti ? (Array.isArray(value) ? value : [value]) : value;

        setFormData((prev) => ({
            ...prev,
            [field]: newValue
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: ""
        }));
    }, []);

    const handleNestedChange = useCallback((path, value) => {
        setFormData((prev) => {
            const newData = { ...prev };
            const keys = path.split('.');
            let current = newData;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return newData;
        });

        setErrors((prev) => ({
            ...prev,
            [path]: ""
        }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData(initialValues);
        setErrors({});
    }, [initialValues]);

    const updateFormData = useCallback((updates) => {
        setFormData((prev) => ({
            ...prev,
            ...updates
        }));
    }, []);

    const setFieldError = useCallback((field, error) => {
        setErrors((prev) => ({
            ...prev,
            [field]: error
        }));
    }, []);

    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    const clearFieldError = useCallback((field) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }, []);

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        handleChange,
        handleSelectChange, // <- added for dynamic select handling
        handleNestedChange,
        resetForm,
        updateFormData,
        setFieldError,
        clearErrors,
        clearFieldError,
    };
};

export default useFormHandler;
