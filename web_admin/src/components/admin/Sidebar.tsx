import { Sidebar } from "flowbite-react";
import { HiViewBoards,HiUser,HiInbox,HiChatAlt2, HiBell, HiPlus, HiClock,  } from "react-icons/hi";

import { BiBuoy,BiDoughnutChart } from "react-icons/bi";
import { useEffect, useState } from "react";
import { getUserInboxNumber } from "../../../../package/api/ausers";


export default  function ASideBar(props:any){
  const [inboxNumber,setInboxNumber] = useState<any>(null)

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
      // href="#"
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
        <Sidebar.Collapse
          
          icon={HiChatAlt2}
          label="Tickets"
        >
          <Sidebar.Item icon={HiPlus} href="/tickets/create">
            Create Ticket
          </Sidebar.Item>          
          <Sidebar.Item icon={HiUser} href="/tickets/mytickets">
            My Tickets
          </Sidebar.Item>
          <Sidebar.Item icon={HiClock} href="/tickets/pending-tickets">
            In Pending Tickets
          </Sidebar.Item>
          <Sidebar.Item icon={HiBell} href="/tickets/free-tickets">
            Free Tickets
          </Sidebar.Item>
        </Sidebar.Collapse>
       
        
      </Sidebar.ItemGroup>
       <Sidebar.ItemGroup className="">
        <Sidebar.Item
          href="/documentation"
          icon={HiViewBoards}
        >
          Documentation
        </Sidebar.Item>
        <Sidebar.Item
          href="/help"
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