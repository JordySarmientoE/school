import { Status } from 'src/constants/roles';
import { Course } from 'src/course/entities/course.entity';
import { StructureGrade } from 'src/structure-grade/entities/structure-grade.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: false,
    default: Status.ACTIVO,
  })
  status: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'decimal',
    nullable: false,
    default: 0,
    scale: 1,
    precision: 2,
  })
  hourPerWeek: number;

  @ManyToMany(() => StructureGrade, (structureGrade) => structureGrade.subject)
  @JoinTable({ name: 'subject_structure_relation' })
  structureGrade: StructureGrade[];

  @OneToMany(() => Course, (course) => course.subject)
  course: Course[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
