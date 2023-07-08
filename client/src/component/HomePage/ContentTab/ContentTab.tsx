import { Tabs } from "@mantine/core";
function ContentTab() {
  return (
    <Tabs variant="pills" color="green" defaultValue="commercial">
      <Tabs.List
        position="left"
        style={{
          gap: "1rem",
        }}
      >
        <Tabs.Tab value="commercial">Shopping</Tabs.Tab>
        <Tabs.Tab value="social">Social</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="commercial">Commerical content</Tabs.Panel>
      <Tabs.Panel value="social">Social content</Tabs.Panel>
    </Tabs>
  );
}

export default ContentTab;
