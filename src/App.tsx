import { Toaster } from "react-hot-toast";
import "./App.css";
import RouteElements from "./routes";

function App() {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <RouteElements />
    </>
  );
}

export default App;
