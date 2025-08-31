import { useEffect, useMemo, useRef, useState } from "react";
import { CompleteMove, RelativeMove, Piece as PieceType } from "../../types";
import BoardCoordinates from "../../assets/svg/BoardCoordinates";
import getValidMoves from "../../services/engine/getValidMoves";
import WinnerPopup from "../../Components/WinnerPopup";
import { invertColor, isDraw } from "../../utils/helpers";
import useBot from "../../services/bot/useBot";
import { CapturedPieces } from "../../Components/CapturedPieces";
import useBoardClickEvent from "../../hooks/useBoardClickEvent";
import { useBoardStore } from "../../services/stores/useBoardStore";
import {
    useColorToPlay,
    useLastMove,
    usePieces,
} from "../../services/stores/useBoardSelectors";
import { useSettingsStore } from "../../services/stores/useSettingsStore";
import { useGameStateStore } from "../../services/stores/useGameStateStore";
import "../../styles/Board.scss";
import { moveToSan } from "../../utils/formatting";
import { useCustomGameStore } from "../../services/stores/useCustomGameStore";
import useFetchCallback from "../../services/custom-game/3players/useFetch";
import {
    EvaluationBar,
    BoardHighLight,
    DisplayMoves,
    Pieces,
    PromotionBox,
    Arrows,
} from "./Components";
import { BoardRefContext } from "../../services/contexts/BoardRefContext";

function Board() {
    const setGameStatus = useGameStateStore((state) => state.setGameStatus);
    const setColorWinner = useGameStateStore((state) => state.setColorWinner);
    const isSandBox = useGameStateStore((state) => state.isSandBox);

    const history = useBoardStore((state) => state.history);
    const registerMove = useBoardStore((state) => state.registerMove);
    const colorToPlay = useColorToPlay();
    const pieces = usePieces();
    const lastMove = useLastMove();

    const playerColor = useSettingsStore((state) => state.playerColor);
    const opponentColor = useSettingsStore((state) => state.opponentColor);

    const customGame = useCustomGameStore((state) => state.customGame);
    const fetchCallback = useFetchCallback();

    const boardRef = useRef<HTMLDivElement>(null);
    const nextMoveRef = useRef<CompleteMove | null>(null);
    const promotionCloseRef = useRef<HTMLDivElement>(null);
    const [displayMoves, setDisplayMoves] = useState<RelativeMove[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<PieceType | null>(null);
    const [promotionBoxVisible, setPromotionBoxVisible] = useState(false);

    // Remove the selected piece on board change
    useEffect(() => {
        setSelectedPiece(null);
    }, [setSelectedPiece, pieces]);

    // Find validMoves for the turn
    const [validMoves, numberOfMove] = useMemo(() => {
        let color: "w" | "b" | "wb" = colorToPlay;
        if (isSandBox) color = "wb";
        return getValidMoves(color, pieces, lastMove, customGame);
    }, [colorToPlay, isSandBox, pieces, lastMove, customGame]);

    // 3 Players game fetch
    useEffect(() => {
        if (customGame !== "3Players") return;
        const interval = setInterval(
            () => fetchCallback({ getHistory: history.length }),
            1000
        );
        return () => clearInterval(interval);
    }, [customGame, fetchCallback, history]);

    useEffect(() => {
        const draw = isDraw(history);

        if ((numberOfMove !== 0 && !draw) || isSandBox) return;

        if (lastMove?.check) {
            setColorWinner(invertColor(colorToPlay));
            lastMove.checkMate = true;
            lastMove.san = moveToSan(lastMove);
        } else {
            setColorWinner("d", draw || "by Stalemate");
        }
        setGameStatus("gameEnd");
    }, [
        validMoves,
        numberOfMove,
        colorToPlay,
        lastMove,
        setColorWinner,
        setGameStatus,
        history,
        isSandBox,
    ]);

    useBot(validMoves);

    // Pieces promotion
    useEffect(() => {
        if (!promotionBoxVisible && nextMoveRef.current) {
            registerMove(nextMoveRef.current, pieces, customGame);
            nextMoveRef.current = null;
        }
    }, [promotionBoxVisible, pieces, registerMove, customGame]);

    // Display validMoves for the selectedPiece
    useEffect(() => {
        if (!selectedPiece) {
            setDisplayMoves([]);
            return;
        }
        setDisplayMoves(validMoves.get(selectedPiece.id) ?? []);
    }, [selectedPiece, validMoves]);

    // Handle board click events
    useBoardClickEvent(
        boardRef,
        promotionCloseRef,
        validMoves,
        displayMoves,
        setDisplayMoves,
        selectedPiece,
        setSelectedPiece,
        promotionBoxVisible,
        setPromotionBoxVisible,
        nextMoveRef
    );

    return (
        <BoardRefContext.Provider value={{ ref: boardRef }}>
            <div className="board-layout">
                <CapturedPieces color={playerColor} onlyComputerScreen />
                <div className="chessboard-layout">
                    <EvaluationBar />
                    <div
                        className="board"
                        onContextMenu={(event) => event.preventDefault()}
                        ref={boardRef}
                    >
                        <BoardCoordinates />
                        <BoardHighLight selectedPiece={selectedPiece} />
                        <DisplayMoves
                            selectedPiece={selectedPiece}
                            displayMoves={displayMoves}
                        />
                        <Pieces />
                        {promotionBoxVisible ? (
                            <>
                                <div
                                    ref={promotionCloseRef}
                                    className="promotion-box-close"
                                />
                                <PromotionBox
                                    setPromotionBoxVisible={
                                        setPromotionBoxVisible
                                    }
                                    nextMoveRef={nextMoveRef}
                                />
                            </>
                        ) : null}
                        <Arrows />
                        <WinnerPopup />
                    </div>
                </div>
                <CapturedPieces color={opponentColor} onlyComputerScreen />
            </div>
        </BoardRefContext.Provider>
    );
}

export default Board;
