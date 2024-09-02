import bcrypt from 'bcryptjs';

const users = [
{
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456',10),
    isAdmin: true,
},
{
    name: 'Bearz Bogdan',
    email: 'bearz@email.com',
    password: bcrypt.hashSync('123456',10),
    isAdmin: false,
},
{
    name: 'Nicu Stancu',
    email: 'nicu@email.com',
    password: bcrypt.hashSync('123456',10),
    isAdmin: false,
}
];

export default users;