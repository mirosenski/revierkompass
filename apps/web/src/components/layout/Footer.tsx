export function Footer() {
	return (
		<footer className="mt-16 bg-gray-100 py-6 text-center text-xs dark:bg-gray-800">
			<p>
				© {new Date().getFullYear()} RevierKompass – built with&nbsp;
				<a href="https://react.dev" className="underline hover:text-primary-700">
					React
				</a>
			</p>
		</footer>
	);
}
