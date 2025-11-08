import Joi from 'joi';

const createPostSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  postType: Joi.string().valid('discuss', 'recruitment').required(),
  content: Joi.string().min(10).required(),
  eventId: Joi.number().integer(),
  authorId: Joi.number().integer().required(),
});


export const postValidator = {
    createPost: createPostSchema,
}

