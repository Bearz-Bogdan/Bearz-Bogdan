import React from 'react';
import Header from "./components/Header";
import Footer from './components/Footer';
import {ToastContainer} from 'react-toastify'; //react-toastify pentru notificari (notificari care apar in partea de jos a paginii)
import 'react-toastify/dist/ReactToastify.css'; //css pentru notificari
import { Outlet } from 'react-router-dom';
import {Container} from "react-bootstrap";

const App = () => {
  return (
    <>
    <Header />
      <main className='py-3'>
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  )
}

export default App