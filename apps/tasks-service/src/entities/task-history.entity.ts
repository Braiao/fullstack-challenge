import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity('task_history')
export class TaskHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  taskId: string;

  @ManyToOne(() => Task, (task) => task.history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column()
  field: string;

  @Column('text', { nullable: true })
  oldValue: string;

  @Column('text', { nullable: true })
  newValue: string;

  @Column()
  changedById: string;

  @CreateDateColumn()
  createdAt: Date;
}
