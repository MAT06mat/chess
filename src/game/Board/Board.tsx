import { useEffect, useMemo, useRef, useState } from "react";
import PromotionBox from "./PromotionBox";
import { CompleteMove, RelativeMove, Piece as PieceType } from "../../types";
import BoardCoordinates from "../../assets/svg/BoardCoordinates";
import getValidMoves from "../../services/engine/getValidMoves";
import WinnerPopup from "../../Components/WinnerPopup";
import { invertColor } from "../../utils/helpers";
import useBot from "../../services/bot/useBot";
import BoardHighLight from "./BoardHighLight";
import { CapturedPieces } from "../../Components/CapturedPieces";
import EvaluationBar from "./EvaluationBar";
import Arrows from "./Arrows";
import useBoardClickEvent from "../../hooks/useBoardClickEvent";
import DisplayMoves from "./DisplayMoves";
import Pieces from "./Pieces";
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
        if (numberOfMove !== 0) return;

        if (lastMove?.check) {
            setColorWinner(invertColor(colorToPlay));
            lastMove.checkMate = true;
            lastMove.san = moveToSan(lastMove);
        } else {
            setColorWinner("s");
        }
        setGameStatus("gameEnd");
    }, [
        validMoves,
        numberOfMove,
        colorToPlay,
        lastMove,
        setColorWinner,
        setGameStatus,
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
                        boardRef={boardRef}
                    />
                    <Pieces />
                    {promotionBoxVisible ? (
                        <>
                            <div
                                ref={promotionCloseRef}
                                className="promotion-box-close"
                            />
                            <PromotionBox
                                setPromotionBoxVisible={setPromotionBoxVisible}
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
    );
}

export default Board;
