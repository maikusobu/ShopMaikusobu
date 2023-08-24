import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { Stack, Group, Button, Text, TextInput, Select } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';

export default function FaqFakeCreditCard() {
	const [cardType, setCardType] = useState<string | null>(null);
	const [cardNumber, setCardNumber] = useState<string>('');
	const clipboard = useClipboard({ timeout: 750 });

	return (
		<Stack spacing='lg'>
			<Text>
				Thoải mái đi bạn, Shopmaikusobu đang thiếu người dùng. Tuy nhiên, chúng tôi khuyến khích bạn
				sử dụng thẻ tín dụng thật (để trả tiền cho chúng tôi).
			</Text>

			<Stack justify='center' align='center'>
				<Group>
					<Select
						placeholder='chọn loại thẻ'
						value={cardType}
						data={[
							{ value: 'visa', label: 'Visa' },
							{ value: 'mastercard', label: 'Mastercard' },
							{ value: 'discover', label: 'Discover' },
							{ value: 'maestro', label: 'Maestro' },
						]}
						onChange={(value) => setCardType(value)}
					/>
					<Button
						onClick={() => {
							if (!cardType) return;
							// discover maestro mastercard visa
							const newCardNumber = faker.finance.creditCardNumber({ issuer: cardType });
							setCardNumber(newCardNumber);
						}}
					>
						Tạo
					</Button>
				</Group>

				<Group>
					<Button
						onClick={() => {
							if (cardNumber !== '') clipboard.copy(cardNumber);
						}}
					>
						{clipboard.copied ? 'Đã copy' : 'Copy'}
					</Button>
					<TextInput placeholder='Số thẻ Visa' value={cardNumber} />
				</Group>
			</Stack>
		</Stack>
	);
}
