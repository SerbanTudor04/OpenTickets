import {
  Alert,
  Button,
  Label,
  Modal,
  Spinner,
  Table,
  TextInput,
  Textarea,
} from "flowbite-react";
import { Fragment, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createBlock,
  createTemplate,
  deleteBLock,
  deleteTemplates,
  getBlocks,
  getTemplates,
  getVariables,
  updateBlock,
  updateTemplates,
} from "../../../package/api/aTemplates";
import { isSuperUser } from "../../../package/api/auth";
import {
  HiDeviceTablet,
  HiDocumentRemove,
  HiInformationCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

export default function AMgmTemplates(props) {
  const [isSu, setIsSU] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function callMeBaby() {
      let r = await isSuperUser();
      setIsSU(r);
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
  if (!isSu) {
    return (
      <>
        <div className="  ">
          <div className="flex  flex-col  justify-center items-center">
            <p>You don't have access to see this content.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="flex flex-col  justify-center items-center">
        <TemplatesSection />
      </section>
      <section className="flex flex-col  justify-center items-center pt-3">
        <BlocksSections />
      </section>
      <section className="flex flex-col  justify-center items-center pt-3">
        <VariablesSection />
      </section>
    </>
  );
}

function TemplatesSection(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState(null);

  useEffect(() => {
    async function callMeBaby() {
      let r = await getTemplates();
      setTemplates(r);
      setIsLoading(false);
    }
    callMeBaby();
  }, []);

  if (isLoading === true && templates === null) {
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

  if (templates === null) {
    return (
      <>
        <div className="  ">
          <div className="flex  flex-col  justify-center items-center">
            <p>
              There aren't any templates showed, please contact the
              administrator.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-3/4 grid grid-cols-1  ">
        <div className="">
          <div className="grid grid-cols-6 pb-3">
            <div className="col-start-1 col-end-3">
              <h5 className="text-2xl">Templates</h5>
            </div>
            <div className="col-start-7">
              <TemplatesUpdateOrCreate template={null} />
            </div>
          </div>
          <Table hoverable={true} className="">
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Label</Table.HeadCell>
              <Table.HeadCell>Created at</Table.HeadCell>
              <Table.HeadCell>Created by</Table.HeadCell>
              <Table.HeadCell>Updated at</Table.HeadCell>
              <Table.HeadCell>Updated by</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {(() => {
                if (templates === null || templates.length === 0) {
                  return (
                    <>
                      <Table.Row
                        key={"templatesTR--null"}
                        id={"templatesTR--null"}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          There aren't templates created yet.
                        </Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>

                        <Table.Cell>
                          {/* <Assign2MeModal item={item}/> */}
                          {/* <UpdateConfig item={item}/> */}
                        </Table.Cell>
                      </Table.Row>
                    </>
                  );
                }
                return templates.map((item, key) => {
                  return (
                    <Table.Row
                      key={key + "templatesTR--" + item.id}
                      id={key + "templatesTR--" + item.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {item.id}
                      </Table.Cell>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>{item.label}</Table.Cell>
                      <Table.Cell>{item.created_at}</Table.Cell>
                      <Table.Cell>{item.created_by}</Table.Cell>
                      <Table.Cell>{item.updated_at}</Table.Cell>
                      <Table.Cell>{item.updated_by}</Table.Cell>

                      <Table.Cell>
                        <div className="flex">
                          <TemplatesUpdateOrCreate template={item} />
                          <DeleteTemplate template={item} />
                        </div>

                        {/* <Assign2MeModal item={item}/> */}
                        {/* <UpdateConfig item={item}/> */}
                      </Table.Cell>
                    </Table.Row>
                  );
                });
              })()}
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  );
}

function TemplatesUpdateOrCreate(props) {
  const { template } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState({
    id: template?.id ?? "",
    name: template?.name ?? "",
    label: template?.label ?? "",
    content: template?.content ?? "",
    is_name_editable: template?.is_name_editable ?? true
  });

  const [alert, setAlert] = useState({
    title: null,
    content: null,
  });

  function onClose() {
    setIsOpen(false);
  }

  function addAlert(title, content) {
    setAlert({
      title: title,
      content: content,
    });
  }
  function clearAlert() {
    setAlert({
      title: null,
      content: null,
    });
  }

  async function createOrUpdate() {
    setIsLoading(true);
    clearAlert();

    if (!data.name) {
      addAlert("All fields are required.", "Name is required.");
      setIsLoading(false);
      return;
    }
    if (!data.label) {
      addAlert("All fields are required.", "Label is required.");
      setIsLoading(false);

      return;
    }

    if (!data.content) {
      addAlert("All fields are required.", "Content is required.");
      setIsLoading(false);

      return;
    }

    let r;
    if (template) {
      r = await updateTemplates(data);
    } else {
      r = await createTemplate(data);
    }

    if (r.status === "error" || r.status === "invalid") {
      addAlert("An error occured.", r.message);
      setIsLoading(false);

      return;
    }
    setIsLoading(false);

    navigate(0);
  }

  return (
    <>
     <main>
     <Fragment>
        {template === null ? (
          <Button
            gradientMonochrome="info"
            pill={true}
            outline={false}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Create +
          </Button>
        ) : (
          <Button
            gradientMonochrome="info"
            pill={true}
            outline={true}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Edit
          </Button>
        )}
        <Modal show={isOpen} onClose={onClose}>
          <Modal.Header>
            {template === null ? "Create template" : "Edit template"}
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              {/* alert  */}

              {alert.title ? (
                <Alert
                  color="failure"
                  icon={HiInformationCircle}
                  rounded={true}
                  additionalContent={makeAlertBody(alert.content)}
                  onDismiss={clearAlert}
                >
                  <h3 className="text-lg font-medium text-red-700 dark:text-red-800">
                    {alert.title}
                  </h3>
                </Alert>
              ) : null}

              {/* content */}

              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Coming soon a better editor
              </p>
              <div id="textarea">
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Name" />
                </div>
                <TextInput key={null}
                  id="name"
                  placeholder=""
                  disabled={data?.is_name_editable===true   ?  false : true}
                  required={true}
                  onChange={(e) => {
                    let cData = { ...data };
                    cData.name = e.target.value;
                    setData(cData);
                  }}
                  value={data.name}
                />
                <small className="text-4sm text-gray-500">
                  * Name of the template, which can be referenced in another
                  template.
                </small>
                {!template?.is_name_editable ? (
                  <>
                    <br />
                    <small className="text-4sm text-gray-500">
                      * This is field cannot be modified.
                    </small>
                  </>
                ) : null}
              </div>
              <div id="textarea">
                <div className="mb-2 block">
                  <Label htmlFor="label" value="Label" />
                </div>
                <TextInput
                  id="label"
                  placeholder=""
                  required={true}
                  onChange={(e) => {
                    let cData = { ...data };
                    cData.label = e.target.value;
                    setData(cData);
                  }}
                  value={data.label}
                />
                <small className="text-4sm text-gray-500">
                  * Label represents the main subject of the email in which
                  template will be used.
                </small>
              </div>
              <div id="textarea">
                <div className="mb-2 block">
                  <Label htmlFor="content" value="Content(HTML)" />
                </div>
                <Textarea
                  id="content"
                  placeholder="<html>...</html>"
                  required={true}
                  rows={4}
                  onChange={(e) => {
                    let cData = { ...data };
                    cData.content = e.target.value;
                    setData(cData);
                  }}
                  value={data.content}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              gradientMonochrome="info"
              pill={true}
              outline={true}
              className="w-full"
              onClick={createOrUpdate}
            >
              {isLoading ? (
                <Spinner />
              ) : template === null ? (
                "Create +"
              ) : (
                "Update"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
      </main>
    </>
  );
}

function DeleteTemplate(props) {
  const { template } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [data, _] = useState({
    id: template?.id ?? "",
    name: template?.name ?? "",
    label: template?.label ?? "",
    content: template?.content ?? "",
  });

  const [alert, setAlert] = useState({
    title: null,
    content: null,
  });

  function onClose() {
    setIsOpen(false);
  }

  function addAlert(title, content) {
    setAlert({
      title: title,
      content: content,
    });
  }
  function clearAlert() {
    setAlert({
      title: null,
      content: null,
    });
  }

  async function doDelete() {
    setIsLoading(true);
    clearAlert();

    let r = await deleteTemplates(data);

    if (r.status === "error" || r.status === "invalid") {
      addAlert("An error occured.", r.message);
      setIsLoading(false);

      return;
    }
    setIsLoading(false);

    navigate(0);
  }

  return (
    <>
      <Fragment>
        <Button
          gradientMonochrome="failure"
          pill={true}
          outline={true}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Delete
        </Button>

        <Modal show={isOpen} onClose={onClose}>
          <Modal.Header>Delete template</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              {/* alert  */}

              {alert.title ? (
                <Alert
                  color="failure"
                  icon={HiInformationCircle}
                  rounded={true}
                  additionalContent={makeAlertBody(alert.content)}
                  onDismiss={clearAlert}
                >
                  <h3 className="text-lg font-medium text-red-700 dark:text-red-800">
                    {alert.title}
                  </h3>
                </Alert>
              ) : null}

              {/* content */}
              <div className="text-center">
                {isLoading ? (
                  <Spinner className="mx-auto mb-4 h-14 w-14" />
                ) : (
                  <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                )}

                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete{" "}
                  <strong>{props?.template?.name}</strong>?
                </h3>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
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
                onClick={close}
              >
                No, cancel
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </Fragment>
    </>
  );
}

function makeAlertBody(content) {
  return (
    <>
      <Fragment>
        <div className="mt-2 mb-4 text-sm text-red-700 dark:text-red-800">
          {content}
        </div>
      </Fragment>
    </>
  );
}

function BlocksSections(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [blocks, setBlocks] = useState(null);
  useEffect(() => {
    async function callMeBaby() {
      let d = await getBlocks();
      setBlocks(d);
      setIsLoading(false);
    }
    callMeBaby();
  }, []);
  if (isLoading === true && blocks === null) {
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

  if (blocks === null) {
    return (
      <>
        <div className="  ">
          <div className="flex  flex-col  justify-center items-center">
            <p>
              There aren't any blocks showed, please contact the administrator.
            </p>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="w-3/4 grid grid-cols-1  ">
        <div className="">
          <div className="grid grid-cols-6 pb-3">
            <div className="col-start-1 col-end-3">
              <h5 className="text-2xl">Blocks</h5>
            </div>
            <div className="col-start-7">
              <BlocksUpdateOrCreate block={null} />
            </div>
          </div>
          <Table hoverable={true} className="">
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Created at</Table.HeadCell>
              <Table.HeadCell>Created by</Table.HeadCell>
              <Table.HeadCell>Updated at</Table.HeadCell>
              <Table.HeadCell>Updated by</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {(() => {
                if (blocks === null || blocks.length === 0) {
                  return (
                    <>
                      <Table.Row
                        key={"blocksTR--null"}
                        id={"blocksTR--null"}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          There aren't blocks created yet.
                        </Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>

                        <Table.Cell>
                          {/* <Assign2MeModal item={item}/> */}
                          {/* <UpdateConfig item={item}/> */}
                        </Table.Cell>
                      </Table.Row>
                    </>
                  );
                }
                return blocks.map((item, key) => {
                  return (
                    <Table.Row
                      key={key + "blocksTR--" + item.id}
                      id={key + "blocksTR--" + item.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {item.id}
                      </Table.Cell>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>{item.created_at}</Table.Cell>
                      <Table.Cell>{item.created_by}</Table.Cell>
                      <Table.Cell>{item.updated_at}</Table.Cell>
                      <Table.Cell>{item.updated_by}</Table.Cell>

                      <Table.Cell>
                      <div className="flex">
                          <BlocksUpdateOrCreate block={item} />
                          <DeleteBlock block={item} />
                        </div>
                        {/* <Assign2MeModal item={item}/> */}
                        {/* <UpdateConfig item={item}/> */}
                      </Table.Cell>
                    </Table.Row>
                  );
                });
              })()}
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  );
}


function BlocksUpdateOrCreate(props) {
  const { block } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState({
    id: block?.id ?? "",
    name: block?.name ?? "",
    content: block?.content ??"",
  });

  const [alert, setAlert] = useState({
    title: null,
    content: null,
  });

  function onClose() {
    setIsOpen(false);
  }

  function addAlert(title, content) {
    setAlert({
      title: title,
      content: content,
    });
  }
  function clearAlert() {
    setAlert({
      title: null,
      content: null,
    });
  }

  async function createOrUpdate() {
    setIsLoading(true);
    clearAlert();

    if (!data.name) {
      addAlert("All fields are required.", "Name is required.");
      setIsLoading(false);
      return;
    }

    if (!data.content) {
      addAlert("All fields are required.", "Content is required.");
      setIsLoading(false);

      return;
    }

    let r;
    if (block) {
      r = await updateBlock(data);
    } else {
      r = await createBlock(data);
    }

    if (r.status === "error" || r.status === "invalid") {
      addAlert("An error occured.", r.message);
      setIsLoading(false);

      return;
    }
    setIsLoading(false);

    navigate(0);
  }

  return (
    <>
      <Fragment>
        {block === null ? (
          <Button
            gradientMonochrome="info"
            pill={true}
            outline={false}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Create +
          </Button>
        ) : (
          <Button
            gradientMonochrome="info"
            pill={true}
            outline={true}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Edit
          </Button>
        )}
        <Modal show={isOpen} onClose={onClose}>
          <Modal.Header>
            {block === null ? "Create template" : "Edit template"}
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              {/* alert  */}

              {alert.title ? (
                <Alert
                  color="failure"
                  icon={HiInformationCircle}
                  rounded={true}
                  additionalContent={makeAlertBody(alert.content)}
                  onDismiss={clearAlert}
                >
                  <h3 className="text-lg font-medium text-red-700 dark:text-red-800">
                    {alert.title}
                  </h3>
                </Alert>
              ) : null}

              {/* content */}

              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Coming soon a better editor
              </p>
              <div id="textarea">
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Name" />
                </div>
                <TextInput
                  id="name"
                  placeholder=""
                  
                  required={true}
                  onChange={(e) => {
                    let cData = { ...data };
                    cData.name = e.target.value;
                    setData(cData);
                  }}
                  value={data.name}
                />
                <small className="text-4sm text-gray-500">
                  * Name of the block, which can be referenced in another
                  template.
                </small>
               
              </div>
              <div id="textarea">
                <div className="mb-2 block">
                  <Label htmlFor="content" value="Content(HTML)" />
                </div>
                <Textarea
                  id="content"
                  placeholder="<html>...</html>"
                  required={true}
                  rows={4}
                  onChange={(e) => {
                    let cData = { ...data };
                    cData.content = e.target.value;
                    setData(cData);
                  }}
                  value={data.content}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              gradientMonochrome="info"
              pill={true}
              outline={true}
              className="w-full"
              onClick={createOrUpdate}
            >
              {isLoading ? (
                <Spinner />
              ) : block === null ? (
                "Create +"
              ) : (
                "Update"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    </>
  );
}


function DeleteBlock(props) {
  const { block } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [data, _] = useState({
    id: block?.id ?? null,
    name: block?.name ?? null,
    content: block?.content ?? null,
  });

  const [alert, setAlert] = useState({
    title: null,
    content: null,
  });

  function onClose() {
    setIsOpen(false);
  }

  function addAlert(title, content) {
    setAlert({
      title: title,
      content: content,
    });
  }
  function clearAlert() {
    setAlert({
      title: null,
      content: null,
    });
  }

  async function doDelete() {
    setIsLoading(true);
    clearAlert();

    let r = await deleteBLock(data);

    if (r.status === "error" || r.status === "invalid") {
      addAlert("An error occured.", r.message);
      setIsLoading(false);

      return;
    }
    setIsLoading(false);

    navigate(0);
  }

  return (
    <>
      <Fragment>
        <Button
          gradientMonochrome="failure"
          pill={true}
          outline={true}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Delete
        </Button>

        <Modal show={isOpen} onClose={onClose}>
          <Modal.Header>Delete template</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              {/* alert  */}

              {alert.title ? (
                <Alert
                  color="failure"
                  icon={HiInformationCircle}
                  rounded={true}
                  additionalContent={makeAlertBody(alert.content)}
                  onDismiss={clearAlert}
                >
                  <h3 className="text-lg font-medium text-red-700 dark:text-red-800">
                    {alert.title}
                  </h3>
                </Alert>
              ) : null}

              {/* content */}
              <div className="text-center">
                {isLoading ? (
                  <Spinner className="mx-auto mb-4 h-14 w-14" />
                ) : (
                  <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                )}

                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete{" "}
                  <strong>{props?.template?.name}</strong>?
                </h3>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
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
                onClick={close}
              >
                No, cancel
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </Fragment>
    </>
  );
}


function VariablesSection(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [vars, setVars] = useState(null);
  useEffect(() => {
    async function callMeBaby() {
      let d = await getVariables();
      setVars(d);
      setIsLoading(false);
    }
    callMeBaby();
  }, []);
  if (isLoading === true && vars === null) {
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

  if (vars === null) {
    return (
      <>
        <div className="  ">
          <div className="flex  flex-col  justify-center items-center">
            <p>
              There aren't any variables showed, please contact the
              administrator.
            </p>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="w-3/4 grid grid-cols-1  ">
        <div className="">
          <h5 className="text-2xl">Variables</h5>
          <Table hoverable={true} className="">
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Created at</Table.HeadCell>
              <Table.HeadCell>Created by</Table.HeadCell>
              <Table.HeadCell>Updated at</Table.HeadCell>
              <Table.HeadCell>Updated by</Table.HeadCell>
              <Table.HeadCell>Is static</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {(() => {
                if (vars === null || vars.length === 0) {
                  return (
                    <>
                      <Table.Row
                        key={"varsTR--null"}
                        id={"varsTR--null"}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          There aren't variables created yet.
                        </Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>

                        <Table.Cell>
                          {/* <Assign2MeModal item={item}/> */}
                          {/* <UpdateConfig item={item}/> */}
                        </Table.Cell>
                      </Table.Row>
                    </>
                  );
                }
                return vars.map((item, key) => {
                  return (
                    <Table.Row
                      key={key + "varsTR--" + item.id}
                      id={key + "varsTR--" + item.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {item.id}
                      </Table.Cell>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>{item.created_at}</Table.Cell>
                      <Table.Cell>{item.created_by}</Table.Cell>
                      <Table.Cell>{item.updated_at}</Table.Cell>
                      <Table.Cell>{item.updated_by}</Table.Cell>
                      <Table.Cell>
                        {item.is_static ? (
                          <span className="text-blue-900">Yes</span>
                        ) : (
                          <span className="text-red-400">No </span>
                        )}
                      </Table.Cell>

                      <Table.Cell>
                        {/* <Assign2MeModal item={item}/> */}
                        {/* <UpdateConfig item={item}/> */}
                      </Table.Cell>
                    </Table.Row>
                  );
                });
              })()}
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  );
}
