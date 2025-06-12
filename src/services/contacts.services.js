import { Contact } from '../models/contact.model.js';
import { calcPaginationParams } from '../utils/calcPaginationParams.js';

export const getAllContactsService = async ({ page = 1, perPage = 10 }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;


  const contactQuery = Contact.find();
  const totalContacts = await Contact.find().merge(contactQuery).countDocuments();
  const contacts = await Contact.find().merge(contactQuery).skip(skip).limit(limit).exec(); // повертає всі контакти

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
