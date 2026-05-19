import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Topic } from './topic.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column({ type: 'text' })
  content: string;

  @Column()
  slug: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ nullable: true })
  authorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  published: boolean;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ name: 'topic_id', type: 'uuid', nullable: true })
  topicId: string;

  @ManyToOne(() => Topic, (topic) => topic.posts, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;
}
