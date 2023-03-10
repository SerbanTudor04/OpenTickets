import { Sidebar } from "flowbite-react";
import { HiChartPie,HiViewBoards,HiUser,HiInbox,HiOfficeBuilding, HiChatAlt2, HiBell, HiPlus, HiClock } from "react-icons/hi";
import { BiBuoy,BiStore } from "react-icons/bi";
import { useEffect, useState } from "react";
import { getUserInboxNumber } from "../../../../package/api/ausers";


export default  function ASideBar(){
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
          href="/admin/"
          icon={HiChartPie}
        >
          Dashboard
        </Sidebar.Item>
        {(()=>{
          if (inboxNumber>0){
            return  <Sidebar.Item
            href="/admin/inbox"
            icon={HiInbox}
            label={inboxNumber}
          >
            Inbox
          </Sidebar.Item>
          }
          return <Sidebar.Item
          href="/admin/inbox"
          icon={HiInbox}
          
        >
          Inbox
        </Sidebar.Item>
          
        })()}
        <Sidebar.Collapse
          
          icon={HiChatAlt2}
          label="Tickets"
        >
          <Sidebar.Item icon={HiPlus} href="/admin/tickets/create">
            Create Ticket
          </Sidebar.Item>          
          <Sidebar.Item icon={HiUser} href="/admin/tickets/mytickets">
            Your Tickets
          </Sidebar.Item>
          <Sidebar.Item icon={HiClock} href="/admin/tickets/pending-tickets">
            In Pending Tickets
          </Sidebar.Item>
          <Sidebar.Item icon={HiBell} href="/admin/tickets/free-tickets">
            Free Tickets
          </Sidebar.Item>
        </Sidebar.Collapse>
        <Sidebar.Collapse
          href="/admin/users"
          icon={BiStore}
          label="Mangement"
        >
          <Sidebar.Item icon={HiUser} href="/admin/management/users">
            Users 
          </Sidebar.Item>
          <Sidebar.Item icon={HiOfficeBuilding} href="/admin/management/departments">
            Departments
          </Sidebar.Item>
        </Sidebar.Collapse>
        
      </Sidebar.ItemGroup>
       <Sidebar.ItemGroup className="">
        <Sidebar.Item
          href="#"
          icon={HiViewBoards}
        >
          Documentation
        </Sidebar.Item>
        <Sidebar.Item
          href="#"
          icon={BiBuoy}
        >
          Help
        </Sidebar.Item>
      </Sidebar.ItemGroup>
    </Sidebar.Items>
  </Sidebar>
    </div>
    </>)
}