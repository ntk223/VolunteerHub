import Joi from 'joi';

const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
  authorId: Joi.number().integer().required(),
  postId: Joi.number().integer().required(),
});


export const commentValidator = {
  createComment: createCommentSchema,
};