import { useState } from 'react';
import axios from 'axios';

const useApiRequest = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (url, method, body) => {
    try {
      setLoading(true);
      const response = await axios({ method, url, data: body });
      setData(response.data);
      return response.data; // Return the data directly
    } catch (err) {
      setError(err);
      return null; // Return null in case of an error
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, fetchData };
};

export default useApiRequest;
