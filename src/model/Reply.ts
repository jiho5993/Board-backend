import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AllowNull,
  AutoIncrement,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { Article } from './Article';

@Table({ freezeTableName: true })
export class Reply extends Model<Reply> {
  @BelongsTo(() => Article)
  article!: Article;

  @PrimaryKey
  @AutoIncrement
  @Column
  reply_no!: number;

  @ForeignKey(() => Article)
  @Column
  article_no!: number;

  @AllowNull(false)
  @Column
  nickname!: string;

  @AllowNull(false)
  @Column
  content!: string;
  
  @AllowNull(false)
  @Column
  reg_date!: Date;
}