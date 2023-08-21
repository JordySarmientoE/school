import { Status } from 'src/constants/roles';

export interface SearchClassroom {
  status?: Status;
  grade?: number;
  year?: number;
  section?: number;
}
