import { Tabs } from "antd";

export const TabsFilter = ({ activeKey, onChange, items }) => {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 2,
        background: "#fafafa",
        paddingBottom: 12,
      }}
    >
      <Tabs activeKey={activeKey} onChange={onChange} centered items={items} />
    </div>
  );
};