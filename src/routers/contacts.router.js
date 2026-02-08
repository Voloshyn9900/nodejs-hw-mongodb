import { Router } from "express"; 
import {
  getContactsController,
  getContactController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.controller.js';
import { ctrWrapper } from "../utils/ctrWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { contactsSchemaCreate, contactsSchemaUpdate } from "../validation/contacts.schema.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);
router.get('/', ctrWrapper(getContactsController));
router.get('/:contactId', isValidId, ctrWrapper(getContactController));

router.post('/', validateBody(contactsSchemaCreate), ctrWrapper(createContactController)); // Реєстрацію роута в файлі src/routers/contacts.js
router.patch(
  '/:contactId',
  isValidId,
  validateBody(contactsSchemaUpdate),
  ctrWrapper(updateContactController)
);

router.delete('/:contactId', isValidId, ctrWrapper(deleteContactController));

export default router