import {
  Button,
  Card,
  Label,
  Modal,
  Spinner,
  Table,
  Textarea,
  TextInput,
  Tooltip,
} from "flowbite-react";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getDepartments,
  updateDepartment,
} from "../../../package/api/ausers";
import {
  HiOutlineArrowLeft,
  HiOutlineExclamationCircle,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineTrash,
  HiPencil,
} from "react-icons/hi";
import React from "react";
import { toast } from "react-toastify";

export default function ADepartment() {
  const [dept, setDept] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    async function callMeBaby() {
      let r = await getDepartments();
      setDept(r);
      setLoading(false);
    }
    callMeBaby();
  }, []);

  if (loading === true) {
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
      <section className="flex flex-col  justify-center items-center">
        <div className="w-3/4 grid grid-cols-1  ">
          <div className="grid grid-cols-6 pb-3">
            <div className="col-start-1 col-end-3">
              <h5 className="text-2xl">Departments</h5>
            </div>
            <div className="col-start-7">
              {/* <TemplatesUpdateOrCreate template={null} /> */}
              <Button
                onClick={() => {
                  navigate("/management/departments/create");
                }}
                gradientMonochrome="info"
                pill={true}
                outline={false}
              >
                Create +
              </Button>
            </div>
          </div>
          <div className="">
            <Table className="">
              <Table.Head>
                <Table.HeadCell>Id</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Description</Table.HeadCell>
                <Table.HeadCell>Created at</Table.HeadCell>
                <Table.HeadCell>Updated at</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Edit</span>
                </Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {dept.map((item: any, key) => {
                  return (
                    <Table.Row
                      key={key + "usersTR--" + item.id}
                      id={key + "usersTR--" + item.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {item.id}
                      </Table.Cell>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>{item.description}</Table.Cell>
                      <Table.Cell>{item.created_at}</Table.Cell>
                      <Table.Cell>{item.updated_at}</Table.Cell>
                      <Table.Cell>
                        <div className="flex">
                          <div className="flex-col pr-1">
                            <Button
                              onClick={() => {
                                navigate("/management/departments/" + item.id);
                              }}
                              gradientMonochrome="info"
                              pill={true}
                              outline={true}
                            >
                              <HiPencil />
                              Edit
                            </Button>
                          </div>
                          <div className="flex-col">
                            <DeleteDept
                              id={"deletemodalView--" + item.id}
                              dept={item}
                            />
                          </div>
                        </div>
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

export function EditDepartment() {
  const { id } = useParams();

  const [curentData, setCurrentData] = useState<any>({});

  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(()=>{
    fetchData()
  },[])

  async function fetchData(){
    setIsSaving(true)
    let r = await getDepartment(id);
    setCurrentData(r)
    setIsSaving(false)
  }


  async function update() {
    setIsSaving(true);
    let submitData = { ...curentData };
    let r = await updateDepartment(submitData);
    endCreateOrUpdate(r);
  }
  function endCreateOrUpdate(r) {
    if (!r) {
      toast("An error occured while editing the department.")
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    setCurrentData({
      name: null,
      description: null,
    });
    toast("Updated Successfully")
    navigate(-1);
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <Card>
        <div>
          <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
            <div>
              <div className="flex flex-row gap-4 pt-3">
                <div>
                  <Tooltip content="Go back" placement="right">
                    <Button
                      color="light"
                      pill={true}
                      onClick={() => {
                        navigate(-1);
                      }}
                      outline={false}
                    >
                      <HiOutlineArrowLeft className="h-6 w-6" />
                    </Button>
                  </Tooltip>
                </div>
                <div className="pt-1">
                  <h4 className="text-2xl">Edit Department</h4>
                </div>
              </div>
            </div>
            <div className="flex w-full">
              <div className="flex-col w-full mr-1">
                <div className="mb-2 block">
                  <Label htmlFor="id" value="ID" />
                </div>
                <TextInput
                  id="id"
                  type="text"
                  required={true}
                  value={id}
                  readOnly={true}
                  disabled={true}
                />
              </div>

              <div className="flex-col w-full mr-1">
                <div className="mb-2 block">
                  <Label htmlFor="username" value="Name" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="example"
                  required={true}
                  value={curentData?.name}
                  onChange={(e) => {
                    let cData = { ...curentData };
                    cData.name = e.target.value;
                    setCurrentData(cData);
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Description" />
              </div>
              <Textarea
                id="description"
                placeholder="Beautiful "
                // type={"text"}
                required={true}
                value={curentData?.description}
                onChange={(e) => {
                  let cData = { ...curentData };
                  cData.description = e.target.value;
                  setCurrentData(cData);
                }}
              />
            </div>

            <div className="w-full">
              <Button
                className="w-full"
                gradientMonochrome="info"
                pill={true}
                outline={false}
                onClick={update}
              >
                {isSaving ? (
                  <Spinner />
                ) : (
                  <>
                    Edit <HiPencil />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function CreateDepartment() {
  const [curentData, setCurrentData] = useState<any>();

  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  async function create() {
    setIsSaving(true);
    let cData = { ...curentData };
    //   cData.id=props?.user?.id
    let r = await createDepartment(cData);
    endCreateOrUpdate(r);
  }
  function endCreateOrUpdate(r) {
    if (!r) {
      toast("An error occured while creating the department.")
      setIsSaving(false);
      return;
    }

    setIsSaving(false);

    setCurrentData({
      name: null,
      description: null,
    });
    toast("Created Successfully.")
    navigate(-1);
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <Card>
        <div>
          <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
            <div>
              <div className="flex flex-row gap-4 pt-3">
                <div>
                  <Tooltip content="Go back" placement="right">
                    <Button
                      color="light"
                      pill={true}
                      onClick={() => {
                        navigate(-1);
                      }}
                      outline={false}
                    >
                      <HiOutlineArrowLeft className="h-6 w-6" />
                    </Button>
                  </Tooltip>
                </div>
                <div className="pt-1">
                  <h4 className="text-2xl">Create Department</h4>
                </div>
              </div>
            </div>
            <div className="flex w-full">
              <div className="flex-col w-full mr-1">
                <div className="mb-2 block">
                  <Label htmlFor="username" value="Name" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder=""
                  required={true}
                  value={curentData?.name}
                  onChange={(e) => {
                    let cData = { ...curentData };
                    cData.name = e.target.value;
                    setCurrentData(cData);
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Description" />
              </div>
              <Textarea
                id="description"
                placeholder=""
                // type={"text"}
                required={true}
                value={curentData?.description}
                onChange={(e) => {
                  let cData = { ...curentData };
                  cData.description = e.target.value;
                  setCurrentData(cData);
                }}
              />
            </div>

            <div className="w-full">
              <Button
                className="w-full"
                gradientMonochrome="info"
                pill={true}
                outline={false}
                onClick={create}
              >
                {" "}
                {isSaving ? <Spinner /> : "Create +"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function DeleteDept(props) {
  const [isOpenModal, setisOpenModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  async function doDelete() {
    setIsDeleting(true);

    let r = await deleteDepartment(props?.dept?.id);
    setIsDeleting(false);
    if (r) {
      toast("Deleted Successfully.");
      navigate(0);
      return;
    }
  }

  function cancel() {
    setisOpenModal(false);
  }

  return (
    <>
      <Fragment>
        <Button
          pill={true}
          gradientMonochrome="failure"
          outline={true}
          onClick={() => {
            setisOpenModal(true);
          }}
        >
          <HiOutlineTrash /> Delete
        </Button>
        <Modal show={isOpenModal} size="md" popup={true} onClose={cancel}>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              {isDeleting ? (
                <Spinner className="mx-auto mb-4 h-14 w-14" />
              ) : (
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              )}

              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete{" "}
                <strong>{props?.dept?.name}</strong>?
              </h3>
              <div className="flex justify-center gap-4">
                <Button
                  gradientMonochrome="failure"
                  pill={true}
                  outline={true}
                  onClick={doDelete}
                >
                  Yes, I'm sure
                </Button>
                <Button
                  gradientMonochrome="info"
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
