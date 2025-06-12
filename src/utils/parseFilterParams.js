import createHttpError from 'http-errors';

const parseIsFavourite = value => {
  if (typeof value === 'undefined') return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};

export const parseFilterParams = ({ type, isFavourite }) => {
  const filter = {};

  const allowedTypes = ['home', 'work', 'personal'];
  if (typeof type === 'string') {
    if (!allowedTypes.includes(type)) {
      throw createHttpError(400, 'Invalid type value');
    }
    filter.contactType = type;
  }

  const fav = parseIsFavourite(isFavourite);
  if (typeof fav === 'boolean') {
    filter.isFavourite = fav;
  }

  return filter;
};
