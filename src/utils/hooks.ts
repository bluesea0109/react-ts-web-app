import { OperationVariables } from '@apollo/client';
import { QueryHookOptions, useQuery } from '@apollo/client';
import { DocumentNode } from 'graphql';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

// tslint:disable-next-line
export const useQueryAsArray = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>,
): any[] => {
  const { data, loading, error } = useQuery<TData, TVariables>(query, options);

  return [data, loading, error];
};

export const usePrevious = <T>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

// Hook
export const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
};
