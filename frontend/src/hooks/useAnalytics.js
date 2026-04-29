import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Replace with your Google Analytics Measurement ID
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'; 
    ReactGA.initialize(measurementId);
  }, []);

  useEffect(() => {
    // Send pageview with a custom path
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);
};

export default useAnalytics;
