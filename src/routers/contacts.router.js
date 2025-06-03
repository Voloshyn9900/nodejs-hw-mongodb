import { Router } from "express"; 
import {
  getContactsController,
  getContactController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.controller.js';
import { ctrWrapper } from "../utils/ctrWrapper.js";

const router = Router();

router.get('/', ctrWrapper(getContactsController));
router.get('/:contactId', ctrWrapper(getContactController));

router.post('/', ctrWrapper(createContactController)); // Реєстрацію роута в файлі src/routers/contacts.js
router.patch('/:contactId', ctrWrapper(updateContactController));

router.delete('/:contactId', ctrWrapper(deleteContactController));

export default router