import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Ruta care verifica daca userul este logat sau nu, iar daca nu este logat, il redirectioneaza catre pagina de login
const PrivateRoutes = () => {
    const {userInfo} = useSelector(state => state.auth)  

    return userInfo ? <Outlet /> : <Navigate to='/login' replace/>
}

export default PrivateRoutes