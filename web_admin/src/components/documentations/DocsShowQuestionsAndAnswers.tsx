import { Accordion } from "flowbite-react";

export default function DocsShowQuestionsAndAnswers({ data }: any) {
  //   const { data } = props;
  console.log("data", data);
  return (
    <Accordion flush={true} collapseAll={true}  >
      {data.map((item:any ) => (
        <Accordion.Panel >
          <Accordion.Title>{item.title}</Accordion.Title>
          <Accordion.Content>
           {/* <div dangerouslySetInnerHTML={{ __html:  }}></div> */}
           {item.content}
          </Accordion.Content>
        </Accordion.Panel>
      ))}
    </Accordion>
  );
}
