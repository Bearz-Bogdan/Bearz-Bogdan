import React from 'react'
import {useState, useEffect} from 'react'
import {Table, Form, Button, Row, Col} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {toast} from 'react-toastify'
import { useProfileMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import {useGetMyOrdersQuery} from '../slices/ordersApiSlice'
import {FaTimes} from 'react-icons/fa'

const ProfileScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('') 
    const [name, setName] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch()  //hook folosit pentru a dispatch-ui actiuni catre store-ul global 
    
    const {userInfo} = useSelector((state) => state.auth) //stocam in userInfo datele despre user-ul logat din state-ul global

    const [updateProfile, {isLoading:loadingUpdateProfile}] = useProfileMutation() //apelam hook-ul useProfileMutation pentru a face update la datele user-ului

    const {data:orders, isLoading, error} = useGetMyOrdersQuery() //apelam hook-ul useGetMyOrdersQuery pentru a face fetch la comenzile user-ului 

    useEffect(()=> {
        if (userInfo) {
            setEmail(userInfo.email)
            setName(userInfo.name)
        }
    }, [userInfo, userInfo.name, userInfo.email])

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Parolele nu se potrivesc')
        } else {
            try {
                const res = await updateProfile({_id:userInfo._id,name, email, password}).unwrap();
                dispatch(setCredentials(res));
                toast.success('Profilul a fost actualizat cu succes')
            } catch (error) {
                toast.error(error.data.message || error.error)
            }
        }
    }

  return (
    <Row>
        <Col md={3}>
            <h2>Profil</h2>

            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-2'>
                    <Form.Label>Nume</Form.Label>
                    <Form.Control 
                        type='name' 
                        placeholder='Introdu numele' 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                </Form.Group>

                <Form.Group controlId='email' className='my-2'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                        type='email' 
                        placeholder='Introdu adresa de email' 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                </Form.Group>

                <Form.Group controlId='password' className='my-2'>
                    <Form.Label>Parola</Form.Label>
                    <Form.Control 
                        type='password' 
                        placeholder='Introdu parola' 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                </Form.Group>

                <Form.Group controlId='confirmPassword' className='my-2'>
                    <Form.Label>Confirma parola</Form.Label>
                    <Form.Control 
                        type='password' 
                        placeholder='Confirma parola' 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary' className='my-2'>
                    Actualizeaza
                </Button>

                {loadingUpdateProfile && <Loader />}

            </Form>
        </Col>

        <Col md={9}>
            <h2>Comenzile mele</h2>

            {isLoading ? <Loader /> : 
            error ? (<Message variant='danger'>{error.data.message || error.error}</Message>) : 
            (
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATA</th>
                            <th>TOTAL</th>
                            <th>PLATIT</th>
                            <th>LIVRAT</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}> 
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0,10)}</td>
                                <td>{order.totalPrice} Lei</td>
                                <td>
                                    {order.isPaid ? (
                                        order.paidAt.substring(0,10)
                                    ) : (
                                        <FaTimes color='red' />
                                    )}
                                </td>
                                <td>
                                    {order.isDelivered ? (
                                        order.deliveredAt.substring(0,10)
                                    ) : (
                                        <FaTimes color='red' />
                                    )}
                                </td>
                                <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button variant='light' className='btn-sm' >Detalii</Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </Table>
            )}
        </Col>
    </Row>
  )
}

export default ProfileScreen