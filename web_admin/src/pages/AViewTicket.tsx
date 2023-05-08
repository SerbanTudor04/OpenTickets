import { Spinner, Card, Button, Dropdown } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addMessage2TicketsOrMessage,
  getTicketByID,
  getTicketMessages,
  getTicketsStatusCodes,
} from "../../../package/api/atickets";
// import { Editor } from "@tinymce/tinymce-react";
import { HiClock, HiEyeOff } from "react-icons/hi";
import React from "react";

export default function AViewTicket() {
  let { id } = useParams();
  const [ticket, setTicket] = useState({
    isAllowed2View:false,
    ticket_data:{
      subject:null,
      description:null,
      code:null,
      status:null,
      content:null,
      created_at:"",
      updated_at:"",
    }
  });
  const [loadingTicket, setLoadingTicket] = useState(true);
  useEffect(() => {
    async function callMeBaby() {
      let r = await getTicketByID(id);

      setTicket(r);
      setLoadingTicket(false);
    }
    callMeBaby();
  }, []);

  if (loadingTicket && ticket === null) {
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

  if (ticket === null) {
    return (
      <>
        <div className="  ">
          <div className="flex  flex-col  justify-center items-center">
            <p>
              A ticket with this{" "}
              <span className="text-bold text-blue-600">ID</span> doen't exists.
            </p>
            <p>Please go back and enter on the right ticket.</p>
          </div>
        </div>
      </>
    );
  }
  if (!ticket?.isAllowed2View) {
    return (
      <div className="  ">
        <div className="flex  flex-col  justify-center items-center">
          <p>You are not allowed to see this ticket.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="flex flex-col  justify-center items-center">
        <div className="w-3/4 pb-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Ticket view
          </h1>
        </div>
        <div className="w-3/4">
          <Card>
            <div className="grid grid-cols-6">
              <div className="col-start-1 col-end-3">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {ticket?.ticket_data?.subject}
                </h5>
                <p className="font-normal text-gray-300 dark:text-gray-400 ">
                  {ticket?.ticket_data?.description}
                </p>
              </div>
              <div className="col-start-6">
                <p className="font-normal text-gray-300 dark:text-gray-400 text-right">
                  #{ticket?.ticket_data?.code}
                </p>
                <p className="font-normal text-gray-300 dark:text-gray-400 text-right">
                  {ticket?.ticket_data?.status}
                </p>
              </div>
            </div>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: ticket?.ticket_data?.content! }}
            ></div>
          </Card>
          <div className="grid grid-cols-6">
            <div className="col-start-1 col-end-3">
              <p className="text-xs text-gray-300 dark:text-gray-400 ">
                Created:{" "}
                {new Date(ticket?.ticket_data?.created_at).toLocaleString(
                  "en-US"
                )}
              </p>
            </div>
            <div className="col-start-6 col-end-6">
              <p className="text-xs text-gray-300 dark:text-gray-400 ">
                Updated:{" "}
                {new Date(ticket?.ticket_data?.updated_at).toLocaleString(
                  "en-US"
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col  justify-center items-center">
        <div className="w-3/4 pt-10">
          <HandleMessage ticket={ticket} />
        </div>
      </section>
      <section className="flex flex-col  justify-center items-center">
        <div className="w-3/4 pt-10">
          <AddComment id={null} ticket={ticket} />
        </div>
      </section>
    </>
  );
}

function AddComment(props) {
  const [message, setMessage] = useState({
    content: "",
    ticket_raw_state: props?.ticket?.ticket_data?.raw_status,
    ticket_state: props?.ticket?.ticket_data?.status,
    edited_state: null,
  });
  const [statuses, setStatuses] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isMarkAsSelected, setIsMarkAsSelected] = useState(false);
  const navigator = useNavigate();

  useEffect(() => {
    async function callMeBaby() {
      setIsInitialLoading(true);

      let r = await getTicketsStatusCodes();

      setStatuses(r);
      setIsInitialLoading(false);
    }
    callMeBaby();
  }, []);

  async function create() {
    setIsLoading(true);

    console.debug(message);
    var data = {
      ticket_id: props?.ticket?.ticket_data?.id,
      content: message.content,
      ticket_status:props?.ticket?.ticket_data?.ticket_status,
      master_message_id:null
    };
    if (isMarkAsSelected) {
      data.ticket_status = message.ticket_raw_state;
    }
    if (props?.messageMaster) {
      data.master_message_id = props?.messageMaster?.id;
    }
    let r = await addMessage2TicketsOrMessage(data);
    console.log("Called");

    setIsLoading(false);
    if (r) {
      navigator(0);
    }
  }
  if (isInitialLoading) {
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

  return (
    <>
      <hr className="pb-3" />
      <form className="flex flex-col gap-4">
        <div>
          <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
              <label htmlFor="comment" className="sr-only">
                Your comment
              </label>
              <textarea
                id="comment"
                onChange={(e)=>{
                  // console.debug("onChange",e.target.getContent())
                  let currentData={...message}
                  currentData.content=e.target.value
                  setMessage(currentData)
                  
                }}
                rows={4}
                className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Write a comment..."
                required
              ></textarea>
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
            <Button
              gradientMonochrome="info"
              pill={true}
              outline={true}
              className=""
              onClick={create}
            >
              {isLoading ? <Spinner /> : "Add message"}
            </Button>
              <div className="flex pl-0 space-x-1 sm:pl-2">
                <Dropdown
              pill={true}
              color="light"
              label={"Mark " + (isMarkAsSelected ? message.edited_state : "")}
              size="md"
            >
              <Dropdown.Header>
                <span className="block text-sm">
                  Current status: {message.ticket_state}
                </span>
              </Dropdown.Header>

              {(() => {
                if (statuses.length === 0) {
                  return (
                    <Dropdown.Item icon={HiClock}>
                      <Spinner />
                    </Dropdown.Item>
                  );
                }
                return statuses.map((item:any) => {
                  return (
                    <Dropdown.Item
                      key={"msgAction__"+item.label}
                      onClick={() => {
                        let currentData = { ...message };
                        currentData.ticket_raw_state = item.code;
                        currentData.edited_state = item.label;
                        setIsMarkAsSelected(true);
                        setMessage(currentData);
                      }}
                    >
                      {item.label}
                    </Dropdown.Item>
                  );
                });
              })()}
            </Dropdown>
              </div>
            </div>
          </div>
         
        </div>

      </form>
    </>
  );
}

function HandleMessage(props) {
  const { ticket } = props;
  const [message, setMessage] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  // const [isLoading, setIsLoading] = useState({});
  // const [isMarkAsSelected, setIsMarkAsSelected] = useState(false);
  useEffect(() => {
    async function callMeBaby() {
      setIsInitialLoading(true);

      let r = await getMessages();

      setMessage(r);
      setIsInitialLoading(false);
    }
    callMeBaby();
  }, []);

  if (isInitialLoading) {
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

  async function getMessages(master_id = null) {
    let data = {
      ticket_id: ticket.ticket_data.id,
      master_message_id:null
    };
    if (master_id) {
      data.master_message_id = master_id;
    }

    let r = await getTicketMessages(data);

    return r;
  }

  return <>
    {(()=>{
      if(message.length===0)return (<>
        <div className="  ">
          <div className="flex  flex-col  justify-center items-center">
            <p>No messages.</p>
          </div>
        </div>
      </>)
      return message.map((item:any,index)=><MessageComponent key={"msg__"+item.id} id={"msg__"+index} message={item}/>)
    })()}
  </>;
}


function MessageComponent(props){
  const { message } = props;

  return (<>
<article className="pb-3">
    <div className="flex items-center mb-4 space-x-4">
        <img className="w-10 h-10 rounded-full" src={"https://api.dicebear.com/5.x/identicon/svg?seed="+message?.user_username??"tgssoftware"} alt=""/>
        <div className="space-y-1 font-medium dark:text-white">
            <p>{message.user_username} <span className="block text-sm text-gray-500 dark:text-gray-400">{message.user_department}</span></p>
        </div>
    </div>

    <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400"><p>Created on <time dateTime={message.created_at}> {new Date(message?.created_at).toLocaleString("en-US" )}</time></p></footer>
    {(()=>{
        console.log(message.content)
        let msgs=String(message.content).split("\n")
        console.log(msgs)
        return msgs.map((mes,index)=>{
              return <p key={"mess__"+index} className="mb-2 font-light text-gray-500 dark:text-gray-400">{mes}</p> 
        })

    })()}
    
    {/* {message.content} */}
    {/* <a href="#" className="block mb-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Read more</a>
    <aside>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">19 people found this helpful</p>
        <div className="flex items-center mt-3 space-x-3 divide-x divide-gray-200 dark:divide-gray-600">
            <a href="#" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Helpful</a>
            <a href="#" className="pl-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Report abuse</a>
        </div>
    </aside> */}
</article>
  </>)
}

// function MessageActions(data){

// }
