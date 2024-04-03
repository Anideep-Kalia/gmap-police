import { Routes, Route } from "react-router-dom";
import User from "./User"
import Add from "./Add"



function App() {
  return (
    <>
      <Routes>
        {/* <Route path='/' element={<Homepage />} /> */}
        <Route path='/' element={<User />} />
        <Route path='/add' element={<Add />} />
      </Routes>
    </>
  );
}

export default App;
