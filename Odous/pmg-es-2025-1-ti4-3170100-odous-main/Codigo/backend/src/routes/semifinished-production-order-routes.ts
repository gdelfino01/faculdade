import { Router } from 'express';
import { getById, get, create, updateById, deleteById } from '../controllers/semifinished-production-orders/semifinished-production-orders-controller';

const semifinishedProductionOrderRouter = Router();

semifinishedProductionOrderRouter.route('/')
    .post(create)
    .get(get);

semifinishedProductionOrderRouter.route('/:id')
    .get(getById)
    .put(updateById)
    .delete(deleteById);

export default semifinishedProductionOrderRouter;