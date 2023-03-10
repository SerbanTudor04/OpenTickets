import { Button, Card, Label, Spinner, TextInput } from "flowbite-react";



import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useState } from "react";
import { getDepartments } from "../../../package/api/ausers";
import { createTicket } from "../../../package/api/atickets";
import { useNavigate } from "react-router-dom";



export default function ACreateTicket() {
  const [departments, setDepartemnts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [ticketData, setTicketData] = useState({
    subject:null,
    description:null,
    department_id:null,
    content:null,
  });
  const navigator= useNavigate()

  useEffect(() => {
    async function callMeBaby() {
      let r = await getDepartments();
      
      setDepartemnts(r);
    }
    callMeBaby();
  }, []);


  async function create(){
    setIsLoading(true)
    console.debug(ticketData);
    let r =await createTicket(ticketData)
    setIsLoading(false)
    if(r){
        // navigate to home
        navigator('/admin')
    }
  }


  return (
    <>
      <section className="flex flex-col justify-center items-center ">
        <div className="w-3/4">
          <Card>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create ticket
            </h5>
            <form className="flex flex-col gap-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="subject" value="Subject" />
                </div>
                <TextInput
                  id="subject"
                  type="text"
                  placeholder="I want to break free"
                  required={true}
                  onChange={(e)=>{
                    
                    let currentData={...ticketData}
                    currentData.subject=e.target.value
                    setTicketData(currentData)
                    setHasData(true)
                    
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="description" value="Short description" />
                </div>
                <TextInput
                  id="description"
                  type="text"
                  placeholder="Smile, life is beautiful"
                  required={true}
                  onChange={(e)=>{
                    
                    let currentData={...ticketData}
                    currentData.description= e.target.value
                    setTicketData(currentData)
                    
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="dept" value="Asign on department" />
                </div>
                <select
                  id="dept"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => {
                    let currentData={...ticketData}
                    currentData.department_id= e.target.value
                    setTicketData(currentData)
                  }}
                >
                  <option value={-1}>Choose a deparment</option>
                  {(() => {
                    if (departments === null) {
                      return <option>Loading...</option>;
                    }
                    return departments.map((dept) => {
                      return (
                        <option id={"dept--" + dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      );
                    });
                  })()}
                </select>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="content" value="Content" />
                </div>
                <Editor
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  onChange={(e)=>{
                    console.debug("onChange",e.target.getContent())
                    let currentData={...ticketData}
                    currentData.content=e.target.getContent()
                    setTicketData(currentData)
                    
                  }}
                  initialValue="<p>A detailed reason for creating it.</p>"
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | " +
                      "bold italic backcolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
              </div>
              <Button         gradientMonochrome="info"
                  pill={true}
                  outline={true} disabled={!hasData} onClick={create}>{(isLoading)?<Spinner/>: "Create Ticket"}</Button>
            </form>
          </Card>
        </div>
      </section>
    </>
  );
}
