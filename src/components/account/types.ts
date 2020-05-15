import { IOrg, IUser } from '../../models';

export interface IReceivedData {
  orgs: IOrg[];
}

export interface IAccountProps {
  user?: IUser;
}
