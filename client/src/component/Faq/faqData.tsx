import FaqFakeCreditCard from "./components/FaqFakeCreditCard";
import FaqPasswordGenerator from "./components/FaqPasswordGenerator";

interface faqData {
  value: string;
  header: string;
  description: JSX.Element | string;
}

const faqDatas: faqData[] = [
  {
    value: "members",
    header: "Thành viên của Shopmaikusobu gồm những ai?",
    description:
      "Thành viên của Shopmaikusobu gồm 2 người: Maikusobu và Blank, trong đó Maikusobu là sếp, còn Blank là culi",
  },
  {
    value: "purpose",
    header: "Mục đích thành lập của website Shopmaikusobu là gì?",
    description:
      "Để buôn bán hàng tất cả mặt hàng, đặc biệt là trà xoài chanh dây từ một thằng công an thích đánh đàn.",
  },
  {
    value: "fakeCreditCard",
    header: "Tôi có thể sử dụng thẻ tín dụng giả không?",
    description: <FaqFakeCreditCard />,
  },
  {
    value: "passwordGenerator",
    header: "Làm sao để mật khẩu của tôi bảo mật hơn?",
    description: <FaqPasswordGenerator />,
  },
];

export default faqDatas;
