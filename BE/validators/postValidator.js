import Joi from 'joi';

const createPostSchema = Joi.object({
  postType: Joi.string().valid('discuss', 'recruitment').required(),
  content: Joi.string().min(5).required(),
  eventId: Joi.number().integer(),
  authorId: Joi.number().integer().required(),
});


export const postValidator = {
    createPost: createPostSchema,
}

