/**
 * Navigation utility to navigate between pages
 */

import { useNavigate } from 'react-router-dom';

// Create a history object to use for navigation
let navigate: any = null;

// Function to set the navigate function
export const setNavigate = (nav: any) => {
  navigate = nav;
};

/**
 * Navigate to a specific page
 * This is a simple utility function that uses window.location.href
 * to navigate to a specific page
 * @param path The path to navigate to
 */
export const navigateTo = (path: string): void => {
  window.location.href = path;
};

/**
 * Navigate to the dashboard page
 */
export const navigateToDashboard = () => {
  if (navigate) {
    navigate('/');
  }
};

/**
 * Navigate to the customers page
 */
export const navigateToCustomers = () => {
  if (navigate) {
    navigate('/customers');
  }
};

/**
 * Navigate to the transactions page
 */
export const navigateToTransactions = () => {
  if (navigate) {
    navigate('/transactions');
  }
}; 