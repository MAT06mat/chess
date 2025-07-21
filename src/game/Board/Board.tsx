import { useEffect, useMemo, useRef, useState } from "react";
import PromotionBox from "./PromotionBox";
import { CompleteMove, RelativeMove, Piece as PieceType } from "../../types";
import BoardCoordinates from "../../assets/svg/BoardCoordinates";
import "../../styles/Board.scss";
import getValidMoves from "../../utils/moves/getValidMoves";
import WinnerPopup from "../Components/WinnerPopup";
import invertColor from "../../utils/invertColor";
import useBot from "../../hooks/useBot";
import BoardHighLight from "./BoardHighLight";
import { CapturedPieces } from "../Components/CapturedPieces";
import EvaluationBar from "./EvaluationBar";
import Arrows from "./Arrows";
import getChessNotation from "../../utils/getChessNotation";
import useBoardClickEvent from "../../hooks/useBoardClickEvent";
import DisplayMoves from "./DisplayMoves";
import Pieces from "./Pieces";
import { useBoardStore } from "../../stores/useBoardStore";
import {
    useColorToPlay,
    useLastMove,
    usePieces,
} from "../../stores/useBoardSelectors";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { useGameStateStore } from "../../stores/useGameStateStore";

function Board() {
    const setGameStatus = useGameStateStore((state) => state.setGameStatus);
    const setColorWinner = useGameStateStore((state) => state.setColorWinner);
    const isSandBox = useGameStateStore((state) => state.isSandBox);

    const registerMove = useBoardStore((state) => state.registerMove);
    const colorToPlay = useColorToPlay();
    const pieces = usePieces();
    const lastMove = useLastMove();

    const playerColor = useSettingsStore((state) => state.playerColor);
    const opponentColor = useSettingsStore((state) => state.opponentColor);

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
        return getValidMoves(color, pieces, lastMove);
    }, [colorToPlay, isSandBox, pieces, lastMove]);

    useEffect(() => {
        if (numberOfMove !== 0) return;

        if (lastMove?.check) {
            setColorWinner(invertColor(colorToPlay));
            lastMove.checkMate = true;
            lastMove.san = getChessNotation(lastMove);
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
            registerMove(nextMoveRef.current, pieces);
            nextMoveRef.current = null;
        }
    }, [promotionBoxVisible, pieces, registerMove]);

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
