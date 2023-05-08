import { Alert, Button } from "flowbite-react";
import { useEffect, useReducer, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import {
  getUserInboxMessages,
  markMessageAsViewed,
} from "../../../package/api/ausers";
import React from "react";

export default function AInbox() {
  const [inbox, setInbox] = useState([]);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    async function callMeBaby() {
      let r = await getUserInboxMessages();

      setInbox(r);
    }
    callMeBaby();
  }, []);
  async function onDismiss(id, key) {
    await markMessageAsViewed(id);

    let copyOfInbox = inbox;
    copyOfInbox.splice(key, 1);
    setInbox(copyOfInbox);
    forceUpdate();
  }
  if (inbox.length == 0) {
    return (
      <>
        <div className="flex flex-col justify-center items-center">
          You don't have any messages yet.
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        {inbox.map((item:any, key) => {
          return (
            <Alert
            key={key+"alert"+item.id}
              onDismiss={() => {
                onDismiss(item.id, key);
              }}
              className="mb-3 w-4/5"
              color={getColorByState(item.state)}
              icon={HiInformationCircle}
            //   additionalContent={item.message}
            >
              <h3 className="text-lg font-medium ">
                {capitalize(String(item.state).toLowerCase())}
              </h3>
              {item.message}
            </Alert>
          );
        })}
      </div>
    </>
  );
}

function getColorByState(state) {
  switch (state) {
    case "WARNING":
      return "warning";
    case "ERROR":
      return "failure";
    default:
      return "info";
  }
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
