import { AcademicStructure } from 'src/academic-structure/entities/academic-structure.entity';
import { Status } from 'src/constants/roles';
import { Course } from 'src/course/entities/course.entity';
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
  status: string;

  @ManyToOne(() => AcademicStructure)
  @JoinColumn({ name: 'academic_structure_id' })
  academicStructure: AcademicStructure;

  @OneToMany(() => Course, (course) => course.classroom)
  courses: Course[];

  @OneToMany(() => User, (student) => student.classroom)
  students: User[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
