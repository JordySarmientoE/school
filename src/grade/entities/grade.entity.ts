import { Classroom } from 'src/classroom/entities/classroom.entity';
import { Status } from 'src/constants/roles';
import { StructureGrade } from 'src/structure-grade/entities/structure-grade.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
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

  @OneToMany(() => User, (user) => user.grade)
  user: User[];

  @OneToMany(() => StructureGrade, (structureGrade) => structureGrade.grade)
  academicStructure: StructureGrade[];

  @OneToMany(() => Classroom, (classroom) => classroom.grade)
  classroom: Classroom[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
