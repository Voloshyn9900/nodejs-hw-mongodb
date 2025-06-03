import createHttpError from 'http-errors';
import {
  getAllContactsService,
  getContactByIdService,
  createContactService,
} from '../services/contacts.services.js';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContactsService();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactByIdService(contactId);

  if (!contact) {
    // return res.status(404).json({ message: 'Contact not found' });

    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const data = await createContactService(req.body);

  res.status(201).json({ status: 201, message: 'Successfully created a contact!', data: data });
};
