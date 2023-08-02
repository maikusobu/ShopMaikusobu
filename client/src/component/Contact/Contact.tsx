import {
	Paper,
	Text,
	TextInput,
	Textarea,
	Button,
	Group,
	SimpleGrid,
	createStyles,
	rem,
	Container,
} from '@mantine/core';
import { useNavigate } from 'react-router';
import { IconArrowBack } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import emailjs from '@emailjs/browser';

const useStyles = createStyles((theme) => {
	const BREAKPOINT = theme.fn.smallerThan('sm');

	return {
		wrapper: {
			display: 'flex',
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
			borderRadius: theme.radius.lg,
			padding: rem(4),
			border: `${rem(1)} solid ${
				theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[2]
			}`,

			[BREAKPOINT]: {
				flexDirection: 'column',
			},
		},

		form: {
			boxSizing: 'border-box',
			flex: 1,
			padding: theme.spacing.xl,
			paddingLeft: `calc(${theme.spacing.xl} * 2)`,
			borderLeft: 0,

			[BREAKPOINT]: {
				padding: theme.spacing.md,
				paddingLeft: theme.spacing.md,
			},
		},

		fields: {
			marginTop: rem(-12),
		},

		fieldInput: {
			flex: 1,

			'& + &': {
				marginLeft: theme.spacing.md,

				[BREAKPOINT]: {
					marginLeft: 0,
					marginTop: theme.spacing.md,
				},
			},
		},

		fieldsGroup: {
			display: 'flex',

			[BREAKPOINT]: {
				flexDirection: 'column',
			},
		},

		contacts: {
			boxSizing: 'border-box',
			position: 'relative',
			borderRadius: theme.radius.lg,
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			border: `${rem(1)} solid transparent`,
			padding: theme.spacing.xl,
			flex: `0 0 ${rem(280)}`,

			[BREAKPOINT]: {
				marginBottom: theme.spacing.sm,
				paddingLeft: theme.spacing.md,
			},
		},

		title: {
			marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
			fontFamily: `Greycliff CF, ${theme.fontFamily}`,

			[BREAKPOINT]: {
				marginBottom: theme.spacing.xl,
			},
		},

		control: {
			[BREAKPOINT]: {
				flex: 1,
			},
		},

		container: {
			height: '100%',
			width: '100%',
			minHeight: '100vh',
			minWidth: '100vw',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'flex-start',
			gap: '1rem',
			padding: '10px',
		},
	};
});

export function Contact() {
	const navigate = useNavigate();
	const { classes } = useStyles();
	const form = useForm({
		initialValues: {
			name: '',
			email: '',
			subject: '',
			message: '',
		},
	});

	const handleSendEmail = () => {
		// Tốn kém vãi lol, có gì comment mấy cái code này --
		emailjs.send(
			import.meta.env.VITE_EMAILJS_SERVICE_ID,
			import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
			{
				name: form.values.name !== '' ? form.values.name : 'unknown',
				email: form.values.email,
				subject: form.values.subject !== '' ? form.values.subject : 'no subject',
				message: form.values.message,
			},
			import.meta.env.VITE_EMAILJS_PUBLIC_KEY
		);
		// --------------------------------------------------
	};

	return (
		<Container mx={0} className={classes.container}>
			<Button
				leftIcon={<IconArrowBack />}
				onClick={() => {
					navigate(-1);
				}}
			>
				Back
			</Button>

			<Paper shadow='md' radius='md' w='fit-content' mx='auto'>
				<div className={classes.wrapper}>
					<form
						className={classes.form}
						onSubmit={() => {
							handleSendEmail();
						}}
					>
						<Text fz='lg' fw={700} className={classes.title}>
							Contact us
						</Text>

						<div className={classes.fields}>
							<SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
								<TextInput
									label='Your name'
									placeholder='Your name'
									value={form.values.name}
									onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
								/>
								<TextInput
									type='email'
									label='Your email'
									placeholder='hello@gmail.com'
									required
									value={form.values.email}
									onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
								/>
							</SimpleGrid>

							<TextInput
								mt='md'
								label='Subject'
								placeholder='Subject'
								value={form.values.subject}
								onChange={(event) => form.setFieldValue('subject', event.currentTarget.value)}
							/>

							<Textarea
								mt='md'
								label='Your message'
								placeholder='Please include all relevant information'
								minRows={3}
								required
								value={form.values.message}
								onChange={(event) => form.setFieldValue('message', event.currentTarget.value)}
							/>

							<Group position='right' mt='md'>
								<Button type='submit' className={classes.control}>
									Send message
								</Button>
							</Group>
						</div>
					</form>
				</div>
			</Paper>
		</Container>
	);
}

export default Contact;
