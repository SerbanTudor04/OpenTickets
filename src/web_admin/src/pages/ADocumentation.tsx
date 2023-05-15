import { Card } from "flowbite-react";
import DocsTabs from "../components/documentations/DocsTabs";
import React from "react";

export default function ADocumentation() {
    return (
    <section className="w-full h-full z-1 pb-10">
        <div className="grid grid-cols-1 gap-4 w-3/4 m-auto ">
          <section>
            <Card className="">
                <DocsTabs/>
            </Card>
          </section>
        </div>
      </section>
  );

}