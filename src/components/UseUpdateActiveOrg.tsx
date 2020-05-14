import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { useHistory, useLocation } from 'react-router';
import { GET_CURRENT_USER, UPDATE_ACTIVE_ORG } from '../gql-queries';

export interface IUpdateActiveOrg {
  loading: boolean;
  error?: ApolloError;
  orgId: string | null;
  projectId: string | null;
}

export const useUpdateActiveOrg = (): IUpdateActiveOrg => {
  const history = useHistory();
  const location = useLocation();
  const { loading, error , data } = useQuery(GET_CURRENT_USER);
  const params = new URLSearchParams(useLocation().search);
  const [updateActiveOrg, updateActiveOrgResult] = useMutation(UPDATE_ACTIVE_ORG,
    {
      refetchQueries: [{ query: GET_CURRENT_USER }],
      awaitRefetchQueries: true,
    });

  const orgId = params.get('org');
  const projectId = params.get('project');

  if (loading || error) {
    return {
      loading,
      error,
      orgId,
      projectId,
    };
  }

  if (updateActiveOrgResult.loading || updateActiveOrgResult.error) {
    return {
      loading: updateActiveOrgResult.loading,
      error: updateActiveOrgResult.error,
      orgId,
      projectId,
    };
  }

  const { activeOrg, activeProject } = data.currentUser;
  const activeOrgId = activeOrg ? activeOrg.id : null;
  const activeProjectId = activeProject ? activeProject.id : null;

  if (!orgId) {
    if (activeOrgId) {
      // update url with the user's active org and project
      let search = `?org=${activeOrgId}`;
      if (activeProjectId) {
        search += `&project=${activeProjectId}`;
      }
      history.push({ pathname: location.pathname, search });

      return {
        loading: false,
        orgId,
        projectId,
      };
    }

    return {
      loading: false,
      orgId,
      projectId,
    };
  }

  if (orgId !== activeOrgId || projectId !== activeProjectId) {
    // update active org
    updateActiveOrg({
      variables: {
        orgId,
        projectId,
      },
    });
    return {
      loading: true,
      orgId,
      projectId,
    };
  }

  return {
    loading: false,
    orgId,
    projectId,
  };
};
