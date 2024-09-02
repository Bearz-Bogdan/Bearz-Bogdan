import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

//schema pentru a crea un nou user in baza de date
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
},{timestamps:true});

userSchema.methods.matchPassword = async function(enteredPassword){  //metoda pentru a compara parola introdusa cu parola din baza de date
    return await bcrypt.compare(enteredPassword, this.password); 
}

userSchema.pre('save', async function(next){ //middleware pentru a cripta parola inainte de a o salva in baza de date
    if(!this.isModified('password')) //daca parola nu a fost modificata, trecem la urmatorul middleware
        {
            next();
        }
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt); //criptam parola
})

const User = mongoose.model('User', userSchema);

export default User;