import React, { useState } from "react";
import { useEffect } from "react";
import { getSuperUsersReports } from "../../../package/api/adashboard";
import { Card, Spinner } from "flowbite-react";

export default function ADashboard() {
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    let r = await getSuperUsersReports();
    setData(r);
    setIsLoading(false);
  }

  return (
    <>
      <section className="w-full h-full z-1 pb-1">
        <div className="grid grid-cols-3 gap-4 w-3/4 m-auto ">
          <section>
            <Card className="">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                  Tickets created
                </h5>
                <span className="font-bold text-xl text-blue-600">
                  {isLoading ? <Spinner/> : data.ticket_created}
                </span>
              </div>
            </Card>
          </section>
          <section>
            <Card className="">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                  Tickets active
                </h5>
                <span className="font-bold text-xl text-blue-600">
                  {isLoading ? <Spinner/>  : data.ticket_active}
                </span>
              </div>
            </Card>
          </section>
          <section>
            <Card className="">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                  Users Created
                </h5>
                <span className="font-bold text-xl text-blue-600">
                  {isLoading ? <Spinner/> : data.users_created}
                </span>
              </div>
            </Card>
          </section>
        </div>
        <div className="grid grid-cols-1 gap-0 w-3/4 m-auto pt-3"></div>
      </section>
      <section className="w-full h-full z-1 pb-10">
        <div className="grid grid-cols-2 gap-4 w-3/4 m-auto ">
          <section>
            <Card className="">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                  Deparments created
                </h5>
                <span className="font-bold text-xl text-blue-600">
                  {isLoading ? <Spinner/> : data.departments_created}
                </span>
              </div>
            </Card>
          </section>
          <section>
            <Card className="">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                  Clients created
                </h5>
                <span className="font-bold text-xl text-blue-600">
                  {isLoading ? <Spinner/>  : data.clients_created}
                </span>
              </div>
            </Card>
          </section>
          
        </div>
    
      </section>
    </>
  );
}
