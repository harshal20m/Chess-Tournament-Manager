import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Tournaments from "./components/Tournaments";
import PointsTable from "./components/PointsTable";
import Registration from "./components/Registration";
import HallOfFame from "./components/HallOfFame";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PlayerDetails from "./components/PlayerDetails";
import Matchups from "./components/Matchups";

const App = () => {
	return (
		<Router>
			<div className="min-h-screen pt-14">
				<Header />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/tournaments" element={<Tournaments />} />
					<Route path="/points-table" element={<PointsTable />} />
					<Route path="/registration" element={<Registration />} />
					<Route path="/hall-of-fame" element={<HallOfFame />} />
					<Route path="/player/:username" element={<PlayerDetails />} />
					<Route path="/matchups" element={<Matchups />} />
				</Routes>
				<Footer />
			</div>
		</Router>
	);
};

export default App;
