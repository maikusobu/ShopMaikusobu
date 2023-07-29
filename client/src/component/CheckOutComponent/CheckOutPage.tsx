import Layout from '../layout/layout';
import CheckOutHeader from './CheckOutHeader/CheckOutHeader';
import CheckOutContent from './CheckOutContent/CheckOutContent';

import { Helmet } from 'react-helmet';
function CheckOut() {
	return (
		<Layout>
			<Helmet>
				<title>Check Out</title>
			</Helmet>

			<CheckOutHeader />
			<CheckOutContent />
		</Layout>
	);
}

export default CheckOut;
