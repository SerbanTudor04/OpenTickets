import { Card } from "flowbite-react";
import React from "react";
import { HiSupport } from "react-icons/hi";

export default function AHelp() {
  return (
    <>
      <section className="w-full h-full z-1 pb-10">
        <div className="grid grid-cols-1 gap-4 w-3/4 m-auto ">
          <section>
            <Card className="">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 className="text-blueGray-400 uppercase  text-xl">
                  Support
                </h5>
                <span className="font-bold text-xs ">
                  Please contact us{" "}
                  <a
                    className="text-blue-600"
                    href="mailto:tudor.gabriel.serban@gmail.com"
                  >
                    here
                  </a>{" "}
                  or create a issue{" "}
                  <a className="text-blue-600" target="_blank" href="https://github.com/SerbanTudor04/OpenTickets/issues">
                    here
                  </a>
                </span>
              </div>
            </Card>
          </section>
        </div>
      </section>
    </>
  );
}
