import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';


//@desc Fetch all products
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 8;  //numarul de produse pe pagina
    const page = Number(req.query.pageNumber) || 1; //numarul de pagini, din query-ul de request, sau 1 daca nu exista 

    const keyword = req.query.keyword ? {name: { $regex: req.query.keyword, $options: 'i' }} : {}; //cautarea produselor dupa nume

    const count = await Product.countDocuments({...keyword}); //produsele care corespund cautarii

    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1)); //produsele de pe pagina curenta
    res.json({products, page, pages: Math.ceil(count / pageSize)}); //returneaza produsele de pe pagina curenta, numarul paginii si numarul total de pagini
});

//@desc Fetch single product
//@route GET /api/products/:id
//@access Public
const getProductsById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

//@desc Create a new product
//@route POST /api/products
//@access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    })

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

//@desc Update a product
//@route PUT /api/products/:id
//@access Private/Admin 
const updateProduct = asyncHandler(async (req, res) => {
    const {name, price, description, image, brand, category, countInStock} = req.body; //datele produsului care urmeaza sa fie actualizat

    const product = await Product.findById(req.params.id); //produsul care urmeaza sa fie actualizat

    if(product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save(); 
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

//@desc Delete a product
//@route DELETE /api/products/:id
//@access Private/Admin 
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(product) {
      await product.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

//@desc Create a new reviews
//@route POST /api/products/:id
//@access Private
const createProductReview = asyncHandler(async (req, res) => {

    const { rating, comment } = req.body; //datele review-ului care urmeaza sa fie adaugat

    const product = await Product.findById(req.params.id);

    if(product) {
     const alreadyReviewed = product.reviews.find
     (review => review.user.toString() === req.user._id.toString());
    

    if(alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed');
    }

    const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id
    }

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

//@desc Get top rated products
//@route GET /api/products/top
//@access Public
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({rating: -1}).limit(3);

    res.status(200).json(products);
});

export { 
    getProducts, 
    getProductsById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    createProductReview,
    getTopProducts};