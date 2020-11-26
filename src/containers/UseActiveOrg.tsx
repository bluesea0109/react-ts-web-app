import { useLocation } from 'react-router';

export interface IActiveWorkspace {
  workspaceId: string | null;
}

export const useActiveOrg = (): IActiveWorkspace => {
  const params = new URLSearchParams(useLocation().search);
  const workspaceParam = params.get('workspace');
  return {
    workspaceId: workspaceParam,
  };
};
