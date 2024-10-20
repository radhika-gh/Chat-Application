import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage"
import Chatpage from "./pages/Chatpage";
import background from "./background.png";
function App() {
  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundImage: `url(${background})`, // Use the imported image
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "black",
      }}
    >
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<Chatpage />} />
      </Routes>
    </div>
  );
}

export default App;
