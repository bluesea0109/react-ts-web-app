import { useMutation, useQuery } from '@apollo/client';
import { ApolloError } from '@apollo/client';
import { useHistory, useLocation } from 'react-router';
import {
  GET_CURRENT_USER,
  UPDATE_ACTIVE_WORKSPACE,
} from '../common-gql-queries';

export interface IUpdateactiveWorkspace {
  loading: boolean;
  error?: ApolloError;
  workspaceId: string | null;
}

export const useUpdateactiveWorkspace = (): IUpdateactiveWorkspace => {
  const history = useHistory();
  const location = useLocation();
  const { loading, error, data } = useQuery(GET_CURRENT_USER);
  const params = new URLSearchParams(useLocation().search);
  const [updateActiveWorkspace, updateActiveWorkspaceResult] = useMutation(
    UPDATE_ACTIVE_WORKSPACE,
    {
      refetchQueries: [{ query: GET_CURRENT_USER }],
      awaitRefetchQueries: true,
    },
  );

  const workspaceId = params.get('workspace');

  if (loading || error) {
    return {
      loading,
      error,
      workspaceId,
    };
  }

  if (
    updateActiveWorkspaceResult.loading ||
    updateActiveWorkspaceResult.error
  ) {
    return {
      loading: updateActiveWorkspaceResult.loading,
      error: updateActiveWorkspaceResult.error,
      workspaceId,
    };
  }

  const { activeWorkspace } = data.currentUser;
  const activeWorkspaceId = activeWorkspace ? activeWorkspace.id : null;

  if (!workspaceId) {
    if (activeWorkspaceId) {
      // update url with the user's active workspace
      const search = `?workspace=${activeWorkspaceId}`;
      history.push({ pathname: location.pathname, search });

      return {
        loading: false,
        workspaceId,
      };
    }

    return {
      loading: false,
      workspaceId,
    };
  }

  if (workspaceId !== activeWorkspaceId) {
    // update active workspace
    updateActiveWorkspace({
      variables: {
        workspaceId,
      },
    });
    return {
      loading: true,
      workspaceId,
    };
  }

  return {
    loading: false,
    workspaceId,
  };
};
