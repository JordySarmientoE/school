import { Status } from 'src/constants/roles';
import { Grade } from 'src/grade/entities/grade.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Classroom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Grade)
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;

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

  @OneToMany(() => User, (student) => student.classroom)
  students: User[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
