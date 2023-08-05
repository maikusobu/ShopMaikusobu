import { Autocomplete, Group, Loader, SelectItemProps, Text } from '@mantine/core';
import { ComponentProps, useRef, forwardRef } from 'react';
import { Form, Link, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { IconSearch } from '@tabler/icons-react';
import { useGetSearchProductQuery } from '../../api/ProductReducer/ProductApi';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SearchProps extends SelectItemProps {
	name: string;
	id: string;
}

function Search(props: Omit<ComponentProps<typeof Autocomplete>, 'data'>) {
	const [searchParams, setSearchParams] = useSearchParams();
	const { data: products, isFetching } = useGetSearchProductQuery(
		searchParams.get('q') ? searchParams.get('q') : '',
		{ refetchOnMountOrArgChange: true }
	);
	const navigate = useNavigate();

	const inputRef = useRef<HTMLFormElement>(null);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const productsData = products?.map((product: any) => ({
		...product,
		value: product.label,
	}));
	const itemSearch = forwardRef<HTMLDivElement, SearchProps>(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		({ value, id, ...others }: SearchProps, ref) => (
			<div ref={ref} {...others}>
				<Link to={`/shopping/products/${id}`} style={{ textDecoration: 'none' }}>
					<Group>
						<Text>{value}</Text>
					</Group>
				</Link>
			</div>
		)
	);
	return (
		<Form role='search' ref={inputRef} method='GET' className={props.className}>
			<Autocomplete
				limit={14}
				itemComponent={itemSearch}
				styles={{
					input: {
						borderRadius: '20px !important',
						verticalAlign: 'middle',
					},
				}}
				defaultValue={searchParams.get('q') === null ? '' : searchParams.get('q')}
				type='search'
				nothingFound='Hãy thử từ khóa mới'
				aria-label='Search products'
				placeholder='Search'
				switchDirectionOnFlip
				onItemSubmit={(item) => {
					navigate(`/shopping/products/${item.id}`);
				}}
				onChange={(value: string) => {
					searchParams.set('q', value);
					setSearchParams(searchParams);
				}}
				icon={isFetching ? <Loader size='xs' /> : <IconSearch stroke={1.5} size={'20px'} />}
				name='q'
				data={productsData ? productsData : []}
			/>
		</Form>
	);
}

export default Search;
