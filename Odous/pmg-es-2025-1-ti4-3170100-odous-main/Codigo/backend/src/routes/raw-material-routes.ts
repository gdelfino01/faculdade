import { Router } from 'express';
import { getById, get, create, updateById, deleteById } from '../controllers/raw-materials/raw-materials-controller';

const rawMaterialRouter = Router();

rawMaterialRouter.route('/')
    .post(create)
    .get(get);

rawMaterialRouter.route('/:id')
    .get(getById)
    .put(updateById)
    .delete(deleteById);

export default rawMaterialRouter;