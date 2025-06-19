import { Router } from 'express';
import { getById, getBySKU, get, create, updateById, deleteById } from '../controllers/finisheds/finisheds-controller';

const finishedRouter = Router();

finishedRouter.route('/')
    .post(create)
    .get(get);

finishedRouter.route('/:id')
    .get(getById)
    .put(updateById)
    .delete(deleteById);

finishedRouter.route('/sku/:sku')
    .get(getBySKU);

export default finishedRouter;