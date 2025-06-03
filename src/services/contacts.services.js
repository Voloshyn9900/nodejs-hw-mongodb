import { Contact } from '../models/contact.model.js';

export const getAllContactsService = async () => {
  return await Contact.find(); // повертає всі контакти
};

export const getContactByIdService = async contactId => {
  return await Contact.findById(contactId); // повертає один за id
};

export const createContactService = async (payload) => {
  return await Contact.create(payload);
};

export const updateContactService = async (contactId, payload) => {
  const result = await Contact.findByIdAndUpdate(contactId, payload, { new: true });
  console.log(result, 'contacts.services');

  return result
};

export const deleteContactService = async contactId => {
  return await Contact.findByIdAndDelete(contactId);
};