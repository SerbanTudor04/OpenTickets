import { Button, Label, Modal, Spinner, Table, TextInput } from "flowbite-react";
import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { getAppConfig, updateAppConfig } from "../../../package/api/aAppData";
import { isSuperUser } from "../../../package/api/auth";
import React from "react";
import { HiPencil } from "react-icons/hi";


export default function AMgmConfig(props){
    const [configs, setConfigs] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
        async function callMeBaby() {
            
            let r = await getAppConfig();
      
            setConfigs(r);
      
            setIsLoading(false);
          }
          callMeBaby();
    },[])

    if(isLoading===true){
        return (
            <>
              <div className="  ">
                <div className="flex  flex-col  justify-center items-center">
                  <Spinner />
                </div>
              </div>
            </>
          );
    }


    return (<>
    <section className="flex flex-col  justify-center items-center">
        <div className="w-3/4 grid grid-cols-1  ">
          <div className="">
            <Table hoverable={true} className="">
              <Table.Head>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Value</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Edit</span>
                </Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {configs.map((item:any, key) => {
                  return (
                    <Table.Row
                    key={key + "usersTR--" + item.id}
                      id={key + "usersTR--" + item.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </Table.Cell>
                      <Table.Cell>{item.value}</Table.Cell>

                      <Table.Cell>
                        {/* <Assign2MeModal item={item}/> */}
                        <UpdateConfig item={item}/>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
        </div>
      </section>

    </>)
}

function UpdateConfig(props){
    const {item} = props;

    const [isOpenModal, setisOpenModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [value, setValue] = useState(item.value || null);
    const navigate = useNavigate();
  
  
    async function updateItem(){
      setIsUpdating(true);
  
      let r = await updateAppConfig({name:item.name,value:value})
      console.debug(r)
      setIsUpdating(false);
      if(r){
        navigate(0)
        return
      }
  
    }
  
    function cancel(){
      setisOpenModal(false)
    }
  
    return (
      <>
        <Fragment>
          <Button
            pill={true}
            gradientMonochrome="info"
            outline={true}
            onClick={() => {
              setisOpenModal(true);
            }}
          >
            <HiPencil/>Edit
          </Button>
          <Modal show={isOpenModal} size="md" popup={true} onClose={cancel}>
            <Modal.Header />
            <Modal.Body>
              <div className="">

  
                <h1 className="mb-5 text-xl font-normal text-gray-900 dark:text-gray-400">
                  Update config
                  
                </h1>
                <div className="flex-col w-full mr-1">
                  <div className="mb-2 block">
                    <Label htmlFor="value" value="Value" />
                  </div>
                  <TextInput
                    id="value"
                    type="text"
                    placeholder="example"
                    required={true}
                    value={value}
                    
                    onChange={(e) => {
                      setValue(e.target.value)
                    }}
                  />
                </div>
                <div className="flex justify-center gap-4 pt-2">
                  <Button
                    gradientMonochrome="info"
                    pill={true}
                    outline={false}
                    onClick={updateItem}
                    className="w-full"
                  >
                    {isUpdating?<Spinner/> : <>Edit<HiPencil/></>}
                  </Button>

                </div>
              </div>
            </Modal.Body>
          </Modal>
        </Fragment>
      </>
    );
}
