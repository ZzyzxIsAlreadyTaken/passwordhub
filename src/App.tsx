import { useState } from "react";
import "./App.css";
import CuteCard from "./components/CuteCard";
import DirtyCard from "./components/DirtyCard";

function App() {
  const [isCuteCard, setIsCuteCard] = useState(true);

  const toggleCard = () => setIsCuteCard(!isCuteCard);
  return (
    <section className="p-5 flex justify-center items-center h-screen">
      {isCuteCard ? (
        <CuteCard onHeaderClick={toggleCard} />
      ) : (
        <DirtyCard onHeaderClick={toggleCard} />
      )}
    </section>
  );
}

export default App;
