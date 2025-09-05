import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

const FormField = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  helperText,
  children,
  className,
  ...props
}) => {
  const id = `field-${name}`;

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {children || (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={cn(
            'input-field',
            error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
            disabled && 'bg-gray-100 cursor-not-allowed'
          )}
          {...props}
        />
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default FormField;
