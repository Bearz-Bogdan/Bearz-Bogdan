import jwt from 'jsonwebtoken';

const generateToken = (res,userId) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET, {expiresIn: '30d'});  //genereaza un token care expira in 30 de zile

        //Setam HTTP-Only cookie-ul cu tokenul generat
        res.cookie('jwt', token,{  //setarea cookie-ului cu numele jwt si valoarea token generat de jwt.sign
            httpOnly: true,  //cookie-ul nu poate fi accesat de JS din browser
            secure: process.env.NODE_ENV !== 'development', //daca suntem in productie, cookie-ul va fi accesat doar prin HTTPS
            sameSite: 'strict', //cookie-ul nu poate fi accesat de pe alte site-uri
            maxAge:30*24*60*60*1000 //30 de zile
        })
}

export default generateToken;