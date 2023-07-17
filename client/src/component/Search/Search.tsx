import { Autocomplete, Loader } from "@mantine/core";
import { ComponentProps } from "react";
function Search(props: Omit<ComponentProps<typeof Autocomplete>, "data">) {
  return (
    <Autocomplete
      styles={{
        input: {
          borderRadius: "20px !important",
        },
      }}
      className={props.className}
      placeholder="Search "
      // icon={<IconSearch size="1rem" stroke={2} />}
      icon={<Loader size="xs" />}
      data={[
        { value: "TV", group: "Bạn vừa search" },
        { value: "Tủ lạnh", group: "Bạn vừa search" },
        { value: "Beth", group: "Xu hướng" },
        { value: "Summer", group: "Xu hướng" },
      ]}
    />
  );
}

export default Search;
