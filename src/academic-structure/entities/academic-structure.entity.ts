import { Status } from 'src/constants/roles';
import { StructureGrade } from 'src/structure-grade/entities/structure-grade.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
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
  status: string;

  @OneToMany(
    () => StructureGrade,
    (structureGrade) => structureGrade.academicStructure,
  )
  structureGrade: StructureGrade[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
