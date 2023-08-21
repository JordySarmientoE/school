import { Status, TypeUsers } from 'src/constants/roles';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
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

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
