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
          href="/"
          icon={HiChartPie}
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
        <Sidebar.Collapse
          
          icon={HiChatAlt2}
          label="Tickets"
        >
          <Sidebar.Item icon={HiPlus} href="/tickets/create">
            Create Ticket
          </Sidebar.Item>          
          <Sidebar.Item icon={HiUser} href="/tickets/mytickets">
            Your Tickets
          </Sidebar.Item>
          <Sidebar.Item icon={HiClock} href="/tickets/pending-tickets">
            In Pending Tickets
          </Sidebar.Item>
          <Sidebar.Item icon={HiBell} href="/tickets/free-tickets">
            Free Tickets
          </Sidebar.Item>
        </Sidebar.Collapse>
        <Sidebar.Collapse
          href="/users"
          icon={BiStore}
          label="Mangement"
        >
          <Sidebar.Item icon={HiUser} href="/management/users">
            Users 
          </Sidebar.Item>
          <Sidebar.Item icon={HiOfficeBuilding} href="/management/departments">
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