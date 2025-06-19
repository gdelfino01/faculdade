import { Router } from 'express';
import { getById, getByCodeNumber, get, create, updateById, deleteById } from '../controllers/anvisa-registers/anvisa-registers-controller';

const anvisaRegisterRouter = Router();

anvisaRegisterRouter.route('/')
    .post(create)
    .get(get);

anvisaRegisterRouter.route('/:id')
    .get(getById)
    .put(updateById)
    .delete(deleteById);

anvisaRegisterRouter.route('/code-number/:codeNumber')
    .get(getByCodeNumber);

export default anvisaRegisterRouter;