import { Router } from 'express';
import { getById, get, create, updateById, deleteById } from '../controllers/finished-production-orders/finished-production-orders-controller';

const finishedProductionOrderRouter = Router();

finishedProductionOrderRouter.route('/')
    .post(create)
    .get(get);

finishedProductionOrderRouter.route('/:id')
    .get(getById)
    .put(updateById)
    .delete(deleteById);

export default finishedProductionOrderRouter;