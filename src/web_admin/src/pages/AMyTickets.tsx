import { Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { getMyTcikets } from "../../../package/api/atickets";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AMyTickets(){
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        async function callMeBaby() {
          let r = await getMyTcikets();
            
          setTickets(r)

          setLoading(false);
        }
        callMeBaby();
      }, []);


    if (loading && tickets.length === 0) {
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

    if (tickets.length === 0) {
        return (
          <>
            <div className="  ">
              <div className="flex  flex-col  justify-center items-center">
                <p>You don't have any ticket created yet.</p>
                <p><a className="text-blue-600" href="/admin/tickets/create">Click here</a> to create one!</p>
              </div>
            </div>
          </>
        );
      }
    

    return (<>
    <section className="flex flex-col  justify-center items-center">
        <div className="w-3/4 grid grid-cols-1  ">
          <div className="">
            <Table  hoverable={true}  striped={true} className="">
              <Table.Head>
                <Table.HeadCell>Code</Table.HeadCell>
                <Table.HeadCell>Subject</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Department</Table.HeadCell>
                <Table.HeadCell>Created at</Table.HeadCell>
                <Table.HeadCell>Closed at</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {tickets.map((item:any, key) => {
                  return (
                    <Table.Row
                    key={key + "usersTR--" + item.id}
                      id={key + "usersTR--" + item.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <button onClick={()=>{
                          navigate("/tickets/view/"+item.id)
                        }}className="text-blue-600">#{item.code}</button>
                      </Table.Cell>
                      <Table.Cell>{item.subject}</Table.Cell>
                      <Table.Cell>{item.status}</Table.Cell>
                      <Table.Cell>{item.department}</Table.Cell>
                      <Table.Cell>{item.created_at}</Table.Cell>
                      <Table.Cell>{item.closed_at}</Table.Cell>
                      
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