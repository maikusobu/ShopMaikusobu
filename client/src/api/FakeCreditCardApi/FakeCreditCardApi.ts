import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface fakeCreditCard {
	number: string;
	expiration: string;
	brand: string;
}

interface res {
	status: string;
	timestamp: number;
	data: {
		number: string;
		cvv: number;
		expiration: string;
		balance: number;
		issuer: string;
		brand: string;
	};
}

export const FakeCreditCardApi = createApi({
	reducerPath: 'FakeCreditCardApi',
	baseQuery: fetchBaseQuery({ baseUrl: 'https://api.apistacks.com/v1/' }),
	endpoints: (builder) => ({
		getFakeCreditCard: builder.query<fakeCreditCard, void>({
			query: () => `generatecard?api_key=${import.meta.env.VITE_CARD_GENERATOR_API_KEY}`,
			transformResponse: (response: res) => ({
				number: response.data.number,
				expiration: response.data.expiration,
				brand: response.data.brand,
			}),
		}),
	}),
});
export const { useGetFakeCreditCardQuery } = FakeCreditCardApi;
