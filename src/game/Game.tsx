import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Board from "./Board/Board";
import BoardPanel from "./BoardPanel/BoardPanel";
import GameStateTitle from "../Components/GameStateTitle";
import PlaySound from "../Components/PlaySound";
import { ModalProvider } from "../Components/ModalProvider";
import "../styles/Game.scss";

const queryClient = new QueryClient();

function Game() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="game">
                <ModalProvider />
                <PlaySound />
                <GameStateTitle onlyMobileScreen />
                <Board />
                <BoardPanel />
            </div>
        </QueryClientProvider>
    );
}

export default Game;
