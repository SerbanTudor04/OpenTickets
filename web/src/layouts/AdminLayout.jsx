import ANavbar from "../components/admin/NavBar";
import ASideBar from "../components/admin/Sidebar";

export default function AdminLayout(props){
    return (
        <>
        <div className="h-screen flex">
            <div className="flex-col w-fit">
                <ASideBar/>
            </div>
            <div className="flex-col w-full">
                <section id="navbar" className="mb-5">
                    <ANavbar/>
                </section>
                <section id="content">
                    {props.children}

                </section>
            </div>

        </div>


            
 
        </>
      )
}