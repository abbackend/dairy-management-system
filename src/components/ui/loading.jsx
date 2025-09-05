import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

const LoadingSpinner = ({ size = 'default', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className={cn('animate-spin rounded-full border-2 border-primary-200 border-t-primary-600', sizeClasses[size], className)} />
  );
};

const Loading = ({ 
  message = 'Loading...', 
  fullScreen = false, 
  size = 'default',
  className 
}) => {
  const containerClass = fullScreen
    ? 'min-h-screen flex items-center justify-center bg-gray-50'
    : 'flex items-center justify-center p-4';

  return (
    <div className={cn(containerClass, className)}>
      <div className="text-center">
        <LoadingSpinner size={size} />
        {message && (
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
  fullScreen: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'default', 'lg', 'xl']),
  className: PropTypes.string,
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'default', 'lg', 'xl']),
  className: PropTypes.string,
};

export { Loading, LoadingSpinner };
