import {
  Alert,
  Button,
  Card,
  Label,
  Modal,
  Select,
  Spinner,
  Table,
  TextInput,
  Textarea,
  Timeline,
  Tooltip,
} from "flowbite-react";
import React, { Fragment, useEffect, useState } from "react";
import {
  createClient,
  editClient,
  deleteClient,
  getClient,
  getClients,
  getCountries,
  createNote,
  getNotes,
} from "../../../package/api/aClients";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiArrowNarrowRight,
  HiInformationCircle,
  HiOutlineArrowLeft,
  HiOutlineDocumentReport,
  HiOutlineExclamationCircle,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi";

import { IoAlbums } from "react-icons/io5";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigator = useNavigate();
  useEffect(() => {
    async function callMeBaby() {
      let r = await getClients();

      setClients(r);

      setIsLoading(false);
    }
    callMeBaby();
  }, []);

  if (isLoading === true) {
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
      <section className="flex flex-col  justify-center items-center w-auto">
        <div className="grid grid-cols-1  ">
          <div className="grid grid-cols-6 pb-3">
            <div className="col-start-1 col-end-3">
              <h5 className="text-2xl">Clients</h5>
            </div>
            <div className="col-start-7">
              <Button
                gradientMonochrome="info"
                pill={true}
                outline={false}
                onClick={() => {
                  navigator("/management/clients/create");
                }}
              >
                Create <HiOutlinePlus className=" h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="">
            <Table hoverable={true} className="">
              <Table.Head>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Phone</Table.HeadCell>
                <Table.HeadCell>Code</Table.HeadCell>
                <Table.HeadCell>Country</Table.HeadCell>
                <Table.HeadCell>Region</Table.HeadCell>
                <Table.HeadCell>Address</Table.HeadCell>
                <Table.HeadCell>Type</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Edit</span>
                </Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {clients.map((item: any, key) => {
                  return (
                    <Table.Row
                      key={key + "clientsTR--" + item.id}
                      id={key + "clientsTR--" + item.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {item.full_name}
                      </Table.Cell>
                      <Table.Cell>{item.email}</Table.Cell>
                      <Table.Cell>{item.phone}</Table.Cell>
                      <Table.Cell>{item.code}</Table.Cell>
                      <Table.Cell>{item.country}</Table.Cell>
                      <Table.Cell>{item.region}</Table.Cell>
                      <Table.Cell>{item.address}</Table.Cell>
                      <Table.Cell>
                        {item.is_business ? "Business" : "Personal"}
                      </Table.Cell>

                      <Table.Cell>
                        <Button
                          gradientMonochrome="info"
                          pill={true}
                          outline={true}
                          onClick={() => {
                            navigator("/management/clients/" + item.uid);
                          }}
                        >
                          <HiOutlinePencil color="info" />
                          Edit
                        </Button>
                        <DeleteClientComponent client={item} />
                        {/* <Assign2MeModal item={item}/> */}
                        {/* <UpdateConfig item={item}/> */}
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

export function CreateClient() {
  const [clientType, setClientType] = useState<String>("business");
  const [countries, setCountries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [alert, setAlert] = useState<any>({ status: "", message: "" });
  const navigator = useNavigate();

  const [client, setClient] = useState<any>({
    full_name: "",
    email: "",
    phone: "",
    code: "",
    city: "",
    registration_code: "",
    country_id: "",
    region: "",
    zipcode: "",
    address: "",
    type: "business",
  });

  useEffect(() => {
    setIsLoading(true);

    async function callMeBaby() {
      let r = await getCountries();
      setCountries(r);
      setIsLoading(false);
    }
    callMeBaby();
  }, []);

  async function goBack() {
    navigator(-1);
  }

  async function submit() {
    setIsLoading(true);
    let r = await createClient(client);
    console.log(r);

    setIsLoading(false);
    if (r.status === "success") {
      navigator(-1);
      return;
    }
    setAlert({ status: r.status, message: r.message });
  }

  return (
    <>
      <section className="flex flex-col  justify-center items-center">
        {alert.message !== "" ? (
          <Alert color="failure" icon={HiInformationCircle} rounded={true}>
            `{" "}
            <span>
              <span className="font-medium">{alert.status}</span>{" "}
              {alert.message}
            </span>
            `
          </Alert>
        ) : null}
      </section>
      <section className="flex flex-col  justify-center items-center">
        <Card>
          <div>
            <div className="flex flex-row gap-4 pt-3">
              <div>
                <Tooltip content="Go back" placement="right">
                  <Button
                    color="light"
                    pill={true}
                    onClick={goBack}
                    outline={false}
                  >
                    <HiOutlineArrowLeft className="h-6 w-6" />
                  </Button>
                </Tooltip>
              </div>
              <div className="pt-1">
                <h4 className="text-2xl">Create client</h4>
              </div>
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className="flex flex-row gap-4 pt-3">
                <div className="flex-col"></div>
                <div className="flex-col">
                  <Spinner />
                </div>
                <div className="flex-col"></div>
              </div>
            ) : null}

            <div id="select">
              <div className="mb-2 block">
                <Label htmlFor="countries" value="Type of the client" />
              </div>
              <Select
                onChange={(e) => {
                  setClientType(String(e.target.value));
                  if (e.target.value === "person") {
                    setClient({
                      first_name: "",
                      middle_name: "",
                      last_name: "",
                      email: "",
                      phone: "",
                      country_id: "",
                      region: "",
                      address: "",
                      unique_id: "",
                      type: "person",
                      zipcode: "",
                    });
                  }
                  if (e.target.value === "business") {
                    setClient({
                      full_name: "",
                      email: "",
                      phone: "",
                      code: "",
                      registration_code: "",
                      country_id: "",
                      region: "",
                      zipcode: "",
                      address: "",
                      type: "business",
                      city: "",
                    });
                  }
                }}
                id="client_type"
                required={true}
              >
                <option selected value={"business"}>
                  Business
                </option>
                <option value={"person"}>Person</option>
              </Select>
              {(() => {
                if (clientType === "business") {
                  return (
                    <div className="flex flex-col gap-4 pt-3">
                      <div>
                        <div className="mb-2 block">
                          <Label htmlFor="full_name" value="Name" />
                        </div>
                        <TextInput
                          id="full_name"
                          placeholder=""
                          required={true}
                          onChange={(e) => {
                            let data = { ...client };
                            data.full_name = e.target.value;
                            setClient(data);
                          }}
                        />
                      </div>

                      <div className="flex flex-row gap-1">
                        <div className="w-1/2">
                          <div className="mb-2 block">
                            <Label htmlFor="email" value="Email" />
                          </div>
                          <TextInput
                            id="email"
                            placeholder=""
                            type="email"
                            required={true}
                            onChange={(e) => {
                              let data = { ...client };
                              data.email = e.target.value;
                              setClient(data);
                            }}
                          />
                        </div>
                        <div className="w-1/2">
                          <div className="mb-2 block">
                            <Label htmlFor="phone" value="Phone" />
                          </div>
                          <TextInput
                            id="phone"
                            placeholder=""
                            type="phone"
                            required={true}
                            onChange={(e) => {
                              let data = { ...client };
                              data.phone = e.target.value;
                              setClient(data);
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-row gap-1">
                        <div className="w-1/2">
                          <div className="mb-2 block">
                            <Label htmlFor="code" value="Company Code" />
                          </div>
                          <TextInput
                            id="code"
                            placeholder=""
                            type="text"
                            required={true}
                            onChange={(e) => {
                              let data = { ...client };
                              data.code = e.target.value;
                              setClient(data);
                            }}
                          />
                        </div>
                        <div className="w-1/2">
                          <div className="mb-2 block">
                            <Label
                              htmlFor="registration_code"
                              value="Registration Code"
                            />
                          </div>
                          <TextInput
                            id="registration_code"
                            placeholder=""
                            type="text"
                            required={true}
                            onChange={(e) => {
                              let data = { ...client };
                              data.registration_code = e.target.value;
                              setClient(data);
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-row gap-1">
                        <div className="w-1/4">
                          <div className="mb-2 block">
                            <Label htmlFor="country_id" value="Coutry" />
                          </div>
                          <Select
                            id="country_id"
                            required={true}
                            onChange={(e) => {
                              let data = { ...client };
                              data.country_id = e.target.value;
                              setClient(data);
                            }}
                          >
                            <option selected></option>
                            {countries.map((item: any, key) => (
                              <option
                                key={key + "country" + item.id}
                                value={item.id}
                              >
                                {item.name}
                              </option>
                            ))}
                          </Select>
                        </div>
                        <div className="w-1/4">
                          <div className="mb-2 block">
                            <Label htmlFor="region" value="Region" />
                          </div>
                          <TextInput
                            id="region"
                            placeholder=""
                            type="text"
                            required={true}
                            onChange={(e) => {
                              let data = { ...client };
                              data.region = e.target.value;
                              setClient(data);
                            }}
                          />
                        </div>
                        <div className="w-1/4">
                          <div className="mb-2 block">
                            <Label htmlFor="city" value="City" />
                          </div>
                          <TextInput
                            id="city"
                            placeholder=""
                            type="text"
                            required={true}
                            onChange={(e) => {
                              let data = { ...client };
                              data.city = e.target.value;
                              setClient(data);
                            }}
                          />
                        </div>
                        <div className="w-1/4">
                          <div className="mb-2 block">
                            <Label htmlFor="zipcode" value="Zip Code" />
                          </div>
                          <TextInput
                            id="zipcode"
                            placeholder=""
                            type="text"
                            required={true}
                            onChange={(e) => {
                              let data = { ...client };
                              data.zipcode = e.target.value;
                              setClient(data);
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label htmlFor="address" value="Address" />
                        </div>
                        <Textarea
                          id="address"
                          placeholder=""
                          required={true}
                          rows={4}
                          onChange={(e) => {
                            let data = { ...client };
                            data.address = e.target.value;
                            setClient(data);
                          }}
                        />
                      </div>
                    </div>
                  );
                }

                if (clientType === "person") {
                  return (
                    <div className="flex flex-col gap-1 pt-3">
                      <div className="flex flex-row gap-4">
                        <div className="w-1/3">
                          <div className="mb-2 block">
                            <Label htmlFor="first_name" value="First name" />
                          </div>
                          <TextInput
                            id="first_name"
                            placeholder=""
                            required={true}
                            onChange={(e) => {
                              let data = { ...client };
                              data.first_name = e.target.value;
                              setClient(data);
                            }}
                          />
                        </div>
                        <div className="w-1/3">
                          <div className="mb-2 block">
                            <Label htmlFor="middle_name" value="Middle name" />
                          </div>
                          <TextInput
                            id="middle_name"
                            placeholder=""
                            required={true}
                            onChange={(e) => {
                              let data = { ...client };
                              data.middle_name = e.target.value;
                              setClient(data);
                            }}
                          />
                        </div>
                        <div className="w-1/3">
                          <div className="mb-2 block">
                            <Label htmlFor="last_name" value="Last name" />
                          </div>
                          <TextInput
                            id="last_name"
                            placeholder=""
                            required={true}
                            onChange={(e) => {
                              let data = { ...client };
                              data.last_name = e.target.value;
                              setClient(data);
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-row gap-1">
                        <div className="w-1/2">
                          <div className="mb-2 block">
                            <Label htmlFor="email" value="Email" />
                          </div>
                          <TextInput
                            id="email"
                            placeholder=""
                            type="email"
                            required={true}
                            onChange={(e) => {
                              let data = { ...client };
                              data.email = e.target.value;
                              setClient(data);
                            }}
                          />
                        </div>
                        <div className="w-1/2">
                          <div className="mb-2 block">
                            <Label htmlFor="phone" value="Phone" />
                          </div>
                          <TextInput
                            id="phone"
                            placeholder=""
                            type="phone"
                            required={true}
                            onChange={(e) => {
                              let data = { ...client };
                              data.phone = e.target.value;
                              setClient(data);
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label htmlFor="unique_id" value="Unique ID" />
                        </div>
                        <TextInput
                          id="unique_id"
                          placeholder=""
                          type="text"
                          required={true}
                          onChange={(e) => {
                            let data = { ...client };
                            data.unique_id = e.target.value;
                            setClient(data);
                          }}
                        />
                      </div>
                      <div className="flex flex-row gap-1">
                        <div className="w-1/4">
                          <div className="mb-2 block">
                            <Label htmlFor="country_id" value="Coutry" />
                          </div>
                          <Select
                            onChange={(e) => {
                              let data = { ...client };
                              data.country_id = e.target.value;
                              setClient(data);
                            }}
                            id="country_id"
                            required={true}
                          >
                            <option selected></option>
                            {countries.map((item: any, key) => (
                              <option
                                key={key + "country" + item.id}
                                value={item.id}
                              >
                                {item.name}
                              </option>
                            ))}
                          </Select>
                        </div>
                        <div className="w-1/4">
                          <div className="mb-2 block">
                            <Label htmlFor="region" value="Region" />
                          </div>
                          <TextInput
                            id="region"
                            placeholder=""
                            type="text"
                            required={true}
                            onChange={(e) => {
                              let data = { ...client };
                              data.region = e.target.value;
                              setClient(data);
                            }}
                          />
                        </div>
                        <div className="w-1/4">
                          <div className="mb-2 block">
                            <Label htmlFor="city" value="City" />
                          </div>
                          <TextInput
                            id="city"
                            placeholder=""
                            type="text"
                            required={true}
                            onChange={(e) => {
                              let data = { ...client };
                              data.city = e.target.value;
                              setClient(data);
                            }}
                          />
                        </div>
                        <div className="w-1/4">
                          <div className="mb-2 block">
                            <Label htmlFor="zipcode" value="Zip Code" />
                          </div>
                          <TextInput
                            id="zipcode"
                            placeholder=""
                            type="text"
                            required={false}
                            onChange={(e) => {
                              let data = { ...client };
                              data.zipcode = e.target.value;
                              setClient(data);
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label htmlFor="address" value="Address" />
                        </div>
                        <Textarea
                          id="address"
                          placeholder=""
                          required={true}
                          rows={4}
                          onChange={(e) => {
                            let data = { ...client };
                            data.address = e.target.value;
                            setClient(data);
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
          <div>
            {(() => {
              if (clientType !== "") {
                return (
                  <Button
                    className="w-full"
                    gradientMonochrome="info"
                    pill={true}
                    outline={false}
                    onClick={submit}
                  >
                    Create
                  </Button>
                );
              }
            })()}
          </div>
        </Card>
      </section>
    </>
  );
}

export function EditClient() {
  const [clientType, setClientType] = useState<String>("business");
  const [countries, setCountries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [alert, setAlert] = useState<any>({ status: "", message: "" });
  const navigator = useNavigate();
  const { uid } = useParams();
  const [client, setClient] = useState<any>({
    full_name: "",
    email: "",
    phone: "",
    code: "",
    city: "",
    registration_code: "",
    country_id: "",
    region: "",
    zipcode: "",
    address: "",
    type: "business",
  });

  useEffect(() => {
    setIsLoading(true);

    async function callMeBaby() {
      var r = await getClient(uid);
      setClient(r);
      if (r.is_business === false) setClientType("person");

      setIsLoading(false);
      r = await getCountries();
      setCountries(r);
    }
    callMeBaby();
  }, []);

  async function goBack() {
    navigator(-1);
  }

  async function submit() {
    setIsLoading(true);
    let l_client = { ...client };
    l_client.client_uid = uid;

    console.debug("client", l_client);

    let r = await editClient(l_client);
    console.log(r);
    //
    setIsLoading(false);
    if (r.status === "success") {
      navigator(-1);
      return;
    }
    setAlert({ status: r.status, message: r.message });
  }

  if (isLoading === true) {
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
        {alert.message !== "" ? (
          <Alert color="failure" icon={HiInformationCircle} rounded={true}>
            `{" "}
            <span>
              <span className="font-medium">{alert.status}</span>{" "}
              {alert.message}
            </span>
            `
          </Alert>
        ) : null}
      </section>
      <section className="flex flex-col  justify-center items-center">
        <div className="flex flex-row gap-2">
          <div className="flex-col w-11/12">
            <Card>
              <div>
                <div className="flex flex-row gap-4 pt-3">
                  <div>
                    <Tooltip content="Go back" placement="right">
                      <Button
                        color="light"
                        pill={true}
                        onClick={goBack}
                        outline={false}
                      >
                        <HiOutlineArrowLeft className="h-6 w-6" />
                      </Button>
                    </Tooltip>
                  </div>
                  <div className="pt-1">
                    <h4 className="text-2xl">Edit client </h4>
                  </div>
                </div>
              </div>
              <div>
                {isLoading ? (
                  <div className="flex flex-row gap-4 pt-3">
                    <div className="flex-col"></div>
                    <div className="flex-col">
                      <Spinner />
                    </div>
                    <div className="flex-col"></div>
                  </div>
                ) : null}

                <div id="select">
                  <div className="mb-2 block">
                    <Label htmlFor="countries" value="Type of the client" />
                  </div>
                  <Select
                    value={String(clientType)}
                    disabled
                    id="client_type"
                    required={true}
                  >
                    <option selected value={"business"}>
                      Business
                    </option>
                    <option value={"person"}>Person</option>
                  </Select>
                  {(() => {
                    if (clientType === "business") {
                      return (
                        <div className="flex flex-col gap-4 pt-3">
                          <div>
                            <div className="mb-2 block">
                              <Label htmlFor="full_name" value="Name" />
                            </div>
                            <TextInput
                              id="full_name"
                              value={client.full_name}
                              placeholder=""
                              required={true}
                              onChange={(e) => {
                                let data = { ...client };
                                data.full_name = e.target.value;
                                setClient(data);
                              }}
                            />
                          </div>

                          <div className="flex flex-row gap-1">
                            <div className="w-1/2">
                              <div className="mb-2 block">
                                <Label htmlFor="email" value="Email" />
                              </div>
                              <TextInput
                                id="email"
                                placeholder=""
                                type="email"
                                value={client.email}
                                required={true}
                                onChange={(e) => {
                                  let data = { ...client };
                                  data.email = e.target.value;
                                  setClient(data);
                                }}
                              />
                            </div>
                            <div className="w-1/2">
                              <div className="mb-2 block">
                                <Label htmlFor="phone" value="Phone" />
                              </div>
                              <TextInput
                                id="phone"
                                placeholder=""
                                type="phone"
                                required={true}
                                onChange={(e) => {
                                  let data = { ...client };
                                  data.phone = e.target.value;
                                  setClient(data);
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex flex-row gap-1">
                            <div className="w-1/2">
                              <div className="mb-2 block">
                                <Label htmlFor="code" value="Company Code" />
                              </div>
                              <TextInput
                                id="code"
                                placeholder=""
                                type="text"
                                required={true}
                                onChange={(e) => {
                                  let data = { ...client };
                                  data.code = e.target.value;
                                  setClient(data);
                                }}
                              />
                            </div>
                            <div className="w-1/2">
                              <div className="mb-2 block">
                                <Label
                                  htmlFor="registration_code"
                                  value="Registration Code"
                                />
                              </div>
                              <TextInput
                                id="registration_code"
                                placeholder=""
                                type="text"
                                required={true}
                                onChange={(e) => {
                                  let data = { ...client };
                                  data.registration_code = e.target.value;
                                  setClient(data);
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex flex-row gap-1">
                            <div className="w-1/4">
                              <div className="mb-2 block">
                                <Label htmlFor="country_id" value="Coutry" />
                              </div>
                              <Select
                                id="country_id"
                                required={true}
                                onChange={(e) => {
                                  let data = { ...client };
                                  data.country_id = e.target.value;
                                  setClient(data);
                                }}
                              >
                                <option selected></option>
                                {countries.map((item: any, key) => (
                                  <option
                                    key={key + "country" + item.id}
                                    value={item.id}
                                  >
                                    {item.name}
                                  </option>
                                ))}
                              </Select>
                            </div>
                            <div className="w-1/4">
                              <div className="mb-2 block">
                                <Label htmlFor="region" value="Region" />
                              </div>
                              <TextInput
                                id="region"
                                placeholder=""
                                type="text"
                                required={true}
                                onChange={(e) => {
                                  let data = { ...client };
                                  data.region = e.target.value;
                                  setClient(data);
                                }}
                              />
                            </div>
                            <div className="w-1/4">
                              <div className="mb-2 block">
                                <Label htmlFor="city" value="City" />
                              </div>
                              <TextInput
                                id="city"
                                placeholder=""
                                type="text"
                                required={true}
                                onChange={(e) => {
                                  let data = { ...client };
                                  data.city = e.target.value;
                                  setClient(data);
                                }}
                              />
                            </div>
                            <div className="w-1/4">
                              <div className="mb-2 block">
                                <Label htmlFor="zipcode" value="Zip Code" />
                              </div>
                              <TextInput
                                id="zipcode"
                                placeholder=""
                                type="text"
                                required={true}
                                onChange={(e) => {
                                  let data = { ...client };
                                  data.zipcode = e.target.value;
                                  setClient(data);
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="mb-2 block">
                              <Label htmlFor="address" value="Address" />
                            </div>
                            <Textarea
                              id="address"
                              placeholder=""
                              required={true}
                              rows={4}
                              onChange={(e) => {
                                let data = { ...client };
                                data.address = e.target.value;
                                setClient(data);
                              }}
                            />
                          </div>
                        </div>
                      );
                    }

                    if (clientType === "person") {
                      return (
                        <div className="flex flex-col gap-1 pt-3">
                          <div className="flex flex-row gap-4">
                            <div className="w-1/3">
                              <div className="mb-2 block">
                                <Label
                                  htmlFor="first_name"
                                  value="First name"
                                />
                              </div>
                              <TextInput
                                id="first_name"
                                value={client.first_name}
                                placeholder=""
                                required={true}
                                onChange={(e) => {
                                  let data = { ...client };
                                  data.first_name = e.target.value;
                                  setClient(data);
                                }}
                              />
                            </div>
                            <div className="w-1/3">
                              <div className="mb-2 block">
                                <Label
                                  htmlFor="middle_name"
                                  value="Middle name"
                                />
                              </div>
                              <TextInput
                                id="middle_name"
                                placeholder=""
                                value={client.middle_name}
                                required={true}
                                onChange={(e) => {
                                  let data = { ...client };
                                  data.middle_name = e.target.value;
                                  setClient(data);
                                }}
                              />
                            </div>
                            <div className="w-1/3">
                              <div className="mb-2 block">
                                <Label htmlFor="last_name" value="Last name" />
                              </div>
                              <TextInput
                                id="last_name"
                                placeholder=""
                                value={client.last_name}
                                required={true}
                                onChange={(e) => {
                                  let data = { ...client };
                                  data.last_name = e.target.value;
                                  setClient(data);
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex flex-row gap-1">
                            <div className="w-1/2">
                              <div className="mb-2 block">
                                <Label htmlFor="email" value="Email" />
                              </div>
                              <TextInput
                                id="email"
                                placeholder=""
                                type="email"
                                value={client.email}
                                required={true}
                                onChange={(e) => {
                                  let data = { ...client };
                                  data.email = e.target.value;
                                  setClient(data);
                                }}
                              />
                            </div>
                            <div className="w-1/2">
                              <div className="mb-2 block">
                                <Label htmlFor="phone" value="Phone" />
                              </div>
                              <TextInput
                                id="phone"
                                placeholder=""
                                type="phone"
                                value={client.phone}
                                required={true}
                                onChange={(e) => {
                                  let data = { ...client };
                                  data.phone = e.target.value;
                                  setClient(data);
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="mb-2 block">
                              <Label htmlFor="unique_id" value="Unique ID" />
                            </div>
                            <TextInput
                              id="unique_id"
                              placeholder=""
                              type="text"
                              value={client.unique_id}
                              required={true}
                              onChange={(e) => {
                                let data = { ...client };
                                data.unique_id = e.target.value;
                                setClient(data);
                              }}
                            />
                          </div>
                          <div className="flex flex-row gap-1">
                            <div className="w-1/4">
                              <div className="mb-2 block">
                                <Label htmlFor="country_id" value="Coutry" />
                              </div>
                              <Select
                                value={client.country_id}
                                onChange={(e) => {
                                  let data = { ...client };
                                  data.country_id = e.target.value;
                                  setClient(data);
                                }}
                                id="country_id"
                                required={true}
                              >
                                <option selected></option>
                                {countries.map((item: any, key) => (
                                  <option
                                    key={key + "country" + item.id}
                                    value={item.id}
                                  >
                                    {item.name}
                                  </option>
                                ))}
                              </Select>
                            </div>
                            <div className="w-1/4">
                              <div className="mb-2 block">
                                <Label htmlFor="region" value="Region" />
                              </div>
                              <TextInput
                                value={client.region}
                                id="region"
                                placeholder=""
                                type="text"
                                required={true}
                                onChange={(e) => {
                                  let data = { ...client };
                                  data.region = e.target.value;
                                  setClient(data);
                                }}
                              />
                            </div>
                            <div className="w-1/4">
                              <div className="mb-2 block">
                                <Label htmlFor="city" value="City" />
                              </div>
                              <TextInput
                                value={client.city}
                                id="city"
                                placeholder=""
                                type="text"
                                required={true}
                                onChange={(e) => {
                                  let data = { ...client };
                                  data.city = e.target.value;
                                  setClient(data);
                                }}
                              />
                            </div>
                            <div className="w-1/4">
                              <div className="mb-2 block">
                                <Label htmlFor="zipcode" value="Zip Code" />
                              </div>
                              <TextInput
                                value={client.zipcode}
                                id="zipcode"
                                placeholder=""
                                type="text"
                                required={false}
                                onChange={(e) => {
                                  let data = { ...client };
                                  data.zipcode = e.target.value;
                                  setClient(data);
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="mb-2 block">
                              <Label htmlFor="address" value="Address" />
                            </div>
                            <Textarea
                              value={client.address}
                              id="address"
                              placeholder=""
                              required={true}
                              rows={4}
                              onChange={(e) => {
                                let data = { ...client };
                                data.address = e.target.value;
                                setClient(data);
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
              <div>
                {(() => {
                  if (clientType !== "") {
                    return (
                      <Button
                        className="w-full"
                        gradientMonochrome="info"
                        pill={true}
                        outline={false}
                        onClick={submit}
                      >
                        Edit
                      </Button>
                    );
                  }
                })()}
              </div>
            </Card>
          </div>
          <div className="flex-col w-1/12 ">
            <Card>
              <div className="flex flex-col  justify-center items-center">
                <div className="flex flex-row">
                  <Tooltip content="Add note">
                    {/* TODO add redirect to notes add */}
                    <Button
                      href={"/management/clients/" + uid + "/notes/create"}
                      pill={true}
                      outline={true}
                      color="light"
                    >
                      <HiOutlineDocumentReport />
                    </Button>
                  </Tooltip>
                </div>
                <div className="flex flex-row pt-2">
                  <ViewNotes client={client} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

function ViewNotes(props) {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const { client } = props;

  async function fetchData() {
    setIsLoading(true);
    if (notes.length > 0) {
      setIsLoading(false);
      return;
    }

    let r = await getNotes(client.uid);
    console.log(r);

    if (r === null) {
      setIsLoading(false);
      return;
    }
    setNotes(r.data);
    setIsLoading(false);
  }
  return (
    <>
      <Tooltip content="View notes">
        {/* TODO add redirect to notes add */}
        <Button
          onClick={() => {
            setShow(true);
            fetchData();
          }}
          pill={true}
          outline={true}
          color="light"
        >
          <IoAlbums />
        </Button>
      </Tooltip>
      <Modal
        show={show}
        onClose={() => {
          setShow(false);
        }}
      >
        <Modal.Header>
          Client{" "}
          <strong>
            {client.first_name} {client.middle_name} {client.last_name}
          </strong>{" "}
          Notes
        </Modal.Header>

        <Modal.Body>
          {isLoading ? (
            <div className="flex flex-row gap-4 pt-3">
              <div className="flex-col">
                <Spinner />{" "}
              </div>
            </div>
          ) : (
            <div>
              {notes.length === 0 ? (
                <div className="flex flex-row gap-4 pt-3">
                  <div className="flex-col">
                    <p className="text-xl text-gray-400">No notes</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-row gap-4 pt-3">
                  <Timeline>
                    {notes.map((note, index) => (
                      <Timeline.Item>
                        <Timeline.Point />
                        <Timeline.Content>
                          <Timeline.Time>{note.created_at}</Timeline.Time>
                          <Timeline.Title>
                            Note by {note.created_by}
                          </Timeline.Title>
                          <Timeline.Body>{note.note}</Timeline.Body>
                        </Timeline.Content>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <p className="text-sm text-gray-400">Client UID: {client.uid}</p>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function CreateNote() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({
    client_uid: uid,
    note_content: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  async function submit() {
    setIsLoading(true);
    console.debug(note);

    let r = await createNote(note);
    setIsLoading(false);
    if (r !== null) {
      navigate(-1);
    }
  }

  return (
    <>
      <div className="w-full">
        <section className="flex flex-col gap-4 w-3/4 mx-auto">
          <Card>
            <div>
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
              {isLoading ? (
                <div className="flex flex-row gap-4 pt-3">
                  <div className="flex-col"></div>
                  <div className="flex-col">
                    <Spinner />
                  </div>
                  <div className="flex-col"></div>
                </div>
              ) : null}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="note_content" value="Note" />
              </div>
              <Textarea
                id="note_content"
                value={note.note_content}
                placeholder=""
                rows={10}
                required={true}
                onChange={(e) => {
                  let data = { ...note };
                  data.note_content = e.target.value;
                  setNote(data);
                }}
              />
            </div>
            <div>
              <Button
                className="w-full"
                gradientMonochrome="info"
                pill={true}
                outline={false}
                onClick={submit}
              >
                Create
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}

function DeleteClientComponent(props) {
  const [isOpenModal, setisOpenModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  async function doDelete() {
    setIsDeleting(true);

    let r = await deleteClient({ client_uid: props?.client?.uid });
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
                <strong>{props?.client?.full_name}</strong>?
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
