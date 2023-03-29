import { Card } from "flowbite-react";
import {
  Button,
  Checkbox,
  DarkThemeToggle,
  Label,
  TextInput,
  useThemeMode,
} from "flowbite-react/lib/esm/components";
import { useState,useEffect, FormEventHandler } from "react";

import "./App.css";

function getPreferredColorScheme() {
  if (window.matchMedia) {
    if(window.matchMedia('(prefers-color-scheme: dark)').matches){
      return 'dark';
    } else {
      return 'light';
    }
  }
  return 'light';
}

function App() {
  const [mode, setMode, toggleMode] = useThemeMode();
  const [apiADDR, setApiAddr] = useState('')
  const [sendData, setSendData] = useState({
    db_ip:"",
    db_port:"",
    db_name:"",
    db_schemas:"",
    db_username:"",
    db_password:"",
    smtp_host:"",
    smtp_port:"",
    smtp_username:"",
    smtp_password:"",
    smtp_sendername:"",
    smtp_ssl:"",
    imap_host:"",
    imap_port:"",
    imap_username:"",
    imap_password:"",
    imap_ssl:"",
    admin_email:"",
    admin_password:"",
    admin_repeatpassword:"",
    backend_host:"",
    backend_port:"",
    backend_location:"",
  })
  
  useEffect(() => {
    let current_mode=getPreferredColorScheme()
    // console.log(current_mode,mode);

    if(mode===current_mode)return;
    toggleMode()
    
  }, [])
  
 async  function submitInstall(e:any){
    e.preventDefault()
    // deepcode ignore Ssrf: is used to call a dinamic api for installation
    let r = await  fetch(`${apiADDR}/health`,{
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      method: 'GET',
  
  }) 

  if(!r.ok){
    // TODO implement messages
    return 
  }


    // deepcode ignore Ssrf: is used to call a dinamic api for installation
    await fetch(`${apiADDR}`,{
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(sendData)
  
  })
  }

  return (
   <>
   <div className="h-auto">
   <div className="absolute top-2 left-2">
      <DarkThemeToggle />
   </div>
    <div className="h-auto bg-white dark:bg-gray-900">
      <div className="flex flex-col justify-center items-center top-10 relative">
        <div className="w-1/2">
          <Card className="mb-5">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Install API location
            </h5>
            <div className="flex flex-col gap-4">
            <div>
                <div className="mb-2 block">
                  <Label htmlFor="install_api" value="Host" />
                </div>
                <TextInput
                  id="install_api"
                  type="text"
                  value={apiADDR}
                  onChange={(e)=>{
                    let val=e.target.value
                    setApiAddr(val) 
                  }}
                  placeholder="http://example.com:3000/install/api"
                  required={true}
                  shadow={true}
                />
              </div>
            </div>
          </Card>
          <Card className="mb-28">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Setup
            </h5>
            <form onSubmit={submitInstall} className="flex flex-col gap-4">
              <div>
                <p className="text-md font-bold tracking-tight text-gray-400 dark:text-white">
                  Postgres configuration (Database)
                </p>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="db_ip" value="Host" />
                </div>
                <TextInput
                  id="db_ip"
                  type="text"
                  placeholder="localhost"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.db_ip=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="db_port" value="Port" />
                </div>
                <TextInput
                  id="db_port"
                  type="number"
                  placeholder="5432"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.db_port=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="db_name" value="Database name" />
                </div>
                <TextInput
                  id="db_name"
                  type="text"
                  placeholder="opentickets"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.db_name=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="db_schemas" value="Database schemas" />
                </div>
                <TextInput
                  id="db_schemas"
                  type="text"
                  placeholder="public,tickets,..... comma separated"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.db_schemas=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="db_username" value="Username" />
                </div>
                <TextInput
                  id="db_username"
                  type="text"
                  placeholder="opentickets"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.db_username=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="db_password" value="Password" />
                </div>
                <TextInput
                  id="db_password"
                  type="password"
                  placeholder="*************"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.db_password=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div>
                <hr />
              </div>

              <div>
                <p className="text-md font-bold tracking-tight text-gray-400 dark:text-white">
                  Smtp configuration
                </p>
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="smtp_host" value="Host" />
                </div>
                <TextInput
                  id="smtp_host"
                  type="text"
                  placeholder="smtp.opentickets.com"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.smtp_host=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="smtp_port" value="Port" />
                </div>
                <TextInput
                  id="smtp_port"
                  type="number"
                  placeholder="587"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.smtp_port=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="smtp_username" value="Username" />
                </div>
                <TextInput
                  id="smtp_username"
                  type="text"
                  placeholder="support@opentickets.com"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.smtp_username=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="smtp_password" value="Password" />
                </div>
                <TextInput
                  id="smtp_password"
                  type="password"
                  placeholder="*************"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.smtp_password=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="smtp_sendername" value="Sender name" />
                </div>
                <TextInput
                  id="smtp_sendername"
                  type="text"
                  placeholder="Open Tickets Awesome Team"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.smtp_sendername=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                    onChange={(e)=>{
                      let val= e.target.value
                      let currItems={...sendData}
                      currItems.smtp_ssl=val;
                      setSendData(currItems)
                    }}
                  defaultChecked id="smtp_ssl" />
                <Label htmlFor="smtp_ssl">
                  Enable connection SSL
                </Label>
              </div>
              <div>
                <hr />
              </div>

              <div>
                <p className="text-md font-bold tracking-tight text-gray-400 dark:text-white">
                  Imap configuration
                </p>
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="imap_host" value="Host" />
                </div>
                <TextInput
                  id="imap_host"
                  type="text"
                  placeholder="imap.opentickets.com"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.imap_host=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="imap_port" value="Port" />
                </div>
                <TextInput
                  id="imap_port"
                  type="number"
                  placeholder="993"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.imap_port=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="imap_username" value="Username" />
                </div>
                <TextInput
                  id="imap_username"
                  type="text"
                  placeholder="support@opentickets.com"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.imap_username=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="imap_password" value="Password" />
                </div>
                <TextInput
                  id="imap_password"
                  type="password"
                  placeholder="*************"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.imap_password=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                                  onChange={(e)=>{
                                    let val= e.target.value
                                    let currItems={...sendData}
                                    currItems.imap_ssl=val;
                                    setSendData(currItems)
                                  }}
                defaultChecked id="imap_ssl" />
                <Label htmlFor="imap_ssl">
                  Enable connection SSL
                </Label>
              </div>
              <div>
                <hr />
              </div>
              <div>
                <p className="text-md font-bold tracking-tight text-gray-400 dark:text-white">
                  Admin user configuration
                </p>
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="admin_email" value="Your email" />
                </div>
                <TextInput
                  id="admin_email"
                  type="email"
                  placeholder="admin@opentickets.com"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.admin_email=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="admin_password" value="Your password" />
                </div>
                <TextInput
                  id="admin_password"
                  type="password"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.admin_password=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="admin_repeatpassword" value="Repeat password" />
                </div>
                <TextInput
                  id="admin_repeatpassword"
                  type="password"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.admin_repeatpassword=val;
                    setSendData(currItems)
                  }}
                />
              </div>
            

              <div>
                <hr />
              </div>
              <div>
                <p className="text-md font-bold tracking-tight text-gray-400 dark:text-white">
                  Backend
                </p>
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="backend_host" value="Host" />
                </div>
                <TextInput
                  id="backend_host"
                  type="text"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.backend_host=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="backend_port" value="Port" />
                </div>
                <TextInput
                  id="backend_port"
                  type="number"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.backend_port=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="backend_location" value="Location" />
                </div>
                <TextInput
                  id="backend_location"
                  type="text"
                  required={true}
                  shadow={true}
                  onChange={(e)=>{
                    let val= e.target.value
                    let currItems={...sendData}
                    currItems.backend_location=val;
                    setSendData(currItems)
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox defaultChecked={true} id="agree" />
                <Label htmlFor="agree">
                  Production mode
                 
                </Label>
              </div>

              <Button type="submit">Install</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
   </div>
   </>
  );
}

export default App;
