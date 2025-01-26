import Points from "./Points";

const PointsTable = () => {
	return (
		<div className="bg-white/80 min-h-screen rounded-xl shadow-lg p-8 mt-4">
			<h2 className="text-3xl font-bold mb-4">Points Table</h2>
			<div className="space-y-4">
				<p>
					Tournament standings and player points will be displayed here Like this , for now its just a dummy
					data from our great chess players
				</p>
				<Points />{" "}
			</div>
		</div>
	);
};

export default PointsTable;
