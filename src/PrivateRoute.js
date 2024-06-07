import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import UserContext from "./UserContext";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useContext(UserContext);

  if (!currentUser)
    {
       return <Navigate to="/" />
    }
    else return children
 
};

export default PrivateRoute;