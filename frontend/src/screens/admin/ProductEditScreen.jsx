import React from 'react'
import {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {Form, Button} from 'react-bootstrap'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import {toast} from 'react-toastify'
import { useUpdateProductMutation, useGetProductDetailsQuery, useUploadProductImageMutation } from '../../slices/productsApiSlice'
import {FaArrowLeft} from 'react-icons/fa'

const ProductEditScreen = () => {
    const { id:productId } = useParams()

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')

    const {data:product, isLoading, error, refetch} = useGetProductDetailsQuery(productId)

    const [updateProduct, {isLoading:loadingUpdate}] = useUpdateProductMutation()  
    
    const [uploadProductImage, {isLoading:loadingUploadImage}] = useUploadProductImageMutation()
    
    const navigate = useNavigate()

    useEffect(() => {
        if(product){
            setName(product.name)
            setPrice(product.price)
            setImage(product.image)
            setBrand(product.brand)
            setCategory(product.category)
            setCountInStock(product.countInStock)
            setDescription(product.description)
        }
    }, [product])

    const submitHandler = async (e) => {
        e.preventDefault()
        const updatedProduct = {
            productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }

        const result = await updateProduct(updatedProduct)
        if(result){
            toast.success('Produs actualizat cu succes')
            refetch() //pentru a reactualiza detaliile produsului
            navigate('/admin/productlist')
        } else {
            toast.error(result.error)
        }
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)

        try {
            const result = await uploadProductImage(formData).unwrap()  //unwrap() pentru a extrage valoarea din obiectul returnat de createProduct
            toast.success(result.message)
            setImage(result.image)
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }       

  return (
    <>
        <Link to='/admin/productlist' className='btn btn-light my-3'><FaArrowLeft/></Link>

        <FormContainer>
            <h1>Editeaza produsul</h1>
            {loadingUpdate && <Loader />}

            {isLoading ? <Loader /> : error ? <Message variant='danger'>{error.data.message}</Message> : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className='my-2'>
                        <Form.Label>Nume</Form.Label>
                        <Form.Control type='text' placeholder='Introduceti numele' value={name} onChange={(e) => setName(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='price' className='my-2'>
                        <Form.Label>Pret</Form.Label>
                        <Form.Control type='number' placeholder='Introduceti pretul' value={price} onChange={(e) => setPrice(e.target.value)}>  
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='image' className='my-2'>
                        <Form.Label>Imagine</Form.Label>
                        <Form.Control type='text' placeholder='Introduceti imaginea' value={image} onChange={(e) => setImage} />
                        <Form.Control type ='file' label='Alege fisierul' onChange={uploadFileHandler}>
                        </Form.Control>
                    </Form.Group>
                    {loadingUploadImage && <Loader/>}

                    <Form.Group controlId='brand' className='my-2'>
                        <Form.Label>Brand</Form.Label>
                        <Form.Control type='text' placeholder='Introduceti brand-ul' value={brand} onChange={(e) => setBrand(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='countInStock' className='my-2'>
                        <Form.Label>Stock</Form.Label>
                        <Form.Control type='number' placeholder='Introduceti stock-ul' value={countInStock} onChange={(e) => setCountInStock(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='category' className='my-2'>
                        <Form.Label>Categorie</Form.Label>
                        <Form.Control type='text' placeholder='Introduceti categoria' value={category} onChange={(e) => setCategory(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='description' className='my-2'>
                        <Form.Label>Descriere</Form.Label>
                        <Form.Control type='text' placeholder='Introduceti descrierea' value={description} onChange={(e) => setDescription(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary' className='my-2'>
                        Actualizare
                    </Button>

                </Form>
            )}
        </FormContainer>
    </>
  )
}

export default ProductEditScreen