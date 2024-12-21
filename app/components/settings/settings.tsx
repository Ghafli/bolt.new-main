// app/components/settings/Settings.tsx
import React from "react";
import { useSettings } from "@/app/lib/stores/settings";
import { ThemeSwitch } from "@/app/components/ui/ThemeSwitch";
import styles from "./Settings.module.scss";

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
    const { theme, setTheme } = useSettings();

    const handleThemeChange = (newTheme: "light" | "dark") => {
        setTheme(newTheme);
    };

    return (
        <div className={styles.settingsOverlay}>
           <div className={styles.settingsPanel}>
                <div className={styles.header}>
                    <h2>Settings</h2>
                     <button className={styles.closeButton} onClick={onClose}>
                        X
                    </button>
                </div>
               <div className={styles.settingsBody}>
                     <div className={styles.settingItem}>
                         <label>Theme</label>
                        <ThemeSwitch
                            checked={theme === "dark"}
                            onChange={() => handleThemeChange(theme === "dark" ? "light" : "dark")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
