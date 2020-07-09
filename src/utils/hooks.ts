import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { OperationVariables } from '@apollo/react-common';
import { DocumentNode } from 'graphql';
import { QueryHookOptions } from '@apollo/react-hooks/lib/types';

export const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

export const useQueryAsArray = <TData = any, TVariables = OperationVariables>(query: DocumentNode, options?: QueryHookOptions<TData, TVariables>): any[] => {
  const { data, loading, error } = useQuery<TData, TVariables>(query, options);

  return [data, loading, error];
}
