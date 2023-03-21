import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainView from "./views/MainView";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainView />} />
      </Routes>
    </>
  );
}

export default App;
