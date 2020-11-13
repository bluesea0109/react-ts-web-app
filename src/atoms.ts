import { atom } from 'recoil';
import { IUser } from './models/user-service';

export const currentUser = atom<IUser | undefined>({
  key: 'currentUser',
  default: undefined,
  dangerouslyAllowMutability: true,
});
