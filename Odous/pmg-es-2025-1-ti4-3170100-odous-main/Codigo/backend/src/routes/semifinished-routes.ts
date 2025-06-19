import { Router } from 'express';
import { getById, getBySKU, get, create, updateById, deleteById } from '../controllers/semifinisheds/semifinisheds-controller';

const semifinishedRouter = Router();

semifinishedRouter.route('/')
    .post(create)
    .get(get);

semifinishedRouter.route('/:id')
    .get(getById)
    .put(updateById)
    .delete(deleteById);

semifinishedRouter.route('/sku/:sku')
    .get(getBySKU);

export default semifinishedRouter;