import { Router } from 'express';
import { getById, getBySKU, get, create, updateById, deleteById } from '../controllers/semifinished-lots/semifinished-lots-controller';

const semifinishedLotRouter = Router();

semifinishedLotRouter.route('/')
    .post(create)
    .get(get);

semifinishedLotRouter.route('/:id')
    .get(getById)
    .put(updateById)
    .delete(deleteById);

semifinishedLotRouter.route('/sku/:sku')
    .get(getBySKU);

export default semifinishedLotRouter;