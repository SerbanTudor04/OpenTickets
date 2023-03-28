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
  
  useEffect(() => {
    let current_mode=getPreferredColorScheme()
    // console.log(current_mode,mode);

    if(mode===current_mode)return;
    toggleMode()
    
  }, [])
  
 async  function submitInstall(e:any){
    e.preventDefault()
    const data= new FormData(e.target)
    console.log("lulu");
    const API_ADDRESS = data.get("backend_host") + ":"+data.get("backend_port")
    let r= await fetch(`${API_ADDRESS}/install`,{
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
  
  })
  }

  return (
   <>
   <div className="h-screen">
   <div className="absolute top-2 left-2">
      <DarkThemeToggle />
   </div>
    <div className="bg-white dark:bg-gray-900">
      <div className="flex flex-col justify-center items-center top-10 relative">
        <div className="w-1/2">
          <Card>
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
                  placeholder=""
                  required={true}
                  shadow={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="db_port" value="Port" />
                </div>
                <TextInput
                  id="db_port"
                  type="number"
                  placeholder=""
                  required={true}
                  shadow={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="db_name" value="Database name" />
                </div>
                <TextInput
                  id="db_name"
                  type="text"
                  placeholder=""
                  required={true}
                  shadow={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="db_username" value="Username" />
                </div>
                <TextInput
                  id="db_username"
                  type="text"
                  placeholder=""
                  required={true}
                  shadow={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="db_password" value="Password" />
                </div>
                <TextInput
                  id="db_password"
                  type="password"
                  placeholder=""
                  required={true}
                  shadow={true}
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
                  placeholder=""
                  required={true}
                  shadow={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="smtp_port" value="Port" />
                </div>
                <TextInput
                  id="smtp_port"
                  type="number"
                  placeholder=""
                  required={true}
                  shadow={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="smtp_username" value="Username" />
                </div>
                <TextInput
                  id="smtp_username"
                  type="text"
                  placeholder=""
                  required={true}
                  shadow={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="smtp_password" value="Password" />
                </div>
                <TextInput
                  id="smtp_password"
                  type="password"
                  placeholder=""
                  required={true}
                  shadow={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="smtp_sendername" value="Sender name" />
                </div>
                <TextInput
                  id="smtp_sendername"
                  type="text"
                  placeholder=""
                  required={true}
                  shadow={true}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="smtp_ssl" />
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
                  placeholder=""
                  required={true}
                  shadow={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="imap_port" value="Port" />
                </div>
                <TextInput
                  id="imap_port"
                  type="number"
                  placeholder=""
                  required={true}
                  shadow={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="imap_username" value="Username" />
                </div>
                <TextInput
                  id="imap_username"
                  type="text"
                  placeholder=""
                  required={true}
                  shadow={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="imap_password" value="Password" />
                </div>
                <TextInput
                  id="imap_password"
                  type="password"
                  placeholder=""
                  required={true}
                  shadow={true}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox id="imap_ssl" />
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
                  <Label htmlFor="email" value="Your email" />
                </div>
                <TextInput
                  id="email"
                  type="email"
                  placeholder="admin@opentickets.com"
                  required={true}
                  shadow={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password2" value="Your password" />
                </div>
                <TextInput
                  id="password2"
                  type="password"
                  required={true}
                  shadow={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="repeat-password" value="Repeat password" />
                </div>
                <TextInput
                  id="repeat-password"
                  type="password"
                  required={true}
                  shadow={true}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="agree" />
                <Label htmlFor="agree">
                  I agree with the
                  <a
                    href="/forms"
                    className="text-blue-600 hover:underline dark:text-blue-500"
                  >
                    {' '}terms and conditions
                  </a>
                </Label>
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
