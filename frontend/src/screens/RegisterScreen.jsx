import React from 'react'
import {Form, Button, Row, Col} from 'react-bootstrap'
import {useState, useEffect} from 'react'//useEffect pentru a redirectiona catre alta pagina, useState pentru a gestiona starea componentei
import {Link, useLocation, useNavigate} from 'react-router-dom'//useNavigate pentru a naviga la alta pagina, useLocation pentru a accesa locatia curenta, Link pentru a crea link-uri
import {useDispatch, useSelector} from 'react-redux'//useDispatch pentru a dispatcha actiuni, iar useSelector pentru a selecta date din store (din state-ul global)
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import { useRegisterMutation } from '../slices/usersApiSlice'//importam useLoginMutation din usersApiSlice pentru a face request-ul catre server pentru a face login 
import {setCredentials} from '../slices/authSlice'//importam actiunea setCredentials din authSlice pentru a seta credentialele in store (in state-ul global) dupa ce facem login
import {toast} from 'react-toastify'//importam toast pentru a afisa mesaje de eroare

const RegisterScreen = () => {

    const [email, setEmail] = useState('')      //email si password sunt stari ale componentei, initializate cu ''
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [register, {isLoading}] = useRegisterMutation()      //login este o functie care face request-ul catre server pentru a face login, isLoading este un boolean care ne spune daca request-ul este in curs de desfasurare

    const {userInfo} = useSelector((state)=>state.auth)     //extragem userInfo din state-ul global

    const {search} = useLocation()      //extragem search din locatie (din URL)
    const sp = new URLSearchParams(search)      //creem un obiect URLSearchParams cu search-ul
    const redirect = sp.get('redirect') || '/'      //extragem redirect din search, daca nu exista redirect, atunci redirect este '/'

        useEffect(()=>{     
            if(userInfo){            //daca userInfo exista, atunci navigam catre redirect
                navigate(redirect) 
            }    
        }, [userInfo,redirect, navigate])

    const submitHandler = async(e) => {
        e.preventDefault();
        if(password !== confirmPassword)
        {
            toast.error('Parolele nu coincid')
            return
        }
        else
        {
            try
            {
                const res = await register({name, email, password}).unwrap()      //apelam functia login cu email si password, unwrap ne da raspunsul request-ului 
                dispatch(setCredentials({...res}));     //dispatcham actiunea setCredentials cu datele primite in raspunsul request-ului
                navigate(redirect)
            }
            catch(error)
            {
                toast.error(error?.data?.message||error.message)//afisam un mesaj de eroare
            }
        }
    }

  return (  
    <FormContainer>
        <h1>Inregistreaza-te</h1>

        <Form onSubmit={submitHandler}>

            <Form.Group controlId='name' className='my-3'>
                <Form.Label>Nume</Form.Label>
                <Form.Control type='text' value={name} onChange={(e)=>setName(e.target.value)} >
                </Form.Control>
            </Form.Group>

            <Form.Group controlId='email' className='my-3'>
                <Form.Label>Introdu adresa de email</Form.Label>
                <Form.Control type='email' value={email} onChange={(e)=>setEmail(e.target.value)} >
                </Form.Control>
            </Form.Group>

            <Form.Group controlId='password' className='my-3'>
                <Form.Label>Parola</Form.Label>
                <Form.Control type='password' value={password} onChange={(e)=>setPassword(e.target.value)} >
                </Form.Control>
            </Form.Group>

            <Form.Group controlId='confirmPassword' className='my-3'>
                <Form.Label>Confirma parola</Form.Label>
                <Form.Control type='password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} >
                </Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className='mt-2' disabled={isLoading}>
                Inregistreaza-te
            </Button>
 
            {isLoading && <Loader/>}  

        </Form>

        <Row className='py-3'>
            <Col>
                Ai deja un cont? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Logheaza-te</Link>
            </Col>
        </Row>
    </FormContainer>
  )
}

export default RegisterScreen