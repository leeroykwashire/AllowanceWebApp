import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../apiConfig';

export const ratesApiSlice = createApi({
  reducerPath: 'ratesApi',
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
  tagTypes: ['Rates'],
  endpoints: (builder) => ({
    getRates: builder.query({
      query: () => 'exchange-rates/',
      providesTags: ['Rates'],
    }),
  }),
});

export const { useGetRatesQuery } = ratesApiSlice;
