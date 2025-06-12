import createHttpError from 'http-errors';
import {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  updateContactService,
  deleteContactService,
} from '../services/contacts.services.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getContactsController = async (req, res) => {
  console.log(req.query);
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const contacts = await getAllContactsService({ page, perPage, sortBy, sortOrder });

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

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  console.log("req.params", req.params);
  console.log(contactId);
  const contact = await updateContactService(contactId, req.body);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
}

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteContactService(contactId, req.body);


  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).end();
};