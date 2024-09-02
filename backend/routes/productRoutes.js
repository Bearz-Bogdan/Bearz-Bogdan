import express from 'express'; 
import {getProducts, getProductsById, createProduct, updateProduct, deleteProduct, createProductReview, getTopProducts} from '../controllers/productController.js';
import {protect, admin} from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';
const router = express.Router();


router.route('/').get(getProducts); //ruta pentru obtinerea produselor prin apelarea functiei getProducts(controller)
router.route('/top').get(getTopProducts); //ruta pentru obtinerea produselor top(3) dupa rating prin apelarea functiei getTopProducts(controller)
router.route('/:id').get(checkObjectId, getProductsById); //ruta pentru obtinerea unui produs dupa id prin apelarea functiei getProductsById(controller)
router.route('/').post(protect, admin, createProduct); //ruta pentru crearea unui produs prin apelarea functiei createProduct(controller)
router.route('/:id').put(protect, admin, checkObjectId, updateProduct); //ruta pentru actualizarea unui produs dupa id prin apelarea functiei updateProduct(controller)
router.route('/:id').delete(protect, admin, checkObjectId, deleteProduct); //ruta pentru stergerea unui produs dupa id prin apelarea functiei deleteProduct(controller)
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview); //ruta pentru crearea unei recenzii la un produs prin apelarea functiei createProductReview(controller)
export default router;