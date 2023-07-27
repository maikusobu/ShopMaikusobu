import {
  Autocomplete,
  Group,
  Loader,
  SelectItemProps,
  Text,
} from "@mantine/core";
import { ComponentProps, useRef, forwardRef } from "react";
import { useLoaderData, Form, useSubmit } from "react-router-dom";
import { loader } from "./searchAction";
import { useNavigation } from "react-router-dom";
import { IconSearch } from "@tabler/icons-react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SearchProps extends SelectItemProps {
  name: string;
}

const itemSearch = forwardRef<HTMLDivElement, SearchProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ value, ...others }: SearchProps, ref) => (
    <div ref={ref} {...others}>
      <Group>
        <Text>{value}</Text>
      </Group>
    </div>
  )
);

function Search(props: Omit<ComponentProps<typeof Autocomplete>, "data">) {
  const { products, q } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const submit = useSubmit();
  const navigation = useNavigation();
  const inputRef = useRef<HTMLFormElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productsData = products?.map((product: any) => ({
    ...product,
    value: product.label,
  }));
  console.log(productsData);
  return (
    <Form role="search" ref={inputRef} method="GET" className={props.className}>
      <Autocomplete
        limit={25}
        itemComponent={itemSearch}
        styles={{
          input: {
            borderRadius: "20px !important",
            verticalAlign: "middle",
          },
        }}
        defaultValue={q as string}
        type="search"
        nothingFound="Hãy thử từ khóa mới"
        aria-label="Search products"
        placeholder="Search"
        switchDirectionOnFlip
        onChange={() => {
          const isFirstSearch = q == null;
          submit(new FormData(inputRef?.current as HTMLFormElement), {
            replace: !isFirstSearch,
          });
        }}
        icon={
          navigation.state === "loading" ? (
            <Loader size="xs" />
          ) : (
            <IconSearch stroke={1.5} size={"20px"} />
          )
        }
        name="q"
        data={productsData ? productsData : []}
      />
    </Form>
  );
}

export default Search;
