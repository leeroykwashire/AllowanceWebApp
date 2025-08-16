import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../apiConfig';

export const adsApiSlice = createApi({
  reducerPath: 'adsApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Ads'],
  endpoints: (builder) => ({
    getAds: builder.query({
      query: () => 'advertisements/',
      providesTags: ['Ads'],
    }),
  }),
});

export const { useGetAdsQuery } = adsApiSlice;
