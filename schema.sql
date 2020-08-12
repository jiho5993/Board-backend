create schema real_board;
use real_board;

#---------------------------------------------------------------------------------------------------------------------------------------------------

drop table if exists article;

create table article (
	article_no int auto_increment,
    title varchar(255) not null,
    writer varchar(255) not null,
    content text not null,
    reg_date datetime not null,
    primary key(article_no)
) engine=InnoDB default charset=utf8;

alter table article add view_cnt int not null default 0;

insert into article(title, writer, content, reg_date) values ("title", "writer", "content", now());

select * from article;

select article_no, title, writer, content, reg_date from article where article_no = 1;

#---------------------------------------------------------------------------------------------------------------------------------------------------

drop table if exists user;

create table user (
    userid varchar(100) not null,
    password char(32) not null,
    username varchar(20) not null,
    nickname varchar(20) not null,
    primary key(userid)
) engine=InnoDB default charset=utf8;

insert into user(userid, password, username, nickname) values ("test", "1234", "tester", "ttt");
insert into user(userid, password, username, nickname) values ("ex", "1234", "ex1", "eee");

select * from user;

delete from user;

#---------------------------------------------------------------------------------------------------------------------------------------------------

drop table if exists reply;

create table reply (
	reply_no int auto_increment,
    article_no int,
    nickname varchar(100) not null,
    content text not null,
    reg_date datetime not null,
    primary key(reply_no),
    foreign key(article_no) references article(article_no)
) engine=InnoDB default charset=utf8;

select nickname, content, reg_date from reply where article_no = 2;