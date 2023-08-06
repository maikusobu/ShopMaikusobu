import { useOs } from '@mantine/hooks';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './component/validation/login.tsx';
import Register from './component/validation/register.tsx';
import actionLogin from './component/validation/action/actionLogin.ts';
import actionRegister from './component/validation/action/actionRegister.ts';
import RestorePassword from './component/validation/requestChangepassword.tsx';
import actionChangePassword from './component/validation/action/actionChangePassword.ts';
import actionRestorePassword from './component/validation/action/actionrestorePassword.ts';
import ChangePassWord from './component/validation/changePassword.tsx';
import ProductPage from './component/ShoppingHome/ProductPage/ProductPage.tsx';
import SettingAccount from './component/SettingAccount/SettingAccount.tsx';
import CartPage from './component/CartComponent/CartPage/CartPage.tsx';
import Home from './component/HomePage/Home/Home.tsx';
import CheckOut from './component/CheckOutComponent/CheckOutPage.tsx';
import ShoppingHome from './component/ShoppingHome/shoppinghome.tsx';
import ContentShow from './component/ShoppingHome/ContentShow/ContentShow.tsx';
import Faq from './component/Faq/Faq.tsx';
import Contact from './component/Contact/Contact.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/authen',
		children: [
			{
				path: 'login',
				element: <Login />,
				action: actionLogin,
			},
			{
				path: 'signup',
				element: <Register />,
				action: actionRegister,
			},
			{
				path: 'forgotpassword',
				element: <RestorePassword />,
				action: actionRestorePassword,
			},
			{
				path: 'changepassword',
				element: <ChangePassWord />,
				action: actionChangePassword,
			},
			{
				path: 'noauthorized',
				element: <div>Bạn không có quyền truy cập</div>,
			},
		],
	},
	{
		path: '/shopping',

		children: [
			{
				path: 'cart',
				element: <CartPage />,
			},
			{
				path: 'checkout',
				element: <CheckOut />,
			},
			{
				path: 'products',
				element: <ShoppingHome />,
				children: [
					{
						path: 'all',
						element: <ContentShow />,
					},
					{
						path: ':id',
						element: <ProductPage />,
					},
				],
			},
		],
	},
	{
		path: '/settingaccount',
		element: <SettingAccount />,
	},
	{
		path: '/support',
		children: [
			{
				path: 'faq',
				element: <Faq />,
			},
			{
				path: 'contact',
				element: <Contact />,
			},
		],
	},
]);

export default function App() {
	const os = useOs();
	const isDesktopOs = os === 'macos' || os === 'windows' || os === 'linux';

	return (
		<>
			{isDesktopOs ? <RouterProvider router={router}></RouterProvider> : <div>Buy a PC bitch</div>}
		</>
	);
}