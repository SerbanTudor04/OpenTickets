import { Navbar, Avatar, Dropdown, Tooltip } from "flowbite-react";
import { useState, useMemo } from "react";
import { getUserInfo, signOutUser } from "../../../../package/api/auth";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { HiBell } from "react-icons/hi";
import InboxComponent from "../../pages/AInbox";

export default function ANavbar(props: any) {
  const [userData, setUserData] = useState<any>({});

  useMemo(async () => {
    let r = await getUserInfo();
    console.debug(r);
    setUserData(r);
    return r;
  }, [Cookies.get("__open-tickets-sessiontoken")]);

  const navigator = useNavigate();

  async function doSingOut() {
    Cookies.remove("__tgssessiontoken");
    await signOutUser();
    navigator("/authenticate");
  }

  return (
    <>
      <Navbar fluid={true} rounded={true}>
        <Navbar.Brand href="/">
          {/* <img
      src="https://flowbite.com/docs/images/logo.svg"
      className="mr-3 h-6 sm:h-9"
      alt="Flowbite Logo"
    /> */}
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            {props.appTitle} - SuperUser
          </span>
        </Navbar.Brand>
        <div className="flex flex-row gap-2 md:order-2">
          <Dropdown  
            arrowIcon={false}

            inline={true}
            label={
              <Tooltip content="Notifications" placement="bottom">
                           <button type="button" className="text-gray-700  hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:focus:ring-gray-800 dark:hover:bg-gray-500">
              <HiBell className="w-5 h-5"/>
              <span className="sr-only">Notifications</span>
            </button>
              </Tooltip>
            }>
            <div className="">
            <InboxComponent/>
            </div>
          </Dropdown>
          <Dropdown
            arrowIcon={false}
            inline={true}
            label={
              <Avatar
                alt="User settings"
                img={
                  "https://api.dicebear.com/5.x/identicon/svg?seed=" +
                    userData?.username ?? "tgssoftware"
                }
                rounded={true}
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{userData?.username}</span>
              <span className="block truncate text-sm font-medium">
                {userData?.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={doSingOut}>Sign out</Dropdown.Item>
          </Dropdown>

          <Navbar.Toggle />
        </div>
      </Navbar>
    </>
  );
}
