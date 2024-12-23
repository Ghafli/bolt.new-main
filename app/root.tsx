--- a/app/Root.tsx
+++ b/app/Root.tsx
@@ -1,10 +1,10 @@
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
 
