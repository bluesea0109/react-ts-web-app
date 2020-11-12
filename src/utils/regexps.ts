// Return if the name is valid or not in GCP
export const checkNameValid = (name: string): boolean => {
  return /^(?=.{1,25}$)([A-Za-z0-9]+)([-_]{1}[A-Za-z0-9]{1,16}){0,5}$/.test(
    name,
  );
};
