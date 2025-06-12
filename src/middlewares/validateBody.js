import createHttpError from "http-errors";

export const validateBody = schema => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false }); //   abortEarly: false; - зібрати всі помилки та повернути разом
      next();
    } catch (error) {
        const err = createHttpError(400, 'Bad request', { errors: error.details });
        next(err)
    }
  };
};
