import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbordCtrl = new AbortController();
      activHttpRequests.current.push(httpAbordCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbordCtrl.signal,
        });
        const responsData = await response.json();

        activHttpRequests.current = activHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbordCtrl
        );

        if (!response.ok) {
          throw new Error(responsData.message);
        }
        setIsLoading(false);
        return responsData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
