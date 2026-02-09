import React from "react";
import type { FormField } from "../../types/types";

interface FormMessageProps {
  title: string;
  fields: FormField[];
  submitText?: string;
  onSubmit?: (data: Record<string, string | number | boolean>) => void;
}

export const FormMessage: React.FC<FormMessageProps> = ({
  title,
  fields,
  submitText = "Enviar",
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string | number | boolean> = {};
    formData.forEach((value, key) => {
      data[key] = value as string;
    });
    onSubmit?.(data);
  };

  const renderField = (field: FormField) => {
    const baseClasses = "w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500";
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            required={field.required}
            placeholder={field.placeholder}
            className={`${baseClasses} resize-none`}
            rows={3}
          />
        );
        
      case 'select':
        return (
          <select
            name={field.name}
            required={field.required}
            className={baseClasses}
          >
            <option value="">Seleccionar...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'checkbox':
        return (
          <input
            type="checkbox"
            name={field.name}
            required={field.required}
            className="mr-2"
          />
        );
        
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  required={field.required}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        );
        
      default:
        return (
          <input
            type={field.type}
            name={field.name}
            required={field.required}
            placeholder={field.placeholder}
            className={baseClasses}
          />
        );
    }
  };

  return (
    <div className="border rounded p-4 bg-white">
      <h3 className="font-bold mb-3 text-gray-800">{title}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {submitText}
        </button>
      </form>
    </div>
  );
}; 