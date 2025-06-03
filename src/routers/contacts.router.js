import { Router } from "express"; 
import { getContactsController, getContactController ,createContactController} from '../controllers/contacts.controller.js';
import { ctrWrapper } from "../utils/ctrWrapper.js";

const router = Router();

router.get('/', ctrWrapper(getContactsController));
router.get('/:contactId', ctrWrapper(getContactController));

router.post('/',ctrWrapper(createContactController));

export default router