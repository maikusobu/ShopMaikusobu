import { useEffect, useState, useContext } from 'react';
import { upperFirst } from '@mantine/hooks';
import { useNavigate, useNavigation } from 'react-router-dom';
import GoogleIcon from '../socialButton/GoogleIcon';
import ZaloIcon from '../socialButton/ZaloIcon';
import { useForm } from '@mantine/form';
import { Form } from 'react-router-dom';
import { useObjectError } from '../../hook/useObjectError';
import { IconX } from '@tabler/icons-react';
import { Notification, LoadingOverlay } from '@mantine/core';
import { useStyles } from './styleGlobal';
import { useGoogleLogin } from '@react-oauth/google';
import { SocialContext } from '../SocialContext/SocialContextProvider';
import {
	TextInput,
	PasswordInput,
	Text,
	Container,
	Group,
	Button,
	Divider,
	Anchor,
	Stack,
	Center,
} from '@mantine/core';
import { toast } from '../../toast/toast';

function Login() {
	useEffect(() => {
		document.title = 'Log in';
	}, []);
	const { classes } = useStyles();
	const navigate = useNavigate();
	const navigation = useNavigation();
	const [submitLoading, setSubmitloading] = useState(false);
	const { setData } = useContext(SocialContext);
	const { errorAppear, handleSetErrorAppear, objectError } = useObjectError();
	const form = useForm({
		initialValues: {
			username: '',
			password: '',
		},
	});
	const googleLogin = useGoogleLogin({
		onSuccess: async (coderesponse) => {
			const body = JSON.stringify({
				code: coderesponse.code,
			});
			setSubmitloading(true);
			const signals = await fetch(
				`${import.meta.env.VITE_SERVER}/authen/login?isSocialLogin=true&google=true`,
				{
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					method: 'POST',
					credentials: 'include',
					body: body,
				}
			);
			const dataJSon = await signals.json();
			console.log(dataJSon);
			if (dataJSon.isExisted === false) {
				setData(dataJSon);
				navigate('/authen/signup');
			} else {
				if (dataJSon.isExisted === true && dataJSon.isSocialConnect === false) {
					setSubmitloading(false);
					alert(
						'email đã được đăng ký với tài khoản khác, vui lòng đăng nhập với email khác hoặc đăng ký mới'
					);
				} else {
					localStorage.setItem('id', dataJSon.id);
					localStorage.setItem('expires', dataJSon.expires);
					localStorage.setItem('refreshToken', dataJSon.refreshToken);
					toast('Bạn đã đăng nhập thành công', false, 'Login', 'Đăng nhập');
					await new Promise<void>((r) =>
						setTimeout(() => {
							r();
							setSubmitloading(false);
						}, 1000)
					);
					navigate('/');
				}
			}
		},

		scope: 'profile',
		flow: 'auth-code',
	});
	return (
		<div className={classes.mainSection}>
			{errorAppear && (
				<Notification
					icon={<IconX size='1.1rem' />}
					color='red'
					onClose={() => {
						handleSetErrorAppear();
					}}
					withCloseButton={true}
					title='Lỗi'
					className={classes.errorNotifi}
				>
					{objectError.err.message}
				</Notification>
			)}
			<Container size={800} className={classes.Container}>
				<Center>
					<Text fz='xl' weight={700}>
						Welcome to{' '}
						<Text
							variant='gradient'
							span={true}
							gradient={{
								from: 'brandcolorRed.0',
								to: 'brandcolorYellow.0',
								deg: 45,
							}}
						>
							ShopMaikusobu
						</Text>
					</Text>
				</Center>
				<Divider
					label='Đăng nhập'
					labelPosition='center'
					styles={{
						label: {
							fontSize: '15px',
							fontWeight: 'bold',
						},
					}}
				/>

				<Group mt='md' position='center' spacing={50}>
					<GoogleIcon radius='md' className={classes.buttonSocial} onClick={() => googleLogin()}>
						Google
					</GoogleIcon>

					<ZaloIcon radius='md' className={classes.buttonSocial}>
						Zalo
					</ZaloIcon>
				</Group>
				<Divider
					label='Hoặc đăng nhập bằng tài khoản'
					labelPosition='center'
					my='xs'
					styles={{
						label: {
							fontSize: '12px',
							fontWeight: 'bold',
						},
					}}
				/>
				<LoadingOverlay
					visible={navigation.state !== 'idle' || submitLoading}
					loaderProps={{ size: 'sm' }}
					overlayColor='#ffffff'
					radius={'10px'}
				/>
				<Form action='' method='post'>
					<Stack>
						<TextInput
							required
							label='Username'
							placeholder='Your username'
							name='username'
							value={form.values.username}
							onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
							styles={{
								label: {
									color: 'grey',
								},
							}}
							radius='md'
						/>

						<PasswordInput
							required
							label='Password'
							name='password'
							placeholder='Your password'
							value={form.values.password}
							onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
							styles={{
								label: {
									color: 'grey',
								},
							}}
							radius='md'
						/>
					</Stack>
					<Group position='apart' mt='xl'>
						<Stack>
							<Anchor
								component='button'
								type='button'
								color='dimmed'
								style={{
									color: 'black',
									textAlign: 'left',
								}}
								size='xs'
								onClick={() => {
									navigate('/authen/signup');
								}}
							>
								{'Không có tài khoản? Đăng ký'}
							</Anchor>
							<Anchor
								component='button'
								type='button'
								color='dimmed'
								style={{
									color: 'black',
								}}
								size='xs'
								onClick={() => {
									navigate('/authen/forgotpassword');
								}}
							>
								{'Quên mật khẩu? Quên mật khẩu'}
							</Anchor>
						</Stack>
						<Button type='submit' radius='xl'>
							{upperFirst('Login')}
						</Button>
					</Group>
				</Form>
			</Container>
		</div>
	);
}
export default Login;
