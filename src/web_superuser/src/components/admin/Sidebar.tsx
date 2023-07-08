import { Sidebar } from "flowbite-react";
import { HiUser,HiInbox,HiOfficeBuilding, HiMenu, HiOutlinePresentationChartBar,  } from "react-icons/hi";
import { HiTableCells,  } from "react-icons/hi2";
import { BsFillPeopleFill } from "react-icons/bs";
import { BiDoughnutChart,BiExtension } from "react-icons/bi";
import React from "react";
import { useNavigate } from "react-router-dom";


export default  function ASideBar(props){
  const navigate = useNavigate()



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
          onClick={()=>{navigate("/")}}
          icon={BiDoughnutChart}
        >
          Dashboard
        </Sidebar.Item>
        
        

          <Sidebar.Item icon={HiUser} 
            onClick={()=>{navigate("/management/users")}}
          >
            Users 
          </Sidebar.Item>
          <Sidebar.Item icon={HiOfficeBuilding} onClick={()=>{navigate("/management/departments")}}>
            Departments
          </Sidebar.Item>
          <Sidebar.Item icon={HiTableCells}  onClick={()=>{navigate("/management/config")}} >
            Config
          </Sidebar.Item>
        <Sidebar.Item
         onClick={()=>{navigate("/management/templates")}}
    
          icon={BiExtension}
        >
          Templates
          </Sidebar.Item>
          <Sidebar.Item
          onClick={()=>{navigate("/management/clients")}}
           
          icon={BsFillPeopleFill}
        >
          Clients
          </Sidebar.Item>
          <Sidebar.Item
          onClick={()=>{navigate("/management/reports")}}
           
          icon={HiOutlinePresentationChartBar}
        >
          Reports
          </Sidebar.Item>
      </Sidebar.ItemGroup>
      
    </Sidebar.Items>
  </Sidebar>
    </div>
    </>)
}