import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../apiConfig';

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: 'auth/register/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    login: builder.mutation({
      query: (body) => ({
        url: 'auth/login/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApiSlice;
