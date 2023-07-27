import { useContext } from 'react';
import { Button, Group, Stack, Text, Box } from '@mantine/core';
import { useGetUserAddressesQuery } from '../../api/UserApi/UserAddressMangaerApi';
import type { addressUserType } from '../../api/UserApi/UserAddressMangaerApi';
import { useGetProvincesQuery } from '../../api/VnProvincesApi/VnProvincesApi';
import { useAppSelector } from '../../app/hooks';
import { selectAuth } from '../../api/AuthReducer/AuthReduce';
import { AddressContext } from '../ModalAddAddress/ModalAddAddress';

const UserAddressForm = () => {
	const auth = useAppSelector(selectAuth);
	const { data: AddressUser } = useGetUserAddressesQuery(auth.id, {
		skip: !auth.isLoggedIn,
	});

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	console.log(AddressUser);
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const { open } = useContext(AddressContext)!;
	const provinceData = useGetProvincesQuery().data || [];

	const getNameArray = (addressList: addressUserType[] | undefined) => {
		const nameArray = addressList?.map((item) => {
			const province =
				provinceData[
					provinceData.findIndex((province) => province.codename === item.province_code)
				];

			const district =
				province.districts[
					province.districts?.findIndex((district) => district.codename === item.district_code)
				];

			const ward = district.wards
				? district.wards[district.wards?.findIndex((ward) => ward.codename === item.ward_code)]
				: { name: '' };

			return {
				_id: item._id,
				provinceName: province.name,
				districtName: district.name,
				wardName: ward.name,
			};
		});

		return nameArray;
	};

	return (
		<Box>
			<Group>
				<Text>Địa chỉ của bạn</Text>
				<Button
					onClick={() => {
						open();
					}}
				>
					Thêm địa chỉ mới
				</Button>
			</Group>
			{AddressUser?.address_list?.length === 0 && (
				<Stack>
					<Text>Bạn chưa nhập địa chỉ</Text>
				</Stack>
			)}
			<Stack>
				{getNameArray(AddressUser?.address_list)?.map((item) => (
					<div key={item._id}>
						<Group>
							<Text>{item.provinceName}</Text>
							<Text>{item.districtName}</Text>
							<Text>{item.wardName}</Text>
						</Group>
					</div>
				))}
			</Stack>
		</Box>
	);
};
export default UserAddressForm;
