import { AcademicStructure } from 'src/academic-structure/entities/academic-structure.entity';
import { Status } from 'src/constants/roles';
import { Subject } from 'src/subject/entities/subject.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Grade } from 'src/grade/entities/grade.entity';

@Entity()
export class StructureGrade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Grade)
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;

  @Column('text', {
    nullable: false,
    default: Status.ACTIVO,
  })
  status?: string;

  @ManyToMany(() => Subject, (subject) => subject.structureGrade, {
    cascade: true,
  })
  @JoinTable()
  subject: Subject[];

  @ManyToOne(
    () => AcademicStructure,
    (academicStructure) => academicStructure.structureGrade,
  )
  academicStructure: AcademicStructure;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
