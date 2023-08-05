import { Button, Card, Spinner, Table, Tooltip } from "flowbite-react";
import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import { fetchAPIData } from "../../../package/api/utilities";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineArrowLeft } from "react-icons/hi";
interface ReportsTreeViewProps {
  id: number;
  name: string;
  page_id: number;
  childrens: ReportsTreeViewProps[];
}

export default function ReportsTree() {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [data, setData] = useState<ReportsTreeViewProps[]>([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      let r = await fetchAPIData("/admin/reports/getReportsTree", "GET");

      let data = await r.json();
      setData(data.data);
      console.log(data.data);

      setIsLoading(false);
    }
    fetchData();
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
      <section className="flex flex-col  justify-center items-center mx-auto">
        <Card className="w-1/2">
          <h1 className="text-2xl font-bold text-left">Reports</h1>
          <hr />
          <div className="container mx-auto">
            <ReportsTreeView data={data} />
          </div>
        </Card>
      </section>
    </>
  );
}

function ReportsTreeView(props: any) {
  let { data } = props;
  let navigator = useNavigate();
  return (
    <>
      <ul>
        {data.map((item, index) => (
          // deepcode ignore ReactMissingArrayKeys: <please specify a reason of ignoring this>
          <li key={String(item.name).replace(" ", "_") + index}>
            {item.childrens !== null ? (
              <details className=" [&_svg]:open:-rotate-180">
                <summary className="flex cursor-pointer  list-none items-center">
                  <div>
                    <svg
                      className="rotate-0 transform text-blue-700 transition-all duration-300"
                      fill="none"
                      height="20"
                      width="20"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                  <div className="decoration-sky-600 text-blue-800 hover:underline">
                    {index + 1}.{item.name}
                  </div>
                </summary>
                <div className="pl-3">
                  <ReportsTreeView data={item.childrens} />
                </div>
              </details>
            ) : (
              <a
                className="cursor-pointer pl-5 decoration-sky-600 text-blue-500 hover:underline"
                onClick={() => {
                  if (item.page_id !== null)
                    navigator(`/management/reports/page/${item.page_id}`);
                }}
              >
                {index + 1}. {item.name}
              </a>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
// TODO implement the page view

export function ReportsPageView() {
  const params = useParams();
  let { id } = params;
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [pageDetails, setPageDetails] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      let r = await fetchAPIData("/admin/reports/getPageDetails", "POST", {
        page_id: id,
      });

      if (r.status >= 400) {
        toast("Invalid page");
        return;
      }

      let data = await r.json();
      setPageDetails(data.data);

      setIsLoading(false);
    }
    fetchData();
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
      <section className="flex flex-col  justify-center items-center mx-auto">
        <div id="page_details" className="item-left relative w-3/4">
          <div className="flex">
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
            <div>
              <h1 className="text-2xl font-bold text-left">
                {pageDetails?.title}
              </h1>
              <small className="text-gray-500 text-left">
                {pageDetails?.description}
              </small>
            </div>
          </div>
        </div>

        <ReportsPageViewComponents id={id} />
      </section>
    </>
  );
}

function ReportsPageViewComponents(props) {
  const { id } = props;
  const [pageComponents, setPageComponents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      let r = await fetchAPIData("/admin/reports/getPageComponents", "POST", {
        page_id: id,
      });

      if (r.status >= 400) {
        toast("Page doesn't have components");
        return;
      }

      let data = await r.json();
      setPageComponents(data.data);

      setIsLoading(false);
    }
    fetchData();
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
      {pageComponents.map((item, index) => (
        <ReportsPageViewComponent item={item} key={item.name + index} />
      ))}
    </>
  );
}

interface ReportComponentDataQuery {
  columns: String[];
  data: any[];
}
interface ReportComponentData {
  html: String | null;
  query: ReportComponentDataQuery | null;
}

function ReportsPageViewComponent(props) {
  const { item } = props;
  const [componentData, setComponentData] =
    useState<ReportComponentData | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      let r = await fetchAPIData(
        "/admin/reports/getPageComponentData",
        "POST",
        {
          component_id: item.id,
        }
      );

      if (r.status >= 400) {
        toast(
          `An unexpected error occured while fetching the component ${item.name} data`
        );
        setIsLoading(false);

        return;
      }

      let data = await r.json();
      setComponentData(data.data);
      console.log(data.data);

      setIsLoading(false);
    }
    fetchData();
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
  if (componentData?.html !== null)
    return (
      <>
        <section className="w-3/4">
          <section className="relative w-full mt-3">
            {componentData?.query !== null ? (
              <ReportsPageViewComponentQueryDataTable
                componentData={componentData}
              />
            ) : null}
          </section>
        </section>
      </>
    );
}

function ReportsPageViewComponentQueryDataTable({ componentData }) {
  console.log(componentData);

  return (
    <Table className="">
      
      <Table.Head>
        {componentData?.query?.columns.map((item) => (
          <Table.HeadCell key={item}>
            {String(item).replace("_", " ")}
          </Table.HeadCell>
        ))}
      </Table.Head>
      <Table.Body className="divide-y">
        {componentData?.query?.data.map((item:any,index:any) => (
          <Table.Row key={`tabrow${index}`} className="bg-white dark:border-gray-700 dark:bg-gray-800">

           {item.map((item2:any,index2:any) => (
                <Table.Cell  className="bg-white dark:border-gray-700 dark:bg-gray-800" key={`tabrowcel${index}${index2}${index+index2}`}>
                  {item2}
              </Table.Cell>
           ))}
            

          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
