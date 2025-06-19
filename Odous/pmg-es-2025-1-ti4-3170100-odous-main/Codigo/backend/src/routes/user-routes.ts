import { Router } from 'express';
import { getById, getByEmail, get, create, updateById, deleteById, login } from '../controllers/users/users-controller';

const userRouter = Router();

userRouter.route('/')
    .post(create)
    .get(get);

userRouter.route('/:id')
    .get(getById)
    .put(updateById)
    .delete(deleteById);

userRouter.route('/email/:email')
    .get(getByEmail);

userRouter.route('/login')
    .post(login);

export default userRouter;