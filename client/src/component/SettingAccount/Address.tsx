import { useContext } from 'react';
import { createStyles, Button, Group, Stack, Text, Box, LoadingOverlay } from '@mantine/core';
import type { addressUserType } from '../../api/UserApi/UserAddressMangaerApi';
import { useGetUserByIdQuery } from '../../api/UserApi/UserApi';
import { useUpdateUserMutation } from '../../api/UserApi/UserApi';
import { useGetUserAddressesQuery } from '../../api/UserApi/UserAddressMangaerApi';
import { useGetProvincesQuery } from '../../api/VnProvincesApi/VnProvincesApi';
import { useAppSelector } from '../../app/hooks';
import { selectAuth } from '../../api/AuthReducer/AuthReduce';
import { AddressContext } from '../ModalAddAddress/ModalAddAddress';
const useStyles = createStyles((theme) => ({
	bgDiv: {
		backgroundColor: '#fff',
		color: 'black',
		padding: '0.5rem',
		height: '4rem',
		display: 'flex',
		flexWrap: 'wrap',
		border: '5px solid transparent',
		borderRadius: '5px',
	},
	defaultDiv: {
		border: `5px solid ${theme.colors.brandcolorYellow[4]} !important`,
		color: `${theme.colors.brandcolorYellow[4]} !important`,
		fontWeight: 700,
	},
}));

const UserAddressForm = () => {
	const { classes } = useStyles();
	const auth = useAppSelector(selectAuth);
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const { open } = useContext(AddressContext)!;
	const { data: AddressUser } = useGetUserAddressesQuery(auth.id, {
		skip: !auth.isLoggedIn,
	});
	const { data: userData = { idDefaultAddress: undefined } } = useGetUserByIdQuery(auth.id, {
		skip: !auth.isLoggedIn,
	});
	const [updateUser, { isLoading }] = useUpdateUserMutation();
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

		const sortedNameArray = [...(nameArray || [])];
		const defaultIndex = sortedNameArray.findIndex(
			(item) => item._id === userData.idDefaultAddress
		);
		sortedNameArray.unshift(...sortedNameArray.splice(defaultIndex, 1));

		return sortedNameArray;
	};

	const handleSetDefault = (_id: string) => {
		console.log('_id:', _id);
		const newUserData = { ...userData, idDefaultAddress: _id };

		updateUser(newUserData)
			.unwrap()
			.then(() => {
				// notifications
			})
			.catch((err) => console.log(err));
	};

	return (
		<Box pos='relative'>
			<LoadingOverlay
				loaderProps={{ size: 'sm', color: 'pink', variant: 'bars' }}
				overlayOpacity={0.8}
				overlayColor='#c5c5c5'
				visible={isLoading}
			/>

			<Group noWrap grow mb={10}>
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
			<Stack spacing={10}>
				{getNameArray(AddressUser?.address_list)?.map((item) => (
					<div
						key={item._id}
						className={`${classes.bgDiv} ${
							userData.idDefaultAddress === item._id ? classes.defaultDiv : ''
						}`}
					>
						<Group w='100%' position='apart'>
							<Group>
								<Text>
									{item.provinceName} - {item.districtName} - {item.wardName}
								</Text>
							</Group>

							<Group>
								<Button>Xóa</Button>
								<Button>Cập nhật</Button>
								{userData.idDefaultAddress !== item._id && (
									<Button
										onClick={() => {
											handleSetDefault(item._id);
										}}
									>
										Thiết lập mặc định
									</Button>
								)}
							</Group>
						</Group>
					</div>
				))}
			</Stack>
		</Box>
	);
};
export default UserAddressForm;
