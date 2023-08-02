import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { Stack, Group, Button, Text, TextInput } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';

export default function FaqFakeCreditCard() {
	const [cardNumber, setCardNumber] = useState<string>('');
	const clipboard = useClipboard({ timeout: 750 });

	return (
		<Stack spacing='lg'>
			<Text>
				Thoải mái đi bạn, Shopmaikusobu đang thiếu người dùng. Tuy nhiên, chúng tôi khuyến khích bạn
				sử dụng thẻ tín dụng thật (để trả tiền cho chúng tôi).
			</Text>
			<Group position='center'>
				<Button
					onClick={() => {
						const newCardNumber = faker.finance.creditCardNumber('visa');
						setCardNumber(newCardNumber);
					}}
				>
					Tạo số thẻ visa giả
				</Button>
				<Button
					onClick={() => {
						if (cardNumber !== '') clipboard.copy(cardNumber);
					}}
				>
					{clipboard.copied ? 'Đã copy' : 'Copy số thẻ visa giả'}
				</Button>
				<TextInput placeholder='Số thẻ Visa' value={cardNumber} />
			</Group>
		</Stack>
	);
}
