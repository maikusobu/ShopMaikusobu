import FaqFakeCreditCard from './FaqFakeCreditCard';

interface faqData {
	value: string;
	header: string;
	description: JSX.Element | string;
}

const faqDatas: faqData[] = [
	{
		value: 'members',
		header: 'Thành viên của Shopmaikusobu gồm những ai?',
		description:
			'Thành viên của Shopmaikusobu gồm 2 người: Blank và Maikusobu. Trong đó, Maikusobu là culi của Blank.',
	},
	{
		value: 'purpose',
		header: 'Mục đích thành lập của website Shopmaikusobu là gì?',
		description:
			'Để buôn bán hàng tất cả mặt hàng, đặc biệt là trà xoài chanh dây từ một thằng công an thích đánh đàn.',
	},
	{
		value: 'fakeCreditCard',
		header: 'Tôi có thể sử dụng thẻ tín dụng giả không?',
		description: <FaqFakeCreditCard />,
	},
];

export default faqDatas;
