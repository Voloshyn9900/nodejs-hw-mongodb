export const ctrWrapper = controller => {
  const fn = async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return fn;
};

// export const ctrWrapper = controller => {
//   return async (req, res, next) => {
//     try {
//       await controller(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   };
// };
