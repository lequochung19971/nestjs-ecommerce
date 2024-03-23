import { BaseEntity } from 'src/entities/base.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { File } from 'src/modules/files/entities/file.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @Column({
    type: 'varchar',
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ManyToMany(() => File)
  @JoinTable()
  media: File[];

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable()
  categories: Category[];
}
