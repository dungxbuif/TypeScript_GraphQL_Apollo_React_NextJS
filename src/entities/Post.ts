import {
   BaseEntity,
   Column,
   CreateDateColumn,
   Entity,
   PrimaryGeneratedColumn,
   UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Post extends BaseEntity {
   @PrimaryGeneratedColumn()
   postID!: number;

   @Column()
   title!: string;

   @Column({ unique: true })
   text: string;

   @CreateDateColumn()
   createdAt: Date;

   @UpdateDateColumn()
   updatedAt: Date;
}
