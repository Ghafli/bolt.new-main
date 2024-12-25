import { FunctionComponent, useState } from "react";
import { Dialog } from "../ui/Dialog";
import styles from "./Settings.module.scss";
import { useSettingsStore } from "~/app/lib/stores/settings";
import { Slider } from "../ui/Slider";
import { IconButton } from "../ui/IconButton";

const Settings: FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { fontSize, setFontSize } = useSettingsStore();

  return (
    <>
      <IconButton
        aria-label="settings"
        onClick={() => setIsOpen(true)}
        icon="settings"
      />
      <Dialog
        title="Settings"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className={styles.settings}>
          <div className={styles.content}>
            <div className={styles.section}>
              <div className={styles.title}>Editor</div>
              <div className={styles.options}>
                <div className={styles.option}>
                  <div className={styles["option-name"]}>Font Size</div>
                  <Slider
                    min={10}
                    max={24}
                    value={fontSize}
                    onChange={setFontSize}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Settings;
