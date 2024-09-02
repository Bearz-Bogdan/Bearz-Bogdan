import {useState} from 'react'
import React from 'react'
import Rating from '../components/Rating'
import {useParams, useNavigate} from 'react-router-dom'
import {Link} from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { Form, Row, Col, Image, ListGroup, Card,Button, ListGroupItem} from 'react-bootstrap'
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { addToCart } from '../slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import {toast} from 'react-toastify'
import Meta from '../components/Meta'

const ProductScreen = () => {

    const {id: productId} = useParams();
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);
    const[comment, setComment] = useState('');
    const[rating, setRating] = useState(0);

    const { data:product, refetch, isLoading, error} = useGetProductDetailsQuery(productId);

    const [createReview, {isLoading:loadingProductReviews}] = useCreateReviewMutation();

    const {userInfo} = useSelector((state) => state.auth); 

    const addToCartHandler = () => {    
        dispatch(addToCart({...product, qty}));
        navigate('/cart');
    }

    const submitHandler = async(e) => {
        e.preventDefault();
        try {
           await createReview({productId, rating, comment}).unwrap(); 
           refetch();
           toast.success('Review adaugat cu succes');
           setRating(0);
           setComment('');
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    }

  return (
    <>
        <Link className="btn btn-light my-3" to="/">
            <FaArrowLeft/>
        </Link>

        {isLoading ? (
            <Loader/>
        ) : error ? (
            <Message variant='danger'>
                {error?.data?.message || error.error}
            </Message>
        ) : (
            <>
            <Meta title={product.name}/>
            <Row>
            <Col md={5}>
                <Image src={product.image} alt={product.name} fluid></Image>
            </Col>
            <Col md={4}>
                <ListGroup variant='flush'>
                    <ListGroupItem>
                        <h3>{product.name}</h3>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Rating value={product.rating} text={`${product.numReviews} review-uri`}/>
                    </ListGroupItem>
                    <ListGroupItem>
                        {product.description}
                    </ListGroupItem>
                </ListGroup>
            </Col>
                
            <Col md={3}>
            <Card>
                    <ListGroup>
                        <ListGroupItem>
                            <Row>
                                <Col>Pret:</Col>
                                <Col>
                                    <strong>{product.price} LEI</strong>
                                </Col>
                            </Row>
                        </ListGroupItem>

                        <ListGroupItem>
                            <Row>
                                <Col>Status:</Col>
                                <Col>
                                    <strong>{product.countInStock > 0 ? 'In stoc' : 'Nu este in stoc'}</strong>
                                </Col>
                            </Row>
                        </ListGroupItem>

                        {product.countInStock > 0 && (
                            <ListGroupItem>
                                <Row>
                                    <Col>Cantitate:</Col>
                                    <Col>
                                       <Form.Control
                                       as = 'select'
                                       value={qty}
                                       onChange={(e) => setQty(Number(e.target.value))}>
                                        {[...Array(product.countInStock).keys()].map((x) => (
                                            <option key={x+1} value={x+1}>
                                                {x+1}
                                            </option>
                                        ))}
                                       </Form.Control>
                                    </Col>
                                </Row>
                            </ListGroupItem>
                        ) }

                        <ListGroupItem>
                            <Button className='btn-block' 
                                type='button' 
                                disabled={product.countInStock===0}
                                onClick={addToCartHandler}
                            >
                                Adauga in cos
                            </Button>
                        </ListGroupItem>

                    </ListGroup>
                </Card>
            </Col>
        </Row>

        <Row className='review'>
            <Col md={6}>
                <h2>Review-uri</h2>
                {product.reviews.length === 0 && <Message>Niciun review</Message>}
                <ListGroup variant='flush'>
                    {product.reviews.map(review => (
                        <ListGroupItem key={review._id}>
                            <strong>{review.name}</strong>
                            <Rating value={review.rating}/>
                            <p>{review.createdAt.substring(0,10)}</p>
                            <p>{review.comment}</p>
                        </ListGroupItem>
                    ))}

                <ListGroupItem>
                    <h2>Adauga un review</h2>   
                    {loadingProductReviews && <Loader/>}

                    {userInfo ? (
                        <Form onSubmit={submitHandler}> 
                            <Form.Group controlId='rating' className='my-2'>
                                <Form.Label>Rating</Form.Label>
                                <Form.Control
                                    as='select'
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}>
                                        <option value=''>Select...</option>
                                        <option value='1'>1 - Slab</option>
                                        <option value='2'>2 - Ok</option>
                                        <option value='3'>3 - Bun</option>
                                        <option value='4'>4 - Foarte bun</option>
                                        <option value='5'>5 - Excelent</option>
                                    </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='comment' className='my-2'>
                                <Form.Label>Comentariu</Form.Label>
                                <Form.Control
                                    as='textarea'
                                    row='3'
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                            <Button disabled={loadingProductReviews} type='submit' variant='primary'>
                                Trimite
                            </Button>
                        </Form>
                    ) :(
                        <Message>
                            Va rugam sa va <Link to='/login'>logati</Link> pentru a adauga un review
                        </Message>
                    )}
                 </ListGroupItem>
                </ListGroup>
            </Col>
        </Row>
        </>
     )}
        
    </>
  )
}

export default ProductScreen