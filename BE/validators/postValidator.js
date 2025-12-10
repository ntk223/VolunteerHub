import Joi from 'joi';

const createPostSchema = Joi.object({
  postType: Joi.string().valid('discuss', 'recruitment').required(),
  content: Joi.string().min(5).required(),
  eventId: Joi.number().integer().allow(null),
  authorId: Joi.number().integer().required(),
  media: Joi.array().items(Joi.string().uri()),
});


export const postValidator = {
    createPost: createPostSchema,
}

