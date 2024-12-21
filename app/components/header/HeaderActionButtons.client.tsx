// app/components/HeaderActionButtons/HeaderActionButtons.tsx
import React, { useState } from 'react';
import { IconButton } from '@/app/components/ui/IconButton';
import { useTheme } from "@/app/lib/stores/theme";
import { useSnapScroll } from "@/app/lib/hooks/useSnapScroll";
import styles from './HeaderActionButtons.module.scss';
import Settings from '@/app/components/settings/Settings';
import { useWorkbench } from '@/app/lib/stores/workbench';
import { useChat } from '@/app/lib/stores/chat';

const HeaderActionButtons: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const {snap} = useSnapScroll();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const {showWorkbench, toggleWorkbench} = useWorkbench();
    const {showChat, toggleChat} = useChat();


    const handleOpenSettings = () => {
        setIsSettingsOpen(true)
    }

     const handleCloseSettings = () => {
        setIsSettingsOpen(false)
    }

  return (
    <div className={styles.headerActions}>
       <IconButton onClick={toggleTheme}>
         {isDark ? "☀️" : "🌙"}
      </IconButton>
        <IconButton onClick={() => {
                toggleChat();
				if(showWorkbench){
                    toggleWorkbench();
                }
				
		}}>
              💬
            </IconButton>
		<IconButton onClick={() => {
			toggleWorkbench()
			if(showChat){
				toggleChat();
			}
		}}>
		  {showWorkbench ?  <span className='i-ph:code-bold'/> : <span className="i-ph:code-bold" />}
		</IconButton>
      <IconButton onClick={handleOpenSettings}>
        ⚙️
       </IconButton>
     {isSettingsOpen && <Settings onClose={handleCloseSettings} />}
    </div>
  );
};

export default HeaderActionButtons;
