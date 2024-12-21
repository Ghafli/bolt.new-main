// app/Root.tsx
import React from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Header from "./components/header/Header";
import { useAuth } from "./lib/stores/auth";
import { LoadingDots } from "./components/ui/LoadingDots";


const Root: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();


  if(location.pathname !== "/" && !user){
    navigate("/");
     return <LoadingDots />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
           <Outlet />
      </div>
    </div>
  );
};

export default Root;
