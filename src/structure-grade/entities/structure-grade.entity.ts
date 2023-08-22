import { AcademicStructure } from 'src/academic-structure/entities/academic-structure.entity';
import { Status } from 'src/constants/roles';
import { Subject } from 'src/subject/entities/subject.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StructureGrade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer', {
    nullable: false,
  })
  grade: number;

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

  @OneToMany(
    () => AcademicStructure,
    (academicStructure) => academicStructure.structureGrade,
  )
  academicStructure: AcademicStructure;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
