import { Contact } from '../models/contact.model.js';
import { calcPaginationParams } from '../utils/calcPaginationParams.js';

export const getAllContactsService = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactQuery = Contact.find(filter).sort({ [sortBy]: sortOrder });
  const totalContacts = await Contact.countDocuments(filter); // .merge(contactQuery)
  const contacts = await contactQuery.skip(skip).limit(limit).exec(); // повертає всі контакти



  // const [total, students] = await Promise.all([
  //   Student.countDocuments(studentQuery),
  //   studentQuery
  //     .sort({ [sortBy]: sortOrder })
  //     .skip(skip)
  //     .limit(perPage),
  // ]);

  const paginationData = calcPaginationParams(totalContacts, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactByIdService = async contactId => {
  return await Contact.findById(contactId); // повертає один за id
};

export const createContactService = async payload => {
  return await Contact.create(payload);
};

export const updateContactService = async (contactId, payload) => {
  const result = await Contact.findByIdAndUpdate(contactId, payload, { new: true });
  console.log(result, 'contacts.services');

  return result;
};

export const deleteContactService = async contactId => {
  return await Contact.findByIdAndDelete(contactId);
};
