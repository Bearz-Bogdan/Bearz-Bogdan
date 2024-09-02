import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

//Protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    //Citim JWT-ul din cookie
    token = req.cookies.jwt; 

    if(token)
        {
            try
                {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
                    req.user = await User.findById(decoded.userId).select('-password'); //setam request-ul cu user-ul gasit din token si eliminam parola din raspuns, 
                                                                                        //ca sa il pot apela in toate rutele de users
                    next(); //trece la urmatorul middleware
                }
            catch(error)
                {
                    console.error(error);
                    res.status(401);
                    throw new Error('Not authorized, token failed');
                }
        }   
    else
        {
            res.status(401);
            throw new Error('Not authorized, no token');
        }
});

//Admin middleware

const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin)    //daca user-ul este admin
        { 
            next(); 
        }
    else
        {
            res.status(401);
            throw new Error('Not authorized as an admin');
        }
};

export {protect, admin};  