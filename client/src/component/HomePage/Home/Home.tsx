import Layout from "../../layout/layout";
import Header from "../header/header";
import Content from "../Content/Content";
import Footer from "../Footer/Footer";
function Home() {
  return (
    <Layout>
      {/* <Helmet>
        <title>ShopMaikusobu</title>
      </Helmet> */}
      <Header />
      <Content />
      <Footer />
    </Layout>
  );
}

export default Home;
