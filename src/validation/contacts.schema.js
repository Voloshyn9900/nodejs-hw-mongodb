import Joi from "joi";

export const contactsSchemaCreate = Joi.object({
  name: Joi.string().max(25).required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const contactsSchemaUpdate = Joi.object({
  name: Joi.string().max(25),
  phoneNumber: Joi.string(),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});