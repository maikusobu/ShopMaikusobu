import Layout from "../layout/layout";
import Header from "../header/header";
import Content from "../Content/Content";
import { Helmet } from "react-helmet";
function Home() {
  return (
    <Layout>
      <Helmet>
        <title>ShopMaikusobu</title>
      </Helmet>
      <Header />
      <Content />
    </Layout>
  );
}

export default Home;
