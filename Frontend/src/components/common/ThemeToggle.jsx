import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
const ThemeToggle = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    useEffect(() => {
        document.querySelector('html').setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    return (
        <label className="swap swap-rotate btn btn-ghost btn-circle">
            <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
            <Sun className="swap-on fill-current w-5 h-5" />
            <Moon className="swap-off fill-current w-5 h-5" />
        </label>
    );
};
export default ThemeToggle;