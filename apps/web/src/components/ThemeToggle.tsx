import { useEffect, useState } from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'

type Theme = 'light' | 'dark' | 'system'

export function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>(() => {
		const saved = localStorage.getItem('theme')
		return (saved as Theme) || 'system'
	})

	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		const root = document.documentElement
		root.classList.remove('light', 'dark')
		
		if (theme === 'light') {
			root.classList.add('light')
		} else if (theme === 'dark') {
			root.classList.add('dark')
		} else {
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				root.classList.add('dark')
			} else {
				root.classList.add('light')
			}
		}
		
		localStorage.setItem('theme', theme)
	}, [theme])

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		
		const handler = (e: MediaQueryListEvent) => {
			if (theme === 'system') {
				const root = document.documentElement
				root.classList.remove('light', 'dark')
				root.classList.add(e.matches ? 'dark' : 'light')
			}
		}
		
		mediaQuery.addEventListener('change', handler)
		return () => mediaQuery.removeEventListener('change', handler)
	}, [theme])

	if (!mounted) return null

	return (
		<div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-full">
			<button
				onClick={() => setTheme('light')}
				className={`relative p-2 rounded-full transition-all duration-300 ${
					theme === 'light' 
						? 'bg-white dark:bg-gray-700 shadow-sm scale-110' 
						: 'hover:bg-gray-200 dark:hover:bg-gray-700 scale-95 opacity-60'
				}`}
				title="Hell"
			>
				<Sun className="h-4 w-4" />
			</button>
			<button
				onClick={() => setTheme('system')}
				className={`relative p-2 rounded-full transition-all duration-300 ${
					theme === 'system' 
						? 'bg-white dark:bg-gray-700 shadow-sm scale-110' 
						: 'hover:bg-gray-200 dark:hover:bg-gray-700 scale-95 opacity-60'
				}`}
				title="System"
			>
				<Monitor className="h-4 w-4" />
			</button>
			<button
				onClick={() => setTheme('dark')}
				className={`relative p-2 rounded-full transition-all duration-300 ${
					theme === 'dark' 
						? 'bg-white dark:bg-gray-700 shadow-sm scale-110' 
						: 'hover:bg-gray-200 dark:hover:bg-gray-700 scale-95 opacity-60'
				}`}
				title="Dunkel"
			>
				<Moon className="h-4 w-4" />
			</button>
		</div>
	)
}
