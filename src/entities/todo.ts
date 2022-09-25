import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './user';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * content/description
   */
  @Column()
  content!: string;

  /**
   * if true the todo is done
   */
  @Column({ default: false })
  isDone!: boolean;

  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn({
    name: <keyof Todo>'createdByUserId'
  })
  createdByUser!: User;

  /**
   * reference to the user that created this todo
   */
  @Column()
  createdByUserId!: number;

  @UpdateDateColumn()
  updatedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
