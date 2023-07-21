import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export interface wards {
  label: string;
  value: string;
  name: string;
  code: number;
  codename: string;
  divsion_type: string;
  short_codename: string;
}

export interface districts {
  label: string;
  value: string;

  name: string;
  code: number;
  codename: string;
  division_type: string;
  province_code: number;
  wards?: wards[] | null;
}
export interface provinces {
  label: string;
  value: string;
  name: string;
  code: number;
  codename: string;
  division_type: string;
  districts: districts[];
}

export const ProvincesAPi = createApi({
  reducerPath: "ProvincesAPi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://provinces.open-api.vn/api/" }),
  endpoints: (builder) => ({
    getProvinces: builder.query<provinces[], void>({
      query: () => "?depth=3",
      transformResponse: (response: provinces[]) =>
        response.map((item) => ({
          ...item,
          value: item.codename,
          label: item.name,
          districts: item.districts.map((district) => ({
            ...district,
            value: district.codename,
            label: district.name,
            wards: district.wards?.map((ward) => ({
              ...ward,
              value: ward.codename,
              label: ward.name,
            })),
          })),
        })),
    }),
  }),
});
export const { useGetProvincesQuery } = ProvincesAPi;
