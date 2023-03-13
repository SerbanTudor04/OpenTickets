import { Navbar, Avatar, Dropdown, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { getUserInfo, signOutUser } from "../../../../package/api/auth";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

export default  function ANavbar(props){
    const [userData,setUserData] =  useState(null)
    const [loading,setLoading] =  useState(true)
    const navigator = useNavigate()

    useEffect(()=>{
        async function callMeBaby(){
            let r = await  getUserInfo()

            setUserData(r)

            setLoading(false)
        }
        callMeBaby()
    },[])
    
    async function doSingOut(){
        Cookies.remove("__tgssessiontoken")
        await signOutUser()
        navigator('/admin/authenticate')
    }
    
    return (<>
    <Navbar
  fluid={true}
  rounded={true}
>
  <Navbar.Brand href="/admin">
    {/* <img
      src="https://flowbite.com/docs/images/logo.svg"
      className="mr-3 h-6 sm:h-9"
      alt="Flowbite Logo"
    /> */}
    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
      {props.appTitle}
    </span>
  </Navbar.Brand>
  <div className="flex md:order-2">
    {(()=>{
        if(loading){
            return <Spinner/>
        }
        return ( <Dropdown
            arrowIcon={false}
            inline={true}
            label={<Avatar alt="User settings" img={"https://api.dicebear.com/5.x/identicon/svg?seed="+userData?.username??"tgssoftware"} rounded={true}/>}
          >
            <Dropdown.Header>
              <span className="block text-sm">
                  {userData?.username}
              </span>
              <span className="block truncate text-sm font-medium">
              {userData?.email}
      
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={doSingOut}>
              Sign out 
            </Dropdown.Item>
          </Dropdown>)
    })()}
   
    <Navbar.Toggle />
  </div>

</Navbar>
    </>)
}