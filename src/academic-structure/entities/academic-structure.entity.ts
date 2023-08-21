import { Status } from 'src/constants/roles';
import { Subject } from 'src/subject/entities/subject.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AcademicStructure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: false,
  })
  name: string;

  @Column('integer', {
    nullable: false,
  })
  year: number;

  @Column('text', {
    nullable: false,
    default: Status.ACTIVO,
  })
  status?: string;

  @ManyToMany(() => Subject, (subject) => subject.academicStructure, {
    cascade: true,
  })
  @JoinTable()
  subject: Subject[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
