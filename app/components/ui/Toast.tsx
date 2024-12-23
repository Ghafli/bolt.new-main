// app/components/ui/Toast.tsx
import React, { useState, useEffect } from "react";
import styles from "./Toast.module.scss";

interface ToastProps {
    message: string;
    type?: "success" | "error" | "info";
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = "info", duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (isVisible) {
          const timer = setTimeout(() => {
                setIsVisible(false);
            }, duration);
               return () => clearTimeout(timer)
       }
    }, [isVisible, duration]);

    if(!isVisible) {
        return null;
    }
    return (
        <div className={`${styles.toast} ${styles[type]}`}>
              {message}
        </div>
    );
};

export default Toast;
