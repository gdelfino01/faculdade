import { Router } from 'express';
import { getById, get, create, updateById, deleteById } from '../controllers/semifinished-families/semifinished-families-controller';

const semifinishedFamilyRouter = Router();

semifinishedFamilyRouter.route('/')
    .post(create)
    .get(get);

semifinishedFamilyRouter.route('/:id')
    .get(getById)
    .put(updateById)
    .delete(deleteById);

export default semifinishedFamilyRouter;