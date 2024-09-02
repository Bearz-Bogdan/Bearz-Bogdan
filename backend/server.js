import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from "./config/db.js";
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js'; 
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import cookieParser from 'cookie-parser';

connectDB(); //Connect to MongoDB

const port=process.env.PORT || 5000;

const app = express(); 

//Body parser middleware
app.use(express.json());
app.use (express.urlencoded({extended: true})); 

app.use(cookieParser()); //middleware pentru a putea folosi cookie-urile
 
app.get('/', (req, res) => { //http://localhost:5000
    res.send('Server is ready'); 
});

app.use('/api/products', productRoutes); //rutele pentru produse http://localhost:5000/api/products
app.use ('/api/users', userRoutes); //rutele pentru useri http://localhost:5000/api/users
app.use ('/api/orders', orderRoutes); //rutele pentru comenzi http://localhost:5000/api/orders
app.use('/api/upload', uploadRoutes); //ruta pentru upload de imagini http://localhost:5000/api/upload

app.get ('/api/config/paypal', (req, res) => res.send({ clientId:process.env.PAYPAL_CLIENT_ID})); //ruta pentru clientul paypal

const __dirname = path.resolve(); //pentru a obtine calea absoluta a directorului curent
app.use('/uploads', express.static(path.join(__dirname, '/uploads'))); //face folderul uploads static pentru a putea fi accesat

app.use(notFound); 
app.use(errorHandler); 

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
