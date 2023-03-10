import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { checkAuthentication } from "../../../package/api/auth";
import { Spinner } from "flowbite-react";
import AdminLayout from "./AdminLayout";

export default function ProtectedRoute  ({
    redirectPath = '/admin/authenticate',
    children,
  })  {
    const [authToken] = useState(Cookies.get("__tgssessiontoken"))
    const [authenticated,setAuthenticated] =  useState(false)
    const [loading,setLoading] =  useState(true)
  
  
    useEffect(()=>{
      async function callMeBaby(){
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
    return <AdminLayout>
      {children}
    </AdminLayout>;
  };