// Utility functions for safe Local Storage and Session Storage handling

// --- Local Storage ---
export const setLocalItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
};

export const getLocalItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const removeLocalItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
  }
};

// --- Session Storage ---
export const setSessionItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (error) {
    console.warn(`Error setting sessionStorage key "${key}":`, error);
  }
};

export const getSessionItem = (key, defaultValue = null) => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading sessionStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const removeSessionItem = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error removing sessionStorage key "${key}":`, error);
  }
};

export const clearStorageOnLogout = () => {
  try {
    // Keep theme but clear auth and user info
    const theme = localStorage.getItem('theme');
    localStorage.clear();
    sessionStorage.clear();
    if (theme) {
      localStorage.setItem('theme', theme);
    }
  } catch (error) {
    console.error('Error clearing storage on logout', error);
  }
};
