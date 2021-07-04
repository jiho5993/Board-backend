import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AllowNull
} from 'sequelize-typescript';

@Table({ freezeTableName: true })
export class User extends Model<User> {
  @PrimaryKey
  @Column
  userid!: string;

  @AllowNull(false)
  @Column
  password?: string;

  @AllowNull(false)
  @Column
  username!: string;

  @AllowNull(false)
  @Column
  nickname!: string;

  @AllowNull(true)
  @Column
  token?: string;
}