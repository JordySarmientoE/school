import { Classroom } from 'src/classroom/entities/classroom.entity';
import { Status } from 'src/constants/roles';
import { Subject } from 'src/subject/entities/subject.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (teacher) => teacher.courseTeacher)
  teacher: User;

  @ManyToOne(() => Subject, (subject) => subject.course)
  subject: Subject;

  @ManyToOne(() => Classroom, (classroom) => classroom.courses)
  classroom: Classroom;

  @Column({
    type: 'decimal',
    nullable: false,
    default: 0,
    scale: 1,
    precision: 2,
  })
  hourPerWeek: number;

  @Column('text', {
    nullable: false,
    default: Status.ACTIVO,
  })
  status: string;

  @ManyToMany(() => User, (student) => student.courseStudent)
  @JoinTable({ name: 'student_course_relation' })
  students: User[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
