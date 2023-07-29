import { useEffect } from 'react';
import Layout from '../layout/layout';
import CheckOutHeader from './CheckOutHeader/CheckOutHeader';
import CheckOutContent from './CheckOutContent/CheckOutContent';

function CheckOut() {
	useEffect(() => {
		document.title = 'Check out';
	}, []);

	return (
		<Layout>
			<CheckOutHeader />
			<CheckOutContent />
		</Layout>
	);
}

export default CheckOut;
