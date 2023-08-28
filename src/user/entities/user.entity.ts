import { Classroom } from 'src/classroom/entities/classroom.entity';
import { Status, TypeUsers } from 'src/constants/roles';
import { Course } from 'src/course/entities/course.entity';
import { Grade } from 'src/grade/entities/grade.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: false,
  })
  firstName: string;

  @Column('text', {
    nullable: false,
  })
  lastName: string;

  @Column('text', {
    nullable: false,
  })
  email: string;

  @Column('text', {
    nullable: false,
  })
  dni: string;

  @Column('text', {
    nullable: false,
  })
  phone: string;

  @Column('text', {
    nullable: false,
  })
  address: string;

  @Column('text', {
    nullable: false,
    select: false,
  })
  password: string;

  @Column('text', {
    nullable: false,
    default: Status.ACTIVO,
  })
  status?: string;

  @Column('text', {
    nullable: false,
    default: TypeUsers.STUDENT,
  })
  role: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'children_id' })
  children: User;

  @ManyToOne(() => Grade)
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;

  @ManyToOne(() => Classroom)
  @JoinColumn({ name: 'classroom_id' })
  classroom: Classroom;

  @OneToMany(() => Course, (course) => course.teacher)
  @JoinColumn({ name: 'course_teacher_id' })
  courseTeacher: Course[];

  @ManyToMany(() => Course)
  @JoinTable({ name: 'student_course_relation' })
  courseStudent: Course[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
