import { Router } from 'express';
import { getById, getBySKU, get, create, updateById, deleteById } from '../controllers/materials/materials-controller';

const materialRouter = Router();

materialRouter.route('/')
    .post(create)
    .get(get);

materialRouter.route('/:id')
    .get(getById)
    .put(updateById)
    .delete(deleteById);

materialRouter.route('/sku/:sku')
    .get(getBySKU);

export default materialRouter;