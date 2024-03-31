// import './App.css';
// import Board from './components/Board/Board';

// function App() {
//   return (
//     <Board/>
//   );
// }

// export default App;

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Infor from './components/Infor/Infor';
import Board from './components/Board/Board';
import Navigation from './components/Navigation/Navigation';
import DataSensors from './components/DataSensors/DataSensors';
import ActionHistory from './components/ActionHistory/ActionHistory';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Board />} />
        <Route path="/datasensors" element={<DataSensors />} />
        <Route path="/actionhistory" element={<ActionHistory />} />
        <Route path="/infor" element={<Infor />} />
        <Route path="/nav" element={<Navigation />} />
      </Routes>
    </Router>
  );
};

export default App;
