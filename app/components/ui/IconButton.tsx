--- a/app/components/ui/IconButton.tsx
+++ b/app/components/ui/IconButton.tsx
@@ -1,49 +1,15 @@
-import { memo } from 'react';
-import { classNames } from '~/utils/classNames';
-
-type IconSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
-
-interface BaseIconButtonProps {
-  size?: IconSize;
-  className?: string;
-  iconClassName?: string;
-  disabledClassName?: string;
-  title?: string;
-  disabled?: boolean;
-  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
-}
-
-type IconButtonWithoutChildrenProps = {
-  icon: string;
-  children?: undefined;
-} & BaseIconButtonProps;
-
-type IconButtonWithChildrenProps = {
-  icon?: undefined;
-  children: string | JSX.Element | JSX.Element[];
-} & BaseIconButtonProps;
-
-type IconButtonProps = IconButtonWithoutChildrenProps | IconButtonWithChildrenProps;
-
-export const IconButton = memo(
-  ({
-    icon,
-    size = 'xl',
-    className,
-    iconClassName,
-    disabledClassName,
-    disabled = false,
-    title,
-    onClick,
-    children,
-  }: IconButtonProps) => {
-    return (
+import React from "react";
+import styles from "./IconButton.module.scss";
+interface IconButtonProps {
+  children: React.ReactNode;
+  onClick: () => void;
+  ariaLabel?: string;
+}
+
+const IconButton: React.FC<IconButtonProps> = ({ children, onClick, ariaLabel }) => {
+  return (
       <button
-        className={classNames(
-          'flex items-center text-bolt-elements-item-contentDefault bg-transparent enabled:hover:text-bolt-elements-item-contentActive rounded-md p-1 enabled:hover:bg-bolt-elements-item-backgroundActive disabled:cursor-not-allowed',
-          {
-            [classNames('opacity-30', disabledClassName)]: disabled,
-          },
-          className,
-        )}
-        title={title}
-        disabled={disabled}
+        className={styles.iconButton}
         onClick={(event) => {
-          if (disabled) {
-            return;
-          }
-
           onClick?.(event);
         }}
       >
@@ -51,18 +17,5 @@
     );
   },
 );
-
-function getIconSize(size: IconSize) {
-  if (size === 'sm') {
-    return 'text-sm';
-  } else if (size === 'md') {
-    return 'text-md';
-  } else if (size === 'lg') {
-    return 'text-lg';
-  } else if (size === 'xl') {
-    return 'text-xl';
-  } else {
-    return 'text-2xl';
-  }
-}
+export default IconButton;
