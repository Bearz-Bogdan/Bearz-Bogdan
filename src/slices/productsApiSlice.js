import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import {apiSlice} from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({  
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({keyword, pageNumber}) => ({
                url:PRODUCTS_URL,
                params: {keyword,pageNumber}
            }),
            providesTags: ['Product'], //pentru a reactualiza lista de produse dupa adaugarea unui produs nou
            keepUnusedDataFor: 5
        }),
        getProductDetails: builder.query({
            query:(productID) => ({
                url: `${PRODUCTS_URL}/${productID}`,
            }),
            keepUnusedDataFor: 5
        }),
        createProduct: builder.mutation({
            query: () => ({
                url: PRODUCTS_URL,
                method: 'POST', 
            }),
            invalidatesTags: ['Product'] //pentru a reactualiza lista de produse dupa adaugarea unui produs nou
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Product']
        }),
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: UPLOAD_URL,
                method: 'POST',
                body: data,
            }),
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: 'DELETE',
            }), 
            invalidatesTags: ['Product'] //pentru a reactualiza lista de produse dupa stergerea unui produs
        }),
        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product'] 
        }),
        getTopProducts: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/top`,
            }),
            keepUnusedDataFor: 5
        }),
    }),
});

export const { useGetProductsQuery,
               useGetProductDetailsQuery,
               useCreateProductMutation,
               useUpdateProductMutation,
               useUploadProductImageMutation,
               useDeleteProductMutation,
               useCreateReviewMutation,  
               useGetTopProductsQuery} = productsApiSlice; 
                                         

