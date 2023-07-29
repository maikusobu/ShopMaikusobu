import Layout from '../../layout/layout';
import Header from '../header/header';
import Content from '../Content/Content';
import Footer from '../Footer/Footer';

import { Helmet } from 'react-helmet';

function Home() {
	return (
		<Layout>
			<Helmet>
				<title>Home</title>
			</Helmet>

			<Header />
			<Content />
			<Footer />
		</Layout>
	);
}

export default Home;
