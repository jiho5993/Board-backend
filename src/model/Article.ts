import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AllowNull,
  AutoIncrement,
  Default,
  HasMany
} from 'sequelize-typescript';
import { Reply } from './Reply';

@Table({
  freezeTableName: true
})
export class Article extends Model<Article> {
  @HasMany(() => Reply)
  reply!: Reply[];

  @PrimaryKey
  @AutoIncrement
  @Column
  article_no!: number;

  @AllowNull(false)
  @Column
  title!: string;

  @AllowNull(false)
  @Column
  writer!: string;

  @AllowNull(false)
  @Column
  content!: string;

  @AllowNull(false)
  @Column
  reg_date!: Date;

  @AllowNull(false)
  @Default(0)
  @Column
  view_cnt!: number;
}