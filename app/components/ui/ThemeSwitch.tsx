import { useTheme } from '~/app/lib/stores/theme';
import { MoonIcon, SunIcon } from '~/icons';
import { IconButton } from './IconButton';

export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  return (
    <IconButton
      onClick={toggleTheme}
      ariaLabel="Toggle theme"
      icon={theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    />
  );
}
