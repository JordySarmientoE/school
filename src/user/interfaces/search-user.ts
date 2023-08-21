import { Status, TypeUsers } from 'src/constants/roles';

export interface SearchUser {
  status: Status;
  role?: TypeUsers;
}
