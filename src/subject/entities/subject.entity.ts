import { AcademicStructure } from 'src/academic-structure/entities/academic-structure.entity';
import { Status } from 'src/constants/roles';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
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

  @ManyToMany(
    () => AcademicStructure,
    (academicStructure) => academicStructure.subject,
  )
  academicStructure: AcademicStructure[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
