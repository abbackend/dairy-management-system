// Error handling utilities
export class DatabaseError extends Error {
  constructor(message, code = 'DB_ERROR', details = null) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export const ERROR_CODES = {
  DB_INIT_FAILED: 'DB_INIT_FAILED',
  DB_QUERY_FAILED: 'DB_QUERY_FAILED',
  DB_CONNECTION_LOST: 'DB_CONNECTION_LOST',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  MEMBER_NOT_FOUND: 'MEMBER_NOT_FOUND',
  COLLECTION_NOT_FOUND: 'COLLECTION_NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  FOREIGN_KEY_CONSTRAINT: 'FOREIGN_KEY_CONSTRAINT'
};

export const handleDatabaseError = (error, context = '') => {
  console.error(`Database error in ${context}:`, error);
  
  // Sanitize error message for user display
  let userMessage = 'An unexpected error occurred';
  let errorCode = ERROR_CODES.DB_QUERY_FAILED;
  
  if (error.message) {
    const message = error.message.toLowerCase();
    
    if (message.includes('unique constraint')) {
      userMessage = 'This record already exists';
      errorCode = ERROR_CODES.DUPLICATE_ENTRY;
    } else if (message.includes('foreign key constraint')) {
      userMessage = 'Cannot delete: record is referenced by other data';
      errorCode = ERROR_CODES.FOREIGN_KEY_CONSTRAINT;
    } else if (message.includes('not found')) {
      userMessage = 'Record not found';
      errorCode = ERROR_CODES.MEMBER_NOT_FOUND;
    } else if (message.includes('database not initialized')) {
      userMessage = 'Database connection error. Please refresh the page.';
      errorCode = ERROR_CODES.DB_INIT_FAILED;
    }
  }
  
  return new DatabaseError(userMessage, errorCode, {
    originalError: error.message,
    context
  });
};

export const validateMemberData = (memberData) => {
  const errors = [];
  
  if (!memberData.first_name?.trim()) {
    errors.push(new ValidationError('First name is required', 'first_name'));
  }
  
  if (!memberData.last_name?.trim()) {
    errors.push(new ValidationError('Last name is required', 'last_name'));
  }
  
  if (memberData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberData.email)) {
    errors.push(new ValidationError('Invalid email format', 'email'));
  }
  
  if (memberData.phone && !/^[+]?[\d\s-()]{10,15}$/.test(memberData.phone)) {
    errors.push(new ValidationError('Invalid phone number format', 'phone'));
  }
  
  if (memberData.status && !['active', 'inactive'].includes(memberData.status)) {
    errors.push(new ValidationError('Invalid status', 'status'));
  }
  
  if (memberData.owns && !['Cow', 'Buffalo', 'Mixed'].includes(memberData.owns)) {
    errors.push(new ValidationError('Invalid animal type', 'owns'));
  }
  
  return errors;
};

export const validateCollectionData = (collectionData) => {
  const errors = [];
  
  if (!collectionData.member_id) {
    errors.push(new ValidationError('Member is required', 'member_id'));
  }
  
  if (!collectionData.quantity || collectionData.quantity <= 0) {
    errors.push(new ValidationError('Quantity must be greater than 0', 'quantity'));
  }
  
  if (!collectionData.fat || collectionData.fat < 0 || collectionData.fat > 15) {
    errors.push(new ValidationError('Fat percentage must be between 0 and 15', 'fat'));
  }
  
  if (!collectionData.clr || collectionData.clr < 20 || collectionData.clr > 40) {
    errors.push(new ValidationError('CLR must be between 20 and 40', 'clr'));
  }
  
  if (!collectionData.price || collectionData.price <= 0) {
    errors.push(new ValidationError('Price must be greater than 0', 'price'));
  }
  
  if (!collectionData.date) {
    errors.push(new ValidationError('Date is required', 'date'));
  }
  
  if (!collectionData.shift || !['Morning', 'Evening'].includes(collectionData.shift)) {
    errors.push(new ValidationError('Invalid shift', 'shift'));
  }
  
  if (collectionData.type && !['Cow', 'Buffalo', 'Mixed'].includes(collectionData.type)) {
    errors.push(new ValidationError('Invalid milk type', 'type'));
  }
  
  return errors;
};

export const formatErrorForUser = (error) => {
  if (error instanceof ValidationError) {
    return {
      type: 'validation',
      message: error.message,
      field: error.field
    };
  }
  
  if (error instanceof DatabaseError) {
    return {
      type: 'database',
      message: error.message,
      code: error.code
    };
  }
  
  // Generic error
  return {
    type: 'error',
    message: 'An unexpected error occurred. Please try again.'
  };
};

export const logError = (error, context = '', additionalData = {}) => {
  // Sanitize sensitive information before logging
  const sanitizedData = {
    ...additionalData,
    timestamp: new Date().toISOString(),
    context: encodeURIComponent(context),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  // Remove any potential sensitive data
  delete sanitizedData.password;
  delete sanitizedData.token;
  delete sanitizedData.apiKey;
  
  console.error('Application Error:', {
    message: encodeURIComponent(error.message || 'Unknown error'),
    name: error.name,
    stack: error.stack ? encodeURIComponent(error.stack.substring(0, 1000)) : 'No stack trace',
    ...sanitizedData
  });
};

export default {
  DatabaseError,
  ValidationError,
  ERROR_CODES,
  handleDatabaseError,
  validateMemberData,
  validateCollectionData,
  formatErrorForUser,
  logError
};