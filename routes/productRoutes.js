import  express  from "express";
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";
import { braintreePaymentsController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountCotroller, productFiltersController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController,  } from "../controller/productController.js";
import formidable from "express-formidable";

const router = express.Router();

// routes
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController);
router.get('/get-product',getProductController);
router.get('/get-product/:slug',getSingleProductController);
router.get('/product-photo/:pid',productPhotoController);
router.delete('/delete-product/:pid',deleteProductController);
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController);

//filter product
router.post('/product-filters',productFiltersController);

// product count 
router.get('/product-count',productCountCotroller);

// product per page
router.get('/product-list/:page',productListController);

// search product
router.get('/search/:keyword' , searchProductController);

// similar products
router.get('/related-product/:pid/:cid', relatedProductController);

//category wise product
router.get('/product-category/:slug',productCategoryController);

// payments routes
//token
router.get('/braintree/token',braintreeTokenController);

// payments
router.post('/braintree/payment',requireSignIn,braintreePaymentsController);


export default router


