import createHttpError from 'http-errors';

// export const validateBody = schema => {
//   return async (req, res, next) => {
//     try {
//       // "!!!!"
//       if (!req.body || typeof req.body !== "object") {
//         const err = createHttpError(400, 'Bad request', { errors: 'Body is empty' });
//         next(err);
//         return;
//       }
//       await schema.validateAsync(req.body, { abortEarly: false }); //   abortEarly: false; - зібрати всі помилки та повернути разом
//       next();
//     } catch (error) {
//       const err = createHttpError(400, 'Bad request', { errors: error.details });
//       next(err);
//     }
//   };
// };
export function validateBody(schema) {
  return async (req, res, next) => {
    console.log('validateBody', req.body);
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (err) {
      const errors = err.details.map(detail => detail.message);
      console.error(err);
      next(createHttpError.BadRequest(errors));
    }
  };
}
