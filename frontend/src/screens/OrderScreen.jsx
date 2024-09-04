import {Link, useParams} from 'react-router-dom';
import {useEffect} from 'react';
import {Button, Row, Col, ListGroup, Image, Card} from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {toast} from 'react-toastify';
import { useSelector } from 'react-redux';
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPaypalClientIdQuery, useDeliverOrderMutation } from '../slices/ordersApiSlice';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

const OrderScreen = () => {
  
    const {id:orderId} = useParams();

    const {data:order, refetch, isLoading, error} = useGetOrderDetailsQuery(orderId);

    const [payOrder, {isLoading:loadingPay}] = usePayOrderMutation();

    const [{isPending}, paypalDispatch] = usePayPalScriptReducer();

    const {data:paypal, isLoading:loadingPayPal, error:errorPayPal} = useGetPaypalClientIdQuery();

    const [deliverOrder, {isLoading:loadingDeliver}] = useDeliverOrderMutation();

    const userInfo= useSelector((state) => state.auth);

    useEffect(() => {
        if(!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPayPalScript =  () => {
                paypalDispatch({
                    type: 'resetOptions', 
                    value: {
                        'client-id': paypal.clientId,
                        currency: 'USD'
                    }
            })
            paypalDispatch({ type: 'setLoadingStatus', value: 'pending'})
            }   
            if(order && !order.isPaid) {
                if(!window.paypal) {
                    loadPayPalScript();
                } else {
                    paypalDispatch({type: 'resetOptions', value: 'pending'})
                }
            }
        }
    }, [order, paypal, paypalDispatch, errorPayPal, loadingPayPal]);

    function onApprove(data, actions){
        return actions.order.capture().then(async function (details) {
            try {
                await payOrder({orderId, details});
                refetch();//refetch la comanda pentru a actualiza statusul platii
                toast.success('Comanda a fost platita cu succes');
            } catch (error) {
                toast.error(error?.data?.message || error.message);
            }
    });
}
    // async function onApproveTest(){
    //     await payOrder({orderId, details:{payer:{}}});
    //     refetch();//refetch la comanda pentru a actualiza statusul platii
    //     toast.success('Comanda a fost platita cu succes');
    // }

    function onError(error){
        toast.error(error.message);
    }

    function createOrder(data, actions){
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice
                    },
                },
            ],
    })
    .then((orderID) => {
        return orderID;
    })
}

    const deliverOrderHandler = async () => {
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success('Comanda a fost marcata ca expediat');
        } catch (error) {
            toast.error(error?.data?.message || error.message);
        }
    }

    return (
     
        isLoading ? <Loader /> : error ? <Message variant='danger'>{error?.data?.message || error.error}</Message> : (
            <>
                <h1>Comanda {orderId}</h1>
                <Row>
                    <Col md={8}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Livrare</h2>
                                <p>
                                    <strong>Nume :</strong> {order.user.name}
                                </p>
                                <p>
                                    <strong>Email: </strong>{order.user.email}
                                </p>
                                <p>
                                    <strong>Adresa: </strong>
                                    {order.shippingAddress.address}, 
                                    {order.shippingAddress.city}, 
                                    {order.shippingAddress.postalCode}, 
                                    {order.shippingAddress.country}
                                </p>
                                {order.isDelivered ? <Message variant='success'>Livrata la {order.deliveredAt}</Message>
                                                     : <Message variant='danger'>Neexpediata</Message>}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Metoda de plata</h2>
                                <p>
                                    <strong>Metoda: </strong>
                                    {order.paymentMethod}
                                </p>
                                {order.isPaid ? <Message variant='success'>Platita la {order.paidAt}</Message>
                                                     : <Message variant='danger'>Nu a fost platita</Message>}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Produse comandate</h2>
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col>
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} x {item.price} = {item.qty * item.price}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup.Item>

                        </ListGroup>
                    </Col>

                    <Col md={4}>
                        <Card>
                            <ListGroup>
                                <ListGroup.Item>
                                    <h2>Comanda</h2>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Produse</Col>
                                        <Col>{order.itemsPrice}</Col>
                                    </Row>

                                    <Row>
                                        <Col>Livrare</Col>
                                        <Col>{order.shippingPrice}</Col>
                                    </Row>

                                    <Row>
                                        <Col>Taxe</Col>
                                        <Col>{order.taxPrice}</Col>
                                    </Row>

                                    <Row>
                                        <Col>Total</Col>
                                        <Col>{order.totalPrice}</Col>
                                    </Row>

                                </ListGroup.Item>

                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {loadingPay && <Loader />}

                                        {isPending ? <Loader /> :(
                                            <div>
                                                {/* <Button onClick={onApproveTest} style={{marginBottom:'10px'}}>
                                                    Test Pay Order
                                                </Button> */}
                                                <div>
                                                    <PayPalButtons 
                                                                   createOrder={createOrder} 
                                                                   onApprove={onApprove} 
                                                                   onError={onError}>
                                                    </PayPalButtons>
                                                </div>
                                            </div>
                                        )}
                                    </ListGroup.Item>
                                )}

                                {loadingDeliver && <Loader />}
                                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button type='button' onClick={(deliverOrderHandler)} className='btn btn-block'>
                                            Marcheaza ca expediat   
                                        </Button>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    </Col>

                </Row>
            </>
        )
  )
}

export default OrderScreen