import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Board from "./Board/Board";
import BoardPanel from "./BoardPanel/BoardPanel";
import Title from "../Components/Title";
import PlaySound from "../Components/PlaySound";
import PopupProvider from "../Components/PopupProvider";
import "../styles/Game.scss";

const queryClient = new QueryClient();

function Game() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="game">
                <PopupProvider />
                <PlaySound />
                <Title onlyMobileScreen />
                <Board />
                <BoardPanel />
            </div>
        </QueryClientProvider>
    );
}

export default Game;
