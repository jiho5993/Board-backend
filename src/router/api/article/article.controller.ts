import moment from 'moment';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Article } from '../../../model/Article';
import { Reply } from '../../../model/Reply';
import { sequelize } from '../../../sequelize';

/*
  GET /api/article/count
 */
export const getCount = async (req: Request, res: Response) => {
  try {
    const count = await Article.count();
    res.json({
      success: 1,
      count,
    });
  } catch(err) {
    res.status(400).json({ error: err });
  }
};

/*
  GET /api/article/list?page=?
 */
export const getList = async (req: Request, res: Response) => {
  let { page }: any = req.query;

  try {
    const article = await Article.findAll({
      offset: (page-1)*15,
      limit: 15,
      order: [
        ['article_no', 'DESC']
      ]
    });
    res.json(article);
  } catch(err) {
    res.status(400).json({ error: err });
  }
};

/*
  GET /api/article/read/:id
 */
export const getArticle = async (req: Request, res: Response) => {
  const articleNo = req.params.id;
  let transaction = null;

  try {
    transaction = await sequelize.transaction();
    const article: any = await Article.findOne({
      where: {
        article_no: articleNo
      },
      transaction
    });
    const { view_cnt } = article.dataValues;
    await Article.update({
      view_cnt: view_cnt + 1
    }, {
      where: {
        article_no: articleNo
      },
      transaction
    });
    transaction.commit();
    res.json(article);
  } catch(err) {
    transaction!.rollback();
    res.status(400).json({ error: err });
  }
};

/*
  POST /api/article/write
  {
    title,
    writer,
    content
  }
 */
export const writeArticle = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const writer = req.decoded.uid;
  const reg_date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

  try {
    await Article.create({ title, writer, content, reg_date });
    res.status(201).json({ success: true });
  } catch(err) {
    res.status(400).json({ error: err });
  }
};

/*
  PUT /api/article/modify/:id
  {
    title,
    content
  }
 */
export const modifyArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const reg_date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

  try {
    await Article.update({ title, content, reg_date }, { where: { article_no: id } });
    res.status(201).json({ success: 1 });
  } catch(err) {
    res.status(400).json({
      success: 0,
      error: err
    });
  }
};

/*
  DELETE /api/article/delete?id=?
 */
export const deleteArticle = async (req: Request, res: Response) => {
  const id: number = +req.query.id!;
  const { uid } = req.decoded;
  let transaction = null;

  try {
    transaction = await sequelize.transaction();

    const article: Article | null = await Article.findOne({ where: { article_no: id } });
    if(uid !== article?.writer) throw "삭제할 권한이 없습니다.";

    await Reply.destroy({
      where: {
        article_no: id
      },
      transaction
    });
    await article?.destroy({ transaction });
    
    transaction.commit();
    res.status(204).send();
  } catch(err) {
    transaction!.rollback();
    res.status(400).json({
      success: false,
      error: err
    });
  }
};

/*
  GET /api/article/search?type=?&keyword=?
 */
export const search = async (req: Request, res: Response) => {
  const { type, keyword }: any = req.query;
  console.log(type, keyword);
  const new_keyword = "%" + keyword + "%";

  try {
    let article = {};
    if(type === "everything") {
      article = await Article.findAll({
        where: {
          [Op.or]: [{
            title: {
              [Op.like]: new_keyword
            }
          }, {
            writer: {
              [Op.like]: new_keyword
            }
          }, {
            content: {
              [Op.like]: new_keyword
            }
          }]
        },
        order: [
          ['article_no', 'DESC']
        ]
      });
    } else {
      const cond: any = {};
      cond[type] = { [Op.like]: new_keyword };
      article = await Article.findAll({ where: cond });
    }
    res.json({ success: 1, article });
  } catch(err) {
    res.status(400).json({ success: 0, error: err });
  }
};