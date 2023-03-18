import { Button, Modal, Spinner, Table } from "flowbite-react";
import { Fragment, useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { assignTicket2Me, getOpenOrReleasedTickets } from "../../../package/api/atickets";

export default function AFreeTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function callMeBaby() {
      let r = await getOpenOrReleasedTickets();

      setTickets(r);

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
            <p>
              There isn't a ticket{" "}
              <span className="text-green-400">opened</span> or in{" "}
              <span className="text-red-500">released</span> for you yet.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="flex flex-col  justify-center items-center">
        <div className="w-3/4 grid grid-cols-1  ">
          <div className="">
            <Table hoverable={true} className="">
              <Table.Head>
                <Table.HeadCell>Code</Table.HeadCell>
                <Table.HeadCell>Subject</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Department</Table.HeadCell>
                <Table.HeadCell>Created at</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Edit</span>
                </Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {tickets.map((item, key) => {
                  return (
                    <Table.Row
                      id={key + "usersTR--" + item.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <a
                          href={"/admin/tickets/view/" + item.id}
                          className="text-blue-600"
                        >
                          #{item.code}
                        </a>
                      </Table.Cell>
                      <Table.Cell>{item.subject}</Table.Cell>
                      <Table.Cell>{item.status}</Table.Cell>
                      <Table.Cell>{item.department}</Table.Cell>
                      <Table.Cell>{item.created_at}</Table.Cell>
                      <Table.Cell>
                        <Assign2MeModal item={item}/>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
        </div>
      </section>
    </>
  );
}

function Assign2MeModal(props) {
  const [isOpenModal, setisOpenModal] = useState(false);
  const [isAssinging, setIsAssinging] = useState(false);
  const navigate = useNavigate();


  async function doAssign(){
    setIsAssinging(true);

    let r = await assignTicket2Me(props?.item?.id)
    setIsAssinging(false);
    if(r){
      navigate(`/tickets/view/${props?.item?.id}`)
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
          Assign to me
        </Button>
        <Modal show={isOpenModal} size="md" popup={true} onClose={cancel}>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              {isAssinging ? (
                <Spinner className="mx-auto mb-4 h-14 w-14" />
              ) : (
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              )}

              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to take ticket{" #"}
                <strong>{props?.item?.code}</strong>?
              </h3>
              <div className="flex justify-center gap-4">
                <Button
                  gradientMonochrome="info"
                  pill={true}
                  outline={true}
                  onClick={doAssign}
                >
                  Yes, I'm sure
                </Button>
                <Button
                  gradientMonochrome="failure"
                  pill={true}
                  outline={true}
                  onClick={cancel}
                >
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </Fragment>
    </>
  );
}
