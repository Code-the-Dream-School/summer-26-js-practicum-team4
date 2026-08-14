import React from "react";
import { useNavigate } from "react-router-dom";

function NotFoundPage (){
const navigate =useNavigate();

return(
    <div>
        <p>Page Not Found</p>
        <button onClick={()=>navigate(-1)}>Back</button>
        <button onClick={()=>navigate("/")}>Home</button>
    </div>
   
)
}

export default NotFoundPage;

