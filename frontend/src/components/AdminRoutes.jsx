import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

//Ruta folosita pentru functionalitatile de admin
const AdminRoutes = () => {
    const {userInfo} = useSelector(state => state.auth)  

    return userInfo  && userInfo.isAdmin ? 
    <Outlet /> : 
    <Navigate to='/login' replace/>
}

export default AdminRoutes