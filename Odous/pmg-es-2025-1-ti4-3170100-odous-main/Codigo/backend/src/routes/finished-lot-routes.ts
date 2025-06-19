import { Router } from 'express';
import { getById, getBySKU, get, create, updateById, deleteById } from '../controllers/finished-lots/finished-lots-controller';

const finishedLotRouter = Router();

finishedLotRouter.route('/')
    .post(create)
    .get(get);

finishedLotRouter.route('/:id')
    .get(getById)
    .put(updateById)
    .delete(deleteById);

finishedLotRouter.route('/sku/:sku')
    .get(getBySKU);

export default finishedLotRouter;