import { Contact } from '../models/contactModel.js';

export const getAllContacts = async () => {
  return await Contact.find(); // повертає всі контакти
};

export const getContactById = async contactId => {
  return await Contact.findById(contactId); // повертає один за id
};
