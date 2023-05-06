import { Sidebar } from "flowbite-react";
import { HiViewBoards,HiUser,HiInbox,HiOfficeBuilding, HiChatAlt2, HiBell, HiPlus, HiClock,  } from "react-icons/hi";
import { HiTableCells,  } from "react-icons/hi2";

import { BiBuoy,BiDoughnutChart,BiExtension,BiStore } from "react-icons/bi";
import { useEffect, useState } from "react";
import { getUserInboxNumber } from "../../../../package/api/ausers";


export default  function ASideBar(props){
  const [inboxNumber,setInboxNumber] = useState(null)

  useEffect(()=>{
    async function callMeBaby(){
        let r = await  getUserInboxNumber()
        
        setInboxNumber(r.inbox_counter)

    }
    callMeBaby()
},[])


    return (<>
    <div className="w-fit">
    <Sidebar aria-label="Default sidebar example">
    <Sidebar.Logo
      href="#"
    >
      Menu
    </Sidebar.Logo>
    <Sidebar.Items>
      <Sidebar.ItemGroup>
        <Sidebar.Item
          href="/"
          icon={BiDoughnutChart}
        >
          Dashboard
        </Sidebar.Item>
        {(()=>{
          if (inboxNumber>0){
            return  <Sidebar.Item
            href="/inbox"
            icon={HiInbox}
            label={inboxNumber}
          >
            Inbox
          </Sidebar.Item>
          }
          return <Sidebar.Item
          href="/inbox"
          icon={HiInbox}
          
        >
          Inbox
        </Sidebar.Item>
          
        })()}
        

          <Sidebar.Item icon={HiUser} href="/management/users">
            Users 
          </Sidebar.Item>
          <Sidebar.Item icon={HiOfficeBuilding} href="/management/departments">
            Departments
          </Sidebar.Item>
          <Sidebar.Item icon={HiTableCells} href="/management/config">
            Config
          </Sidebar.Item>
        <Sidebar.Item
           href="/management/templates"
          icon={BiExtension}
        >
          Templates
          </Sidebar.Item>
        
      </Sidebar.ItemGroup>
      
    </Sidebar.Items>
  </Sidebar>
    </div>
    </>)
}