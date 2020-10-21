var moment = require("moment");
const { Reply } = require('../../../models');

/*
  POST /api/reply/write
  {
    id,
    nickname,
    content
  }
 */
exports.write = async (req, res) => {
  const { id, nickname, content } = req.body;
  const reg_date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

  try {
    await Reply.create({
      article_no: id,
      nickname,
      content,
      reg_date
    });
    res.status(201).json({ success: 1 });
  } catch(err) {
    res.status(400).json({
      success: 0,
      error: err,
    });
  }
};

/*
  GET /api/reply/list/:id
 */
exports.list = async (req, res) => {
  const id = req.params.id;

  try {
    const reply = await Reply.findAll({ where: { article_no: id } });
    const count = await Reply.count({ where: { article_no: id } })
    res.json({
      success: 1,
      count,
      reply,
    });
  } catch(err) {
    res.status(400).json({
      success: 0,
      error: err
    });
  }
};

/*
  GET /api/reply/get-reply/:id
*/
exports.getOneReply = async (req, res) => {
  const id = req.params.id;

  try {
    const reply = await Reply.findOne({ where: { reply_no: id } });
    res.json({ content: reply.content });
  } catch(err) {
    res.status(400).json({
      success: 0,
      error: err
    });
  }
};

/*
  DELETE /api/reply/delete/:id
 */
exports.deleteReply = async (req, res) => {
  const id = req.params.id;

  try {
    await Reply.destroy({ where: { reply_no: id } });
    res.status(204).json({ success: 1 });
  } catch(err) {
    res.status(400).json({
      success: 0,
      error: err
    });
  }
};

/*
  PUT /api/reply/modify
  {
    reply_no
    content
  }
 */
exports.modifyReply = async (req, res) => {
  const { reply_no, content } = req.body;

  try {
    await Reply.update({ content }, { where: { reply_no } });
    res.status(201).json({ success: 1 });
  } catch(err) {
    res.status(400).json({
      success: 0,
      error: err
    });
  }
};
