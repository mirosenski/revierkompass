export default function Home() {
	return (
		<div className="space-y-6">
			<h1 className="text-4xl font-bold">Willkommen beim Revierkompass</h1>
			<p className="text-lg text-gray-600 dark:text-gray-300">
				Entdecken Sie Ihre Umgebung mit unserem interaktiven Kompass.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold mb-3">Navigation</h2>
					<p className="text-gray-600 dark:text-gray-300">
						Finden Sie den besten Weg zu Ihrem Ziel.
					</p>
				</div>
				<div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold mb-3">Entdeckungen</h2>
					<p className="text-gray-600 dark:text-gray-300">
						Entdecken Sie interessante Orte in Ihrer Nähe.
					</p>
				</div>
				<div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold mb-3">Community</h2>
					<p className="text-gray-600 dark:text-gray-300">
						Teilen Sie Ihre Erfahrungen mit anderen.
					</p>
				</div>
			</div>
		</div>
	);
}
