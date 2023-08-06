import { useEffect } from "react";
import Layout from "../../layout/layout";
import Header from "../header/header";
import Content from "../Content/Content";
import Footer from "../Footer/Footer";

function Home() {
  useEffect(() => {
    document.title = "Home";
    alert(
      "Vì hiện tại server đang bản free, nên cứ sau 15 phút không ai tương tác website thì server sẽ sập, và sẽ khởi động lại nếu người dùng đầu tiên sau 15 phút truy cập nên sẽ đợi hơi lâu"
    );
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
