import React, { useState, useContext } from "react";
// import DataContext from "../../context/DataContext";
import { Navigate, Route } from "react-router-dom";
import DataContext from "../../context/DataContext";
// import {Route} from "react-router"

type ProtectedRouteProps = {
  children: React.ReactNode
}

const ProtectedRoute = ({ children, ...rest }: ProtectedRouteProps) => {
  const { isAuthenticated } = useContext<any>(DataContext);

  return <>{isAuthenticated ? children : <Navigate to={"/auth"} />}</>;
}

export default ProtectedRoute;
