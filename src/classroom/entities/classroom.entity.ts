import { Status } from 'src/constants/roles';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Classroom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer', {
    nullable: false,
  })
  grade: number;

  @Column('text', {
    nullable: false,
  })
  section: string;

  @Column('integer', {
    nullable: false,
  })
  year: number;

  @Column('text', {
    nullable: false,
    default: Status.ACTIVO,
  })
  status?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
