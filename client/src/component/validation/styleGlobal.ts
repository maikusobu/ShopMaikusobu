import { createStyles, rem } from '@mantine/core';
export const useStyles = createStyles((theme) => ({
	errorNotifi: {
		position: 'absolute',
		height: '10%',
		bottom: 0,
		right: 0,
		transform: 'translateY(-10px) translateX(-10px)',
		zIndex: 999999,
	},
	form: {
		position: 'relative',
	},
	mainSection: {
		width: '100%',
		height: '100%',
		minHeight: '100vh',
		display: 'flex',
		alignItems: 'center',
		backgroundImage: `linear-gradient(45deg, ${theme.colors.brandcolorRed[0]}, ${theme.colors.brandcolorYellow[0]})`,
	},
	Container: {
		background: theme.white,
		color: theme.colors.dark,
		minWidth: '30%',
		padding: '10px',
		borderRadius: '10px',
		position: 'relative',
	},
	button: {
		background: theme.white,
		cursor: 'pointer',
		padding: '6px',
		height: rem(40),
		borderRadius: rem(40),
		'&:hover': {
			background: theme.colors.dark[1],
		},
	},
	buttonSocial: {
		background: theme.white,
		cursor: 'pointer',

		width: '2rem',
		height: '2rem',

		padding: '0px',
		'&:hover': {
			transform: 'scale(1.1)',
		},
	},
}));
