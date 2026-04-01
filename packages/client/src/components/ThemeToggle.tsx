import { useTheme } from '../lib/theme';
import { Button } from 'ui';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    </Button>
  );
}
