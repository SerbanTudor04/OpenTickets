import ANavbar from "../components/admin/NavBar";
import ASideBar from "../components/admin/Sidebar";

export default function AdminLayout(props) {
  return (
    <>
      <div className="h-full flex  ">
        <div className="flex-col w-fit">
          <ASideBar className="z-1000" />
        </div>
        <div className="flex-col w-full h-screen relative bg-gray-50  ">
          <div className="">
            <div id="navbar" className=" pt-2 pl-3 pr-3 pb-3">
              <div className="relative w-full">
                <ANavbar appTitle={props.appTitle} />
              </div>
            </div>
            <div id="content" className="pt-10 ">
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
