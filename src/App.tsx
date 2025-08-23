import "./styles/App.scss";
import Game from "./game/Game";
import { Navigate, Route, Routes } from "react-router";
import PageLayout from "./routes/PageLayout";
import CustomGame from "./routes/CustomGame";

function App() {
    return (
        <Routes>
            <Route path="/" element={<PageLayout />}>
                <Route index element={<Game />} />
                <Route path="custom-game" element={<CustomGame />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}

export default App;
