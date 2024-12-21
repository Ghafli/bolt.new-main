// app/components/Workbench/Workbench.tsx
import React from 'react';
import FileTree from './FileTree';
import EditorPanel from './EditorPanel';
import Terminal from './terminal/Terminal';
import Preview from './Preview';
import { useWorkbench } from "@/app/lib/stores/workbench";
import styles from "./Workbench.module.scss";
import GitCommands from './GitCommands';
import ResourceMonitor from './ResourceMonitor';


const Workbench: React.FC = () => {
  const { activePanel } = useWorkbench();

  return (
    <div className={styles.workbench}>
        <div className={styles.sidebar}>
             <FileTree />
          </div>
        <div className={styles.mainContent}>
            <div className={styles.mainHeader}>
                <GitCommands />
                 <ResourceMonitor />
              </div>
           {activePanel === 'editor' && <EditorPanel />}
           {activePanel === 'terminal' &&  <Terminal />}
             {activePanel === 'preview' &&  <Preview />}
        </div>
    </div>
  );
};

export default Workbench;
