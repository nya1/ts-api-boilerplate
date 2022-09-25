import {
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm';
import { Todo } from './todo';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column({ unique: true })
  email!: string;

  /**
   * @ignore
   */
  @Column({ select: false }) // do not select in queries
  passwordHash?: string;

  @OneToMany(() => Todo, (todo) => todo.createdByUser)
  todos?: Todo[];

  @CreateDateColumn()
  createdAt!: Date;
}
