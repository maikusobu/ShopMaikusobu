import { Box, SimpleGrid, createStyles, Tooltip } from '@mantine/core';
import {
	IconSocial,
	IconShoppingCart,
	IconHelpHexagonFilled,
	IconAddressBook,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router';
const useStyles = createStyles(() => ({
	icon: {
		cursor: 'pointer',
		transformStyle: 'preserve-3d',

		transition: 'transform 150ms ease, scale 150ms ease',
	},
}));
function GroupButton() {
	const { classes } = useStyles();
	const navigate = useNavigate();
	return (
		<>
			<Box
				style={{
					width: '100px',
					flex: 0.5,
				}}
			>
				<SimpleGrid
					cols={2}
					spacing='lg'
					style={{
						justifyItems: 'center',
						perspective: '100px',
					}}
				>
					<Tooltip label='Social' position='right' withArrow>
						<IconSocial size={40} className={`${classes.icon} appear icon-1`} stroke={1.2} />
					</Tooltip>
					<Tooltip label='Shopping' position='right' withArrow>
						<IconShoppingCart size={40} stroke={1.2} className={`${classes.icon} appear icon-2`} />
					</Tooltip>
					<Tooltip
						label='FAQ'
						position='right'
						withArrow
						onClick={() => {
							navigate('/support/faq');
						}}
					>
						<IconHelpHexagonFilled
							size={40}
							className={`${classes.icon} appear icon-3`}
							stroke={1.2}
						/>
					</Tooltip>
					<Tooltip
						label='Contact'
						position='right'
						withArrow
						onClick={() => {
							navigate('/support/contact');
						}}
					>
						<IconAddressBook size={40} className={`${classes.icon} appear icon-4`} stroke={1.2} />
					</Tooltip>
				</SimpleGrid>
			</Box>
		</>
	);
}

export default GroupButton;
