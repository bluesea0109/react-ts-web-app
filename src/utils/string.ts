import { IUser } from '../models/user-service';

export const validateEmail = (email: string): boolean => {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

export const validateUrl = (url: string): boolean => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(url);
};

export const removeSpecialChars = (text: string): string => {
  return text.replace(/[^a-zA-Z ]/g, ' ');
};

export const createAgentPath = (
  user: IUser,
  agentId: number,
  agentTab: string,
  entityId?: string | number,
): string => {
  if (!user.activeProject) {
    return '/no-project';
  }
  return `/orgs/${user.activeProject.orgId}/projects/${
    user.activeProject.id
  }/chatbot-builder/agents/${agentId}/${agentTab}/${entityId || ''}`;
};
