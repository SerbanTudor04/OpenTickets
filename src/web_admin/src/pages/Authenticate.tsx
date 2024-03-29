import { Button, Card, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { doLogin } from "../../../package/api/auth";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import React from "react";
import { toast } from "react-toastify";

export default function Authenticate() {
  const [isLoading, setIsLoading] = useState(false);
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigator = useNavigate()

  async function callLogin(event:any){
    event.preventDefault();      
    setIsLoading(true)
    // console.log(event.target.value);
    
    
    let r=await doLogin(email,password);

    if(r.status==403){
      setIsLoading(false)
      toast("Wrong email or password")
      return 
    }
    let data = await r.json()
    let token  = data.auth_token

    console.debug(token)

    console.debug("current token",token)
    Cookies.remove("__open-tickets-sessiontoken")
    Cookies.set("__open-tickets-sessiontoken",String(token))
    
    
    setIsLoading(false)


    navigator("/")
  }




  return (
    <>
      <div className="h-screen bg-blue-500 ">
        <div className="flex flex-col items-center m-auto max-w-screen-xl justify-start   xl:w-1/3 sm:w-full py-56">
          <Card>
            <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Complete the fields in order to authenticate
            </h5>
            <form className="flex flex-col gap-4" onSubmit={callLogin}>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email" value="Your email" />
                </div>
                <TextInput
                  id="email"
                  type="email"
                  placeholder="example@tgssoftware.ro"
                  onChange={(e)=>{
                    setEmail(e.target.value);
                  }}
                  required={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password" value="Your password" />
                </div>
                <TextInput
                  id="password"
                  type="password"
                  placeholder="********"
                  required={true}
                  onChange={(e)=>{
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center gap-2"></div>
              {(() => {
                if (!isLoading) {
                  return <Button type="submit">Login</Button>;
                }
                return (
                  <Button disabled={true}>
                    <Spinner aria-label="Spinner button example" />
                    <span className="pl-3">Loading...</span>
                  </Button>
                );
              })()}
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
