import { useEffect } from "react";
import Layout from "../../layout/layout";
import Header from "../header/header";
import Content from "../Content/Content";
import Footer from "../Footer/Footer";

function Home() {
  useEffect(() => {
    document.title = "Home";
  }, []);

  return (
    <Layout>
      <Header />
      <Content />
      <Footer />
    </Layout>
  );
}

export default Home;
