import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB(); //conectarea la baza de date

//script pentru inserarea tuturor datelor din fisierele users.js si products.js in baza de date

const importData = async () => { //functie pentru importarea datelor
    try {
        await Order.deleteMany(); 
        await Product.deleteMany(); 
        await User.deleteMany();

        const createdUsers = await User.insertMany(users); //inserarea userilor in baza de date cu ajutorul functiei insertMany  

        const adminUser = createdUsers[0]._id;  //primul user este admin

        const sampleProducts = products.map((product) => { //variabila care stocheaza toate produsele, fiecare produs va avea user-ul admin asociat
            return { ...product, user: adminUser }; //returneaza un obiect cu toate proprietatile produsului si user-ul admin asociat
        });

        await Product.insertMany(sampleProducts); //inserarea produselor in baza de date

        console.log("Data Imported!".green.inverse); //mesaj de succes
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse); //mesaj de eroare
        process.exit(1);
    }
}

const destroyData = async () => { //functie pentru stergerea datelor
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log("Data Destroyed!".red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
}

if(process.argv[2] === "-d"){ //daca se ruleaza scriptul cu argumentul -d(data:destroy), se sterg datele
    destroyData();
}else{
    importData();       //altfel, se importa datele(data:import)
 } 