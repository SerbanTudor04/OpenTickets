import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { checkAuthentication } from "../../../package/api/auth";
import { Spinner } from "flowbite-react";
import AdminLayout from "./AdminLayout";
import Helmet from "react-helmet"
import { getAdminPageTitle } from "../../../package/api/aAppData";



export default function ProtectedRoute  ({
    redirectPath = '/authenticate',
    children,
  })  {
    const [authToken] = useState(Cookies.get("__open-tickets-sessiontoken"))
    const [authenticated,setAuthenticated] =  useState(false)
    const [loading,setLoading] =  useState(true)
    
    const [appTitle,setAppTitle]= useState(Cookies.get("__open-tickets-app-title__cache"))
    
  
    useEffect(()=>{
      async function callMeBaby(){
        if(!appTitle){
          let title=(await getAdminPageTitle()).title
          Cookies.set("__open-tickets-app-title__cache",title)
          setAppTitle(title)
        
        }
        let r= await checkAuthentication(authToken)



        setAuthenticated(r)
        setLoading(false)
      }
      callMeBaby()
    },[authToken])
  

    if (!authenticated && !loading) {
      return <Navigate to={redirectPath} replace />;
    }
  
    if (loading){
      return (<>
        <div className=" relative h-screen w-screen">
          <div className="flex  flex-row min-h-screen justify-center items-center"><Spinner/></div>
        </div>
      </>)
    }
    return <AdminLayout appTitle={appTitle}  >
      <div>
            <Helmet title={appTitle}/>
      </div>
      {children}
    </AdminLayout>;
  };