import { useGetFakeCreditCardQuery } from '../../api/FakeCreditCardApi/FakeCreditCardApi';
import { Stack, Group, Button, Text, TextInput } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';

export default function FaqFakeCreditCard() {
	const clipboard = useClipboard({ timeout: 750 });

	/* giới hạn 100 request mỗi tháng tốn kém vãi lol, xài tạm cái dưới
	  const { data, isError } = useGetFakeCreditCardQuery();
  */

	const mockUseGetFakeCreditCardQuery = () => {
		return {
			isError: false,
			data: {
				number: '4432364915907794',
			},
		};
	};

	const { data, isError } = mockUseGetFakeCreditCardQuery();

	return (
		<Stack spacing='lg'>
			<Text>
				Thoải mái đi bạn, Shopmaikusobu đang thiếu người dùng. Tuy nhiên, chúng tôi khuyến khích bạn
				sử dụng thẻ tín dụng thật (để trả tiền cho chúng tôi).
			</Text>
			<Group position='center'>
				<Button onClick={() => (isError ? null : clipboard.copy(data?.number))}>
					{clipboard.copied ? 'Đã copy' : 'Copy số thẻ visa giả'}
				</Button>
				<TextInput
					placeholder='Số thẻ Visa'
					disabled
					value={isError ? 'Đã xảy ra lỗi' : data?.number}
				/>
			</Group>
		</Stack>
	);
}
