import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { HomePage } from "@/pages/HomePage";
import { PhotographyPage } from "@/pages/PhotographyPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/photography" element={<PhotographyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
