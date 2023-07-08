import { Card, Spinner } from "flowbite-react";
import React, { useEffect } from "react";
import { useState } from "react";
import { fetchAPIData } from "../../../package/api/utilities";
import { useNavigate } from "react-router-dom";
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
          <ReportsTreeView data={data} />
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
              <details>
                <summary className="cursor-pointer decoration-sky-600 text-blue-800 hover:underline">{item.name}</summary>
                <div className="pl-3">
                  <ReportsTreeView data={item.childrens} />
                </div>
              </details>
            ) : (
              <a className="cursor-pointer  decoration-sky-600 text-blue-500 hover:underline"
                onClick={() => {
                  if (item.page_id !== null)
                    navigator(`/admin/reports/page/${item.page_id}`);
                }}
              >
                {item.name}
              </a>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
