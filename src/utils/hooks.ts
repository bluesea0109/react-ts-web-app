import { OperationVariables } from '@apollo/react-common';
import { useQuery } from '@apollo/react-hooks';
import { QueryHookOptions } from '@apollo/react-hooks/lib/types';
import { DocumentNode } from 'graphql';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

// tslint:disable-next-line
export const useQueryAsArray = <TData = any, TVariables = OperationVariables>(query: DocumentNode, options?: QueryHookOptions<TData, TVariables>): any[] => {
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
