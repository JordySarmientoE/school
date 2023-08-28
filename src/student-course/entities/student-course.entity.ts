import { Status } from 'src/constants/roles';
import { Course } from 'src/course/entities/course.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StudentCourse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (student) => student.courseStudent)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => Course, (course) => course.students)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column('text', {
    nullable: false,
    default: Status.ACTIVO,
  })
  status: string;

  @Column({
    type: 'decimal',
    nullable: false,
    default: 0,
    scale: 1,
    precision: 2,
  })
  note: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
