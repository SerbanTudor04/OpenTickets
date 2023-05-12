import { Sidebar } from "flowbite-react";
import { HiUser,HiInbox,HiOfficeBuilding, HiMenu,  } from "react-icons/hi";
import { HiTableCells,  } from "react-icons/hi2";
import { BsFillPeopleFill } from "react-icons/bs";
import { BiDoughnutChart,BiExtension } from "react-icons/bi";
import { useEffect, useState } from "react";
import { getUserInboxNumber } from "../../../../package/api/ausers";
import React from "react";


export default  function ASideBar(props){
  const [inboxNumber,setInboxNumber] = useState(0)

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
      // icon={HiMenu}
      img={""}
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
          <Sidebar.Item
           href="/management/clients"
          icon={BsFillPeopleFill}
        >
          Clients
          </Sidebar.Item>
      </Sidebar.ItemGroup>
      
    </Sidebar.Items>
  </Sidebar>
    </div>
    </>)
}