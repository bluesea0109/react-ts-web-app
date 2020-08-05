import { OperationVariables } from '@apollo/client';
import { QueryHookOptions, useQuery } from '@apollo/client';
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
