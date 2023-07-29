import ContentShow from './ContentShow/ContentShow';
import HeaderShopping from './HeaderShopping/HeaderShopping';
import Layout from '../layout/layout';

import { Helmet } from 'react-helmet';
function ShoppingHome() {
	return (
		<Layout>
			<Helmet>
				<title>Shop</title>
			</Helmet>
			<HeaderShopping />
			<ContentShow />
		</Layout>
	);
}

export default ShoppingHome;
