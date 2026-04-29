import { useSelector } from 'react-redux';

const useAuth = () => {
  const { isAuthenticated, token, loading, error } = useSelector((state) => state.auth);

  return {
    isAuthenticated,
    token,
    loading,
    error,
    // Add any specific logic here if needed
  };
};

export default useAuth;
