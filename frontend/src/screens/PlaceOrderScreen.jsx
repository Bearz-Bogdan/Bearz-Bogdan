import React from 'react'
import { useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {Button, Row, Col, ListGroup, Image, Card, ListGroupItem} from 'react-bootstrap'
import {toast} from 'react-toastify';
import CheckOutSteps from '../components/CheckOutSteps'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {useCreateOrderMutation} from '../slices/ordersApiSlice'
import { clearCartItems } from '../slices/cartSlice'


const PlaceOrderScreen = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);

    const [createOrder, {isLoading, error}] = useCreateOrderMutation()

    useEffect(() => {
        if(!cart.shippingAddress.address){
            navigate('/shipping')
        } else if(!cart.paymentMethod){
            navigate('/payment') 
        }
    },[cart.paymentMethod, cart.shippingAddress.address, navigate])

    const placeOrderHandler = async () => {
        try {
            const res= await createOrder({
                orderItems: cart.cartItems,     
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
         }).unwrap();
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (error) {
            toast.error(error)
        }
    }

  return (
    <>
    <CheckOutSteps step1 step2 step3 step4 />
    <Row>
        <Col md={8}>
            <ListGroup variant='flush'>
                <ListGroupItem>
                    <h2>Livrare</h2>
                    <p>
                        <strong>Adresa:</strong>
                        {cart.shippingAddress.address}, 
                        {cart.shippingAddress.city}, 
                        {cart.shippingAddress.postalCode}, 
                        {cart.shippingAddress.country}
                    </p>
                </ListGroupItem>

                <ListGroupItem>
                    <h2>Metoda de plata</h2>
                    <strong>Metoda: </strong>
                    {cart.paymentMethod}
                </ListGroupItem>

                <ListGroup.Item>
                    <h2>Produse</h2>
                    {cart.cartItems.length === 0 ? (
                        <Message> Cosul tau este gol</Message>
                    ) : (
                        <ListGroup variant='flush'>
                            {cart.cartItems.map((item, index) => (
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={1}>
                                            <Image src={item.image} alt={item.name} fluid rounded />
                                        </Col>
                                        <Col>
                                            <Link to={`/product/${item._id}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={4}>
                                        {item.qty} x {item.price} Lei = {(item.qty * item.price).toFixed(2)} Lei
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </ListGroup.Item>

            </ListGroup>
        </Col>
        <Col md={4}>
            <Card>
                <ListGroup variant='flush'>

                    <ListGroup.Item>
                        <h2>Comanda</h2>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Produse</Col>
                            <Col>{cart.itemsPrice} Lei</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Livrare</Col>
                            <Col>{cart.shippingPrice} Lei</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Taxe</Col>
                            <Col>{cart.taxPrice} Lei</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Total</Col>
                            <Col>{cart.totalPrice} Lei</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        {error && <Message variant='danger'>{error.data.message}</Message>} 
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Button 
                            type='button' 
                            className='btn-block' 
                            disabled={cart.cartItems === 0}
                            onClick={placeOrderHandler}
                        >
                            Plaseaza comanda
                        </Button>

                        {isLoading && <Loader />}

                    </ListGroup.Item>
                </ListGroup>
            </Card>           
        </Col>
    </Row>
    </>
  )
}

export default PlaceOrderScreen