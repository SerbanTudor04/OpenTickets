import { Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { getMyPendingRequests } from "../../../package/api/atickets";
import React from "react";

export default function APendingTickets(){
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function callMeBaby() {
          let r = await getMyPendingRequests();
            
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
                <p>There isn't a ticket <span className="text-orange-600">assigned</span> or in <span className="text-yellow-300">pending</span> for you yet.</p>
                
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
                        <a href={"/tickets/view/"+item.id} className="text-blue-600">#{item.code}</a>
                      </Table.Cell>
                      <Table.Cell>{item.subject}</Table.Cell>
                      <Table.Cell>{item.status}</Table.Cell>
                      <Table.Cell>{item.department}</Table.Cell>
                      <Table.Cell>{item.created_at}</Table.Cell>
                      
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