--- a/app/Root.tsx
+++ b/app/Root.tsx
@@ -1,11 +1,13 @@
 import React from "react";
 import {
-  Outlet,
-  useLocation,
-  useNavigate,
+    Outlet,
+    useLocation,
+    useNavigate,
 } from "react-router-dom";
-import Header from "./components/header/Header";
+import Header from "@/app/components/header/Header";
 import { useAuth } from "./lib/stores/auth";
 import { LoadingDots } from "./components/ui/LoadingDots";
+import Toast from "./components/ui/Toast";
 import { useToast } from "./lib/stores/toast";
 
 
@@ -13,6 +15,7 @@
   const navigate = useNavigate();
   const { user } = useAuth();
 
+    const { message, type, clearToast } = useToast();
 
   if(location.pathname !== "/" && !user){
     navigate("/");
@@ -22,7 +25,7 @@
   return (
     <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
       <Header />
+         {message && <Toast type={type} message={message} />}
+        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
+            <Outlet />
+        </main>
       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Outlet />
       </div>
