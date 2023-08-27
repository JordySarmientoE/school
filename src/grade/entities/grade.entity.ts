import { Status } from 'src/constants/roles';
import { StructureGrade } from 'src/structure-grade/entities/structure-grade.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Grade {
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

  @OneToOne(() => User, (user) => user.grade)
  user: User;

  @OneToOne(() => StructureGrade, (structureGrade) => structureGrade.grade)
  academicStructure: StructureGrade;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
