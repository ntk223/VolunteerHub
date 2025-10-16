import Joi from 'joi';

const createPostSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  post_type: Joi.string().valid('discuss', 'recruitment').required(),
  content: Joi.string().min(10).required(),
  event_id: Joi.number().integer().required(),
  author_id: Joi.number().integer().required(),
});


export const postValidator = {
    createPost: createPostSchema,
}

