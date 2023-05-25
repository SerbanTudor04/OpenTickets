import {
  Badge,
  Button,
  Card,
  Label,
  Modal,
  Spinner,
  Table,
  TextInput,
  ToggleSwitch,
  Tooltip,
} from "flowbite-react";
import { useEffect, useState, Fragment } from "react";
import { isSuperUser } from "../../../package/api/auth";
import {
  createUser,
  deleteUser,
  getDepartments,
  getUser,
  getUsers,
  updateUser,
} from "../../../package/api/ausers";
import {
  HiCheck,
  HiOutlineArrowLeft,
  HiOutlineExclamationCircle,
  HiPencil,
  HiTrash,
  HiX,
} from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
export default function AMgmUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigator = useNavigate();
  useEffect(() => {
    async function callMeBaby() {

      let r = await getUsers();
      setUsers(r);

      setLoading(false);
    }
    callMeBaby();
  }, []);

  if (loading) {
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
              <h5 className="text-2xl">Users</h5>
            </div>
            <div className="col-start-7">
              {/* <TemplatesUpdateOrCreate template={null} /> */}
              <Button
                onClick={() => {
                  navigator("/management/users/create");
                }}
                pill={true}
                gradientMonochrome="info"
                outline={false}
              >
                Create +
              </Button>
            </div>
          </div>
          <div className="mb-3"></div>
          <div className="">
            <Table className="">
              <Table.Head>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Created at</Table.HeadCell>
                <Table.HeadCell>Superuser</Table.HeadCell>
                <Table.HeadCell>Department</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Edit</span>
                </Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {users.map((item: any, key) => {
                  return (
                    <Table.Row
                      key={"tbr__" + item.email}
                      id={key + "usersTR--" + item.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {item.username}
                      </Table.Cell>
                      <Table.Cell>{item.email}</Table.Cell>
                      <Table.Cell>{item.created_at}</Table.Cell>
                      <Table.Cell>{getIsSuperUser(item.is_su)}</Table.Cell>
                      <Table.Cell>{item.department_name}</Table.Cell>
                      <Table.Cell>
                        <div className="flex">
                          <div className="flex-col pr-1">
                            <Button
                              onClick={() => {
                                navigator("/management/users/" + item.id);
                              }}
                              pill={true}
                              gradientMonochrome="info"
                              outline={true}
                            >
                              <HiPencil />
                              Edit
                            </Button>
                          </div>
                          <div className="flex-col">
                            <DeleteUser
                              id={"deletemodalView--" + item.id}
                              user={item}
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

function getIsSuperUser(isSu) {
  if (isSu) {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-wrap items-center gap-2">
          <Badge color="success" icon={HiCheck} />
        </div>
      </div>
    );
  }
  <Badge color="failure" icon={HiX} />;
}

export function EditUser() {
  const { id } = useParams();

  const [departments, setDepartemnts] = useState([]);
  const [curentData, setCurrentData] = useState<any>({});

  const [isSavingUser, setIsSavingUser] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function callMeBaby() {
      setIsSavingUser(true);
      let u = await getUser(id);
      setCurrentData(u);
      let r = await getDepartments();
      console.log(r);
      setDepartemnts(r);
      setIsSavingUser(false);
    }
    callMeBaby();
  }, []);

  async function update() {
    setIsSavingUser(true);
    let r = await updateUser(curentData);
    endCreateOrUpdate(r);
  }

  function endCreateOrUpdate(r) {
    if (!r) {
      setIsSavingUser(false);
      return;
    }

    setIsSavingUser(false);
    setCurrentData({
      email: null,
      password: null,
      department_id: null,
      is_su: false,
      username: null,
    });

    navigate(0);
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
                  <h4 className="text-2xl">Edit User</h4>
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
                  <Label htmlFor="username" value="Username" />
                </div>
                <TextInput
                  id="username"
                  type="text"
                  placeholder="example"
                  required={true}
                  value={curentData?.username}
                  onChange={(e) => {
                    let cData = { ...curentData };
                    cData.username = e.target.value;
                    setCurrentData(cData);
                  }}
                />
              </div>
              <div className="flex-col w-full ml-1">
                <div className="mb-2 block">
                  <Label htmlFor="email" value="Email" />
                </div>
                <TextInput
                  id="email"
                  placeholder="example@tgssoftware.ro"
                  required={true}
                  value={curentData?.email}
                  onChange={(e) => {
                    let cData = { ...curentData };
                    cData.email = e.target.value;
                    setCurrentData(cData);
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput
                id="password"
                placeholder="***********"
                type="password"
                required={true}
                value={"***********"}
                onChange={(e) => {
                  let cData = { ...curentData };
                  cData.password = e.target.value;
                  setCurrentData(cData);
                }}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="department" value="Department" />
              </div>
              <select
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={curentData?.department_id}
                onChange={(e) => {
                  let cData = { ...curentData };
                  cData.department_id = e.target.value;
                  setCurrentData(cData);
                }}
              >
                <option value={-1}>Choose a deparment</option>
                {(() => {
                  if (departments === null) {
                    return <option>Loading...</option>;
                  }
                  return departments.map((dept: any) => {
                    return (
                      <option
                        key={"dept__" + dept.id}
                        id={"dept--" + dept.id}
                        value={dept.id}
                      >
                        {dept.name}
                      </option>
                    );
                  });
                })()}
              </select>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <ToggleSwitch
                  checked={curentData?.is_su}
                  label="Super User"
                  onChange={(e) => {
                    let cData = { ...curentData };
                    console.debug("current super user event: " + e);
                    cData.is_su = e;
                    setCurrentData(cData);
                  }}
                />
              </div>
            </div>
            <div className="w-full">
              <Button
                className="w-full"
                gradientMonochrome="info"
                pill={true}
                outline={false}
                onClick={update}
              >
                {isSavingUser ? (
                  <Spinner />
                ) : (
                  <>
                    Edit
                    <HiPencil />
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

export function CreateUser(props) {
  const [departments, setDepartemnts] = useState([]);
  const [curentData, setCurrentData] = useState<any>({});

  const [isSavingUser, setIsSavingUser] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function callMeBaby() {
      let r = await getDepartments();

      setDepartemnts(r);
    }
    callMeBaby();
  }, []);

  async function create() {
    setIsSavingUser(true);
    let cData = { ...curentData };
    cData.id = props?.user?.id;
    let r = await createUser(cData);
    endCreateOrUpdate(r);
  }
  function endCreateOrUpdate(r) {
    if (!r) {
      setIsSavingUser(false);
      return;
    }

    setIsSavingUser(false);

    setCurrentData({
      email: null,
      password: null,
      department_id: null,
      is_su: false,
      username: null,
    });

    navigate(0);
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
                  <h4 className="text-2xl">Create User</h4>
                </div>
              </div>
            </div>
            <div className="flex w-full">
              <div className="flex-col w-full mr-1">
                <div className="mb-2 block">
                  <Label htmlFor="username" value="Username" />
                </div>
                <TextInput
                  id="username"
                  type="text"
                  placeholder="example"
                  required={true}
                  value={curentData?.username}
                  onChange={(e) => {
                    let cData = { ...curentData };
                    cData.username = e.target.value;
                    setCurrentData(cData);
                  }}
                />
              </div>
              <div className="flex-col w-full ml-1">
                <div className="mb-2 block">
                  <Label htmlFor="email" value="Email" />
                </div>
                <TextInput
                  id="email"
                  placeholder="example@tgssoftware.ro"
                  required={true}
                  value={curentData?.email}
                  onChange={(e) => {
                    let cData = { ...curentData };
                    cData.email = e.target.value;
                    setCurrentData(cData);
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput
                id="password"
                placeholder="***********"
                type="password"
                required={true}
                value={curentData?.password}
                onChange={(e) => {
                  let cData = { ...curentData };
                  cData.password = e.target.value;
                  setCurrentData(cData);
                }}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="department" value="Department" />
              </div>
              <select
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={curentData?.department_id}
                onChange={(e) => {
                  let cData = { ...curentData };
                  cData.department_id = e.target.value;
                  setCurrentData(cData);
                }}
              >
                <option value={-1}>Choose a deparment</option>
                {(() => {
                  if (departments === null) {
                    return <option>Loading...</option>;
                  }
                  return departments.map((dept: any) => {
                    return (
                      <option
                        key={"dept__" + dept.id}
                        id={"dept--" + dept.id}
                        value={dept.id}
                      >
                        {dept.name}
                      </option>
                    );
                  });
                })()}
              </select>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <ToggleSwitch
                  checked={curentData?.is_su ?? props?.user?.is_su}
                  label="Super User"
                  onChange={(e) => {
                    let cData = { ...curentData };
                    console.debug("current super user event: " + e);
                    cData.is_su = e;
                    setCurrentData(cData);
                  }}
                />
              </div>
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
                {isSavingUser ? <Spinner /> : "Create +"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
function DeleteUser(props) {
  const [isOpenModal, setisOpenModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  async function doDelete() {
    setIsDeleting(true);

    let r = await deleteUser(props?.user?.id);
    setIsDeleting(false);
    if (r) {
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
          <HiTrash />
          Delete
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
                Are you sure you want to delete user{" "}
                <strong>{props?.user?.username}</strong>?
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
