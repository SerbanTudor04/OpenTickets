import { Sidebar } from "flowbite-react";
import { HiViewBoards,HiUser,HiInbox,HiChatAlt2, HiBell, HiPlus, HiClock,  } from "react-icons/hi";

import { BiBuoy,BiDoughnutChart } from "react-icons/bi";
import { useEffect, useState } from "react";
import { getUserInboxNumber } from "../../../../package/api/ausers";
import { useNavigate } from "react-router-dom";


export default  function ASideBar(props:any){
  const [inboxNumber,setInboxNumber] = useState<any>(null)
  const navigate = useNavigate()
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
          
          onClick={()=>{navigate('/')}}
          icon={BiDoughnutChart}
        >
          Dashboard
        </Sidebar.Item>
        {(()=>{
          if (inboxNumber>0){
            return  <Sidebar.Item
            
          onClick={()=>{navigate('/inbox')}}

            icon={HiInbox}
            label={inboxNumber}
          >
            Inbox
          </Sidebar.Item>
          }
          return <Sidebar.Item
          onClick={()=>{navigate('/inbox')}}
          icon={HiInbox}
          
        >
          Inbox
        </Sidebar.Item>
          
        })()}
        <Sidebar.Collapse
          
          icon={HiChatAlt2}
          label="Tickets"
        >
          <Sidebar.Item icon={HiPlus}
          onClick={()=>{navigate('/tickets/create')}}
          >
            Create Ticket
          </Sidebar.Item>          
          <Sidebar.Item icon={HiUser} onClick={()=>{navigate('/tickets/mytickets')}}>
            My Tickets
          </Sidebar.Item>
          <Sidebar.Item icon={HiClock} onClick={()=>{navigate('/tickets/pending-tickets')}}>
            In Pending Tickets
          </Sidebar.Item>
          <Sidebar.Item icon={HiBell} onClick={()=>{navigate('/tickets/free-tickets')}}>
            Free Tickets
          </Sidebar.Item>
        </Sidebar.Collapse>
       
        
      </Sidebar.ItemGroup>
       <Sidebar.ItemGroup className="">
        <Sidebar.Item
        onClick={()=>{navigate('/documentation')}}
          
          icon={HiViewBoards}
        >
          Documentation
        </Sidebar.Item>
        <Sidebar.Item
        onClick={()=>{navigate('/help')}}
          
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