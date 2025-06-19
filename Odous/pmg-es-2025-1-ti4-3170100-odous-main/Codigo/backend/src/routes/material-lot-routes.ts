import { Router } from 'express';
import { getById, get, create, updateById, deleteById } from '../controllers/material-lots/material-lots-controller';

const materialLotRouter = Router();

materialLotRouter.route('/')
    .post(create)
    .get(get);

materialLotRouter.route('/:id')
    .get(getById)
    .put(updateById)
    .delete(deleteById);

export default materialLotRouter;