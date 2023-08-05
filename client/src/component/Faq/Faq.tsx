import { useNavigate } from 'react-router';
import { Container, Title, Accordion, createStyles, rem, Button } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons-react';

import faqData from './faqData';

const useStyles = createStyles((theme) => ({
	wrapper: {
		paddingTop: `calc(${theme.spacing.xl} * 2)`,
		paddingBottom: `calc(${theme.spacing.xl} * 2)`,
		minHeight: 650,
		width: '50vw',
	},

	item: {
		width: '100%',
		borderRadius: theme.radius.md,
		marginBottom: theme.spacing.lg,
		border: `${rem(1)} solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,

		'& > button:hover': {
			transition: '0.5s',
			borderRadius: theme.radius.md,
			backgroundColor: theme.colors.brandcolorYellow[9],
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
}));

export function Faq() {
	const navigate = useNavigate();
	const { classes } = useStyles();
	console.log('key api: ', import.meta.env.VITE_CARD_GENERATOR_API_KEY);

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

			<Title order={1} mx='auto'>
				Frequently asked questions
			</Title>

			<Container size='md' className={classes.wrapper}>
				<Accordion variant='separated'>
					{faqData.map((item) => (
						<Accordion.Item className={classes.item} value={item.value}>
							<Accordion.Control>{item.header}</Accordion.Control>
							<Accordion.Panel>{item.description}</Accordion.Panel>
						</Accordion.Item>
					))}
				</Accordion>
			</Container>
		</Container>
	);
}
export default Faq;
