import React from 'react'
import {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {Form, Button} from 'react-bootstrap'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import {toast} from 'react-toastify'
import {useGetUserDetalisQuery, useUpdateUserMutation} from '../../slices/usersApiSlice'
import {FaArrowLeft} from 'react-icons/fa'

const UserEditScreen = () => {
    const { id:userId } = useParams()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const {data:user, refetch, isLoading, error} = useGetUserDetalisQuery(userId)

    const [updateUser, {isLoading:loadingUpdate}] = useUpdateUserMutation()

    const navigate = useNavigate()

    useEffect(() => {
        if(user){
            setName(user.name)
            setEmail(user.email)
            setIsAdmin(user.isAdmin) 
        }
    }, [user])

    const submitHandler = async (e) => {
        e.preventDefault() //previne reincarcarea paginii la submiterea formularului 
        try {
            await updateUser({userId, name, email, isAdmin})
            toast.success('User actualizat cu succes')
            refetch()
            navigate('/admin/userlist')
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }
       

  return (
    <>
        <Link to='/admin/userlist' className='btn btn-light my-3'><FaArrowLeft/></Link>

        <FormContainer>
            <h1>Editeaza user-ul</h1>
            {loadingUpdate && <Loader />}

            {isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className='my-2'>
                        <Form.Label>Nume</Form.Label>
                        <Form.Control type='text' placeholder='Introduceti numele' value={name} onChange={(e) => setName(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email' className='my-2'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' placeholder='Introduceti email-ul' value={email} onChange={(e) => setEmail(e.target.value)}>  
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='isAdmin' className='my-2'>
                        <Form.Check type='checkbox' label='Admin' checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}>
                        </Form.Check>
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

export default UserEditScreen