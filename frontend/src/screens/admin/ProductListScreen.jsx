import React from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import {Table, Button, Row, Col} from 'react-bootstrap'
import {FaEdit, FaTrash} from 'react-icons/fa'
import { useParams } from 'react-router-dom' 
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import Paginate from '../../components/Paginate'
import {useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation} from '../../slices/productsApiSlice'
import {toast} from 'react-toastify'

const ProductListScreen = () => {

    const {pageNumber} = useParams()

    const {data, isLoading, error, refetch} = useGetProductsQuery({pageNumber});

    const [createProduct, {isLoading: loadingCreate}] = useCreateProductMutation();

    const [deleteProduct, {isLoading: loadingDelete}] = useDeleteProductMutation();

    const deleteHandler = async (id) => {
        if (window.confirm('Sunteti sigur ca doriti sa stergeti acest produs?')) {
            try {
                await deleteProduct(id);
                toast.success ('Produsul a fost sters cu succes');
                refetch(); //reincarca lista de produse dupa stergerea unui produs
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }
        }
    }
      
    const createProductHandler = async() => {
        if(window.confirm('Sunteti sigur ca doriti sa creati un produs nou?')) {
            try {
                await createProduct();
                refetch(); //reincarca lista de produse dupa adaugarea unui produs nou
            } catch (error) {
                toast.error(error?.data?.message || error.message);
            }
        }
    }

  return (
    <>
        <Row className='align-items-center'>
            <Col>
                <h1>Produse</h1>
            </Col>

            <Col className='text-end'>
                <Button className='btn-sm m-3' onClick={createProductHandler}>
                    <FaEdit /> Creaza produs
                </Button>
            </Col>

        </Row>

        {loadingCreate && <Loader />}
        {loadingDelete && <Loader />}

        {isLoading ? <Loader /> : error ? <Message variant='danger'>{error.data.message}</Message> : (
            <>
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <th>ID</th>
                        <th>NUME</th>
                        <th>PRET</th>
                        <th>CATEGORIE</th>
                        <th>BRAND</th>
                        <th></th>
                    </thead>
                    <tbody>
                        {data.products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price} lei</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                        <Button variant='light' className='btn-sm mx-2'>
                                            <FaEdit />
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm mx-2' onClick={() => deleteHandler(product._id)}>
                                        <FaTrash style={{color:'white'}}/>     
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Paginate pages={data.pages} page={data.page} isAdmin={true} />
            </>
        )}
    </>
  )
}

export default ProductListScreen