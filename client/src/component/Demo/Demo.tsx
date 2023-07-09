import { useNavigate, useParams } from "react-router-dom";
import { Tabs } from "@mantine/core";

function Demo() {
  const navigate = useNavigate();
  const { tabValue } = useParams();

  return (
    <Tabs value={tabValue} onTabChange={(value) => navigate(`/tabs/${value}`)}>
      <Tabs.List>
        <Tabs.Tab value="first">First tab</Tabs.Tab>
        <Tabs.Tab value="second">Second tab</Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}
export default Demo;