// app/components/HeaderActionButtons/HeaderActionButtons.tsx
import React, { useState } from 'react';
import { IconButton } from '@/app/components/ui/IconButton';
import { useTheme } from "@/app/lib/stores/theme";
import { useSnapScroll } from "@/app/lib/hooks/useSnapScroll";
import styles from './HeaderActionButtons.module.scss';
import Settings from '@/app/components/settings/Settings';
import Auth from '@/app/components/auth/Auth';


const HeaderActionButtons: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
    const {snap} = useSnapScroll();
     const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleOpenSettings = () => {
        setIsSettingsOpen(true)
    }

     const handleCloseSettings = () => {
        setIsSettingsOpen(false)
    }

  return (
    <div className={styles.headerActions}>
         <Auth />
       <IconButton onClick={toggleTheme}>
         {isDark ? "☀️" : "🌙"}
      </IconButton>
         <IconButton onClick={() => snap('chat')}>
              💬
            </IconButton>
      <IconButton onClick={handleOpenSettings}>
        ⚙️
       </IconButton>
     {isSettingsOpen && <Settings onClose={handleCloseSettings} />}
    </div>
  );
};

export default HeaderActionButtons;
