import { USERS_URL } from "../constants";
import {apiSlice} from './apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({  
    endpoints: (builder) => ({  
        login: builder.mutation({  //login-ul este un mutation, adica o actiune care modifica datele, builder-ul este un obiect care contine metode pentru a crea endpoint-uri, in cazul asta mutation-uri
            query: (data) => ({  //query-ul primeste ca parametru data = {email, password}
                url:`${USERS_URL}/login`,  //url-ul catre care facem request
                method: 'POST', //metoda de request
                body: data,//data = {email, password}
            }),
        }),

        register : builder.mutation ({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data,
            }), 

        }),

        logout: builder.mutation({  //logout-ul este un mutation, adica o actiune care modifica datele, builder-ul este un obiect care contine metode pentru a crea endpoint-uri, in cazul asta mutation-uri
            query: () => ({  //query-ul nu primeste niciun parametru
                url:`${USERS_URL}/logout`,  //url-ul catre care facem request
                method: 'POST', //metoda de request
        }),
    }),
        profile:builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data,
            }),
        }),

        getUsers: builder.query({  //getUsers este un query, adica o actiune care nu modifica datele, builder-ul este un obiect care contine metode pentru a crea endpoint-uri, in cazul asta query-uri
            query: () => ({  //query-ul nu primeste niciun parametru
                url: USERS_URL,  //url-ul catre care facem request
                method: 'GET',  //metoda de request
            }),
            providesTags: ['Users'],
            keepUnusedDataFor: 5
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: 'DELETE',
            }),
        }),
        getUserDetalis : builder.query({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: 'GET',
            }),
            keepUnusedDataFor: 5
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.userId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Users'] 
        }),
    }),
});

export const { 
    useLoginMutation, 
    useLogoutMutation, 
    useRegisterMutation, 
    useProfileMutation, 
    useGetUsersQuery,
    useDeleteUserMutation,
    useGetUserDetalisQuery,
    useUpdateUserMutation} = usersApiSlice;