import Joi from 'joi';

const createEventSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().allow(null, ''),
  location: Joi.string().min(3).max(255).required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().greater(Joi.ref('startTime')).required(),
  capacity: Joi.number().min(1).required(),
  categoryId: Joi.number().integer().required(),
  managerId: Joi.number().integer().required(),
});

const createEventUpdateSchema = Joi.object({
  title: Joi.string().min(3).max(255),
  description: Joi.string().allow(null, ''),
  location: Joi.string().min(3).max(255),
  startTime: Joi.date(),
  endTime: Joi.date().greater(Joi.ref('startTime')),
  capacity: Joi.number().min(1),
  // categoryId: Joi.number().integer(),
  // managerId: Joi.number().integer(),
});


export const eventValidator = {
  createEvent: createEventSchema,
  updateEvent: createEventUpdateSchema,
};