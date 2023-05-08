import React from "react";

export default function Layout(props){
    
    return (
        <>
          <section>
          <div className=" ">
            {props.children}
            </div>

          </section>

            
 
        </>
      )
}