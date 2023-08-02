import { useState } from 'react';
import RandExp from 'randexp';
import { Stack, Group, Button, Text, PasswordInput } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';

export default function FaqPasswordGenerator() {
	const [password, setPassword] = useState<string>('');
	const clipboard = useClipboard({ timeout: 750 });

	return (
		<Stack spacing='lg'>
			<Text>Bạn có thể sử dụng mật khẩu được tạo ngẫu nhiên sau (bảo mật vl).</Text>
			<Group position='center'>
				<Button
					onClick={() => {
						const newPassword = new RandExp(
							/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10}$/
						).gen();
						setPassword(newPassword);
					}}
				>
					Tạo mật khẩu ngẫu nhiên
				</Button>
				<Button
					onClick={() => {
						if (password !== '') clipboard.copy(password);
					}}
				>
					{clipboard.copied ? 'Đã copy' : 'Copy mật khẩu'}
				</Button>
				<PasswordInput w='200px' placeholder='Mật khẩu ngẫu nhiên' value={password} />
			</Group>
		</Stack>
	);
}
