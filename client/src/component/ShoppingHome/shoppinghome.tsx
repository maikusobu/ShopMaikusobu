import ContentShow from './ContentShow/ContentShow';
import HeaderShopping from './HeaderShopping/HeaderShopping';
import Layout from '../layout/layout';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';

function ShoppingHome() {
	return (
		<Layout>
			<Helmet>
				<title>Shop</title>
			</Helmet>
			<HeaderShopping />
			<Outlet />
		</Layout>
	);
}

export default ShoppingHome;
