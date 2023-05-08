import { useState } from "react";
import { Card } from "flowbite-react";
import { useEffect } from "react";
import { getUsersTicketsReports } from "../../../package/api/adashboard";
import React from "react";

export default function ADashboard() {
  const [ticketsReports, setTicketsReports] = useState({
    assigned: null,
    created: null,
    department: null,
  });
  useEffect(() => {
    getUsersTicketsReports().then((res) => {
      console.log(res);
      setTicketsReports(res);
    });
  }, []);

  return (
    <>
      <section className="w-full h-full z-1 pb-10">
        <div className="grid grid-cols-3 gap-4 w-3/4 m-auto ">
          <section>
            <Card className="">
              <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                  Tickets assigned to you
                </h5>
                <span class="font-bold text-xl text-blue-600">
                  {ticketsReports.assigned}
                </span>
              </div>
            </Card>
          </section>
          <section>
            <Card className="">
              <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                  Tickets created by you
                </h5>
                <span class="font-bold text-xl text-blue-600">
                  {ticketsReports.created}
                </span>
              </div>
            </Card>
          </section>
          <section>
            <Card className="">
              <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                  Your department
                </h5>
                <span class="font-bold text-xl text-blue-600">
                  {ticketsReports.department}
                </span>
              </div>
            </Card>
          </section>
        </div>
        <div className="grid grid-cols-1 gap-0 w-3/4 m-auto pt-3">
          {/* <section>
            <Card>
              <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                  Your scores
              </h5>

            </Card>
          </section> */}
        </div>
      </section>
      <section className="bg-white w-full  z-2">
        <div>
          
        </div>
      </section>
    </>
  );
}
