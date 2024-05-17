// import './App.css';
// import Board from './components/Board/Board';

// function App() {
//   return (
//     <Board/>
//   );
// }

// export default App;

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Infor from './pages/Infor/Infor';
import Board from './pages/Board/Boardcopy';
import Navigation from './components/Navigation/Navigation';
import DataSensors from './pages/DataSensors/DataSensors';
import ActionHistory from './pages/ActionHistory/ActionHistory';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Board />} />
        <Route path="/datasensor" element={<DataSensors />} />
        <Route path="/actionhistory" element={<ActionHistory />} />
        <Route path="/infor" element={<Infor />} />
        <Route path="/nav" element={<Navigation />} />
      </Routes>
    </Router>
  );
};

export default App;
