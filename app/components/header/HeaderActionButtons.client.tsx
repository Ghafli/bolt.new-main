--- a/app/components/HeaderActionButtons/HeaderActionButtons.tsx
+++ b/app/components/HeaderActionButtons/HeaderActionButtons.tsx
@@ -1,10 +1,10 @@
 import React, { useState } from 'react';
-import { IconButton } from '@/app/components/ui/IconButton';
+import { IconButton } from "@/app/components/ui/IconButton";
 import { useTheme } from "@/app/lib/stores/theme";
 import { useSnapScroll } from "@/app/lib/hooks/useSnapScroll";
-import styles from './HeaderActionButtons.module.scss';
-import Settings from '@/app/components/settings/Settings';
-import Auth from '@/app/components/auth/Auth';
+import styles from "./HeaderActionButtons.module.scss";
+import Settings from "@/app/components/settings/Settings";
+import Auth from "@/app/components/auth/Auth";
 
 
 const HeaderActionButtons: React.FC = () => {
