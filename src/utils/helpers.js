/**
 * Formats a date string for display
 * @param {string} dateString - Date string in ISO format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

/**
 * Generates member initials from full name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

/**
 * Calculates total amount for milk collection
 * @param {number} quantity - Quantity in liters
 * @param {number} pricePerLiter - Price per liter
 * @returns {number} Total amount
 */
export const calculateTotalAmount = (quantity, pricePerLiter) => {
  return parseFloat((parseFloat(quantity || 0) * parseFloat(pricePerLiter || 0)).toFixed(2));
};

/**
 * Validates phone number format
 * @param {string} phone - Phone number
 * @returns {boolean} Is valid
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[\d\s-()]{10,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates email format
 * @param {string} email - Email address
 * @returns {boolean} Is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Filters array based on search term
 * @param {Array} array - Array to filter
 * @param {string} searchTerm - Search term
 * @param {Array} searchFields - Fields to search in
 * @returns {Array} Filtered array
 */
export const filterBySearch = (array, searchTerm, searchFields) => {
  if (!searchTerm) return array;
  
  return array.filter(item =>
    searchFields.some(field =>
      item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
};

/**
 * Sorts array by specified field
 * @param {Array} array - Array to sort
 * @param {string} field - Field to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export const sortBy = (array, field, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (order === 'asc') {
      return a[field] > b[field] ? 1 : -1;
    }
    return a[field] < b[field] ? 1 : -1;
  });
};

/**
 * Debounces function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  if (typeof func !== 'function') {
    throw new Error('First argument must be a function');
  }
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Generates a unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
