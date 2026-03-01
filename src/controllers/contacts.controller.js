import * as fs from 'node:fs/promises';
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
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import path from 'node:path';

export const getContactsController = async (req, res) => {
  const userId = req.user._id;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  console.log(req.query);
  console.log(page, '|', perPage, '|', sortBy, '|', sortOrder, '|', filter);

  const contacts = await getAllContactsService({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });
  console.log('req.query:', req.query);
  console.log('filter:', filter);
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactByIdService(contactId, req.user._id);

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
  let cloudinaryUrl = null;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.path);
    cloudinaryUrl = result.secure_url;
    console.log('UPLOAD TO CLOUDINARY |', `Cloudinary - ${cloudinaryUrl}`);
    
    await fs.rename(req.file.path, path.resolve('src', 'uploads', 'photo', req.file.filename));
    const localUrl = `http://localhost:3000/photo/${req.file.filename}`;
    console.log('UPLOAD TO DISK |', `Web - ${localUrl}`);
  }

  const data = await createContactService({
    ...req.body,
    photo: cloudinaryUrl,
    userId: req.user._id,
  });

  res.status(201).json({ status: 201, message: 'Successfully created a contact!', data: data });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const payload = { ...req.body };
  
  
  if (req.file) {
    const result = await uploadToCloudinary(req.file.path);
    // добавили новое поле photo
    payload.photo = result.secure_url;
    console.log('UPLOAD TO CLOUDINARY |', `Cloudinary - ${payload.photo}`);
    
    await fs.rename(req.file.path, path.resolve('src', 'uploads', 'photo', req.file.filename));
    const localUrl = `http://localhost:3000/photo/${req.file.filename}`;
    console.log('UPLOAD TO DISK |', `Web - ${localUrl}`);
  }
  
  const contact = await updateContactService(contactId, req.user._id, payload);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteContactService(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).end();
};
