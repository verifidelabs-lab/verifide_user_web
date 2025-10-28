import React from 'react';
import useFormHandler from '../../hooks/useFormHandler';
import CustomInput from '../Input/CustomInput';
import CustomDateInput from '../Input/CustomDateInput';
import FilterSelect from '../Input/FilterSelect';
import Modal from './Modal';
import Button from '../Button/Button';
import { toast } from 'sonner';

const DynamicFormModal = ({
  isOpen,
  onClose,
  title,
  fieldsConfig,
  onSubmit,
  initialData = {}
}) => {
  const { formData, setFormData, errors, handleChange } = useFormHandler(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    let isValid = true;
    const newErrors = {};

    fieldsConfig.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }
    });

    if (!isValid) {
      // Set errors and return
      setFormData({ ...formData, errors: newErrors });
      return;
    }

    onSubmit(formData);
    toast.success(`${title} added successfully!`);
    onClose();
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'checkbox':
        return (
          <CustomInput
            type={field.type}
            label={field.label}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e)}
            error={errors[field.name]}
            placeholder={field.placeholder}
            fullWidth
            helperText={field.helperText}
            className="h-10"
          />
        );
      case 'date':
        return (
          <CustomDateInput
            label={field.label}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            type={field.dateType || 'date'}
          />
        );
      case 'select':
        return (
          <FilterSelect
            label={field.label}
            options={field.options || []}
            selectedOption={formData[field.name]}
            onChange={(selected) => handleChange(field.name, selected)}
            placeholder={field.placeholder}
            isMulti={field.isMulti}
            error={errors[field.name]}
          />
        );
      case 'file':
        return (
          <div className="mb-4">
            <label className="block text-base text-[#282828] font-medium mb-2">
              {field.label}
            </label>
            <input
              type="file"
              onChange={(e) => handleChange(field.name, e.target.files[0])}
              className="block w-full text-sm glassy-text-secondary
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fieldsConfig.map((field) => (
          <div key={field.name}>
            {renderField(field)}
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DynamicFormModal;