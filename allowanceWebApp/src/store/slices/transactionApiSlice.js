import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../apiConfig';

export const transactionApiSlice = createApi({
  reducerPath: 'transactionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Transaction'],
  endpoints: (builder) => ({
    calculate: builder.mutation({
      query: (body) => ({
        url: 'transactions/calculate/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Transaction'],
    }),
    send: builder.mutation({
      query: (body) => ({
        url: 'transactions/send/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Transaction'],
    }),
    history: builder.query({
      query: (page = 1) => `transactions/history/?page=${page}`,
      providesTags: ['Transaction'],
    }),
    detail: builder.query({
      query: (uuid) => `transactions/${uuid}/`,
      providesTags: ['Transaction'],
    }),
  }),
});

export const { useCalculateMutation, useSendMutation, useHistoryQuery, useDetailQuery } = transactionApiSlice;
