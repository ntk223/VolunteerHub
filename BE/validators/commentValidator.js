import Joi from 'joi';

const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
  author_id: Joi.number().integer().required(),
  post_id: Joi.number().integer().required(),
});


export const commentValidator = {
  createComment: createCommentSchema,
};