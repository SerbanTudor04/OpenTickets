import { Sidebar } from "flowbite-react";
import {
  HiViewBoards,
  HiUser,
  HiInbox,
  HiChatAlt2,
  HiBell,
  HiPlus,
  HiClock,
} from "react-icons/hi";

import { BiBuoy, BiDoughnutChart } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function ASideBar() {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-fit">
        <Sidebar aria-label="Default sidebar example">
          <Sidebar.Logo
          // href="#"
          >
            Menu
          </Sidebar.Logo>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                onClick={() => {
                  navigate("/");
                }}
                icon={BiDoughnutChart}
              >
                Dashboard
              </Sidebar.Item>

              <Sidebar.Collapse icon={HiChatAlt2} label="Tickets">
                <Sidebar.Item
                  icon={HiPlus}
                  onClick={() => {
                    navigate("/tickets/create");
                  }}
                >
                  Create Ticket
                </Sidebar.Item>
                <Sidebar.Item
                  icon={HiUser}
                  onClick={() => {
                    navigate("/tickets/mytickets");
                  }}
                >
                  My Tickets
                </Sidebar.Item>
                <Sidebar.Item
                  icon={HiClock}
                  onClick={() => {
                    navigate("/tickets/pending-tickets");
                  }}
                >
                  Tickets In Pending
                </Sidebar.Item>
                <Sidebar.Item
                  icon={HiBell}
                  onClick={() => {
                    navigate("/tickets/free-tickets");
                  }}
                >
                  Free Tickets
                </Sidebar.Item>
              </Sidebar.Collapse>
            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup className="">
              <Sidebar.Item
                onClick={() => {
                  navigate("/documentation");
                }}
                icon={HiViewBoards}
              >
                Documentation
              </Sidebar.Item>
              <Sidebar.Item
                onClick={() => {
                  navigate("/help");
                }}
                icon={BiBuoy}
              >
                Help
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
    </>
  );
}
