import { Tabs } from "flowbite-react";
import DocsDashboardTabs from "./DocsDashboardTab";

import { IoBarChart, IoMailSharp, IoTicketOutline } from "react-icons/io5";
import DocsTicketsTab from "./DocsTicketsTab";

export default function DocsTabs() {
  return (
    <>
      <Tabs.Group aria-label="Documentation tabs" style="underline">
        <Tabs.Item active={true} title="Dashboard" icon={IoBarChart}>
          <DocsDashboardTabs/>
        </Tabs.Item>
        <Tabs.Item title="Tickets" icon={IoTicketOutline}>
         <DocsTicketsTab/>
        </Tabs.Item>
        {/* <Tabs.Item title="Inbox" icon={IoMailSharp}>
          Inbox
        </Tabs.Item> */}
      </Tabs.Group>
    </>
  );
}
