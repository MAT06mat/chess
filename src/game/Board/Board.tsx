import { useEffect, useRef, useState } from "react";
import PromotionBox from "./PromotionBox";
import { CompleteMove, RelativeMove, Piece as PieceType } from "../../types";
import BoardCoordinates from "../../assets/svg/BoardCoordinates";
import useGameContext from "../../hooks/useGameContext";
import "../../styles/Board.scss";
import getValidMoves from "../../utils/moves/getValidMoves";
import WinnerPopup from "../Components/WinnerPopup";
import invertColor from "../../utils/invertColor";
import useCallbackRegisterMove from "../../hooks/useCallbackRegisterMove";
import useBot from "../../hooks/useBot";
import BoardHighLight from "./BoardHighLight";
import { CapturedPieces } from "../Components/CapturedPieces";
import EvaluationBar from "./EvaluationBar";
import Arrows from "./Arrows";
import getChessNotation from "../../utils/getChessNotation";
import useBoardClickEvent from "../../hooks/useBoardClickEvent";
import DisplayMoves from "./DisplayMoves";
import Pieces from "./Pieces";

function Board() {
    const {
        colorToPlay,
        setColorWinner,
        playerColor,
        opponentColor,
        gameStatus,
        setGameStatus,
        lastMove,
        pieces,
    } = useGameContext();

    const promotionCloseRef = useRef<HTMLDivElement>(null);
    const [validMoves, setValidMoves] = useState(new Map());
    const [displayMoves, setDisplayMoves] = useState<RelativeMove[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<PieceType | null>(null);
    const [promotionBoxVisible, setPromotionBoxVisible] = useState(false);
    const [nextMove, setNextMove] = useState<CompleteMove | null>(null);

    // Remove the selected piece on board change
    useEffect(() => {
        setSelectedPiece(null);
    }, [setSelectedPiece, pieces]);

    useBot(validMoves);

    const registerMove = useCallbackRegisterMove();

    // Find validMoves for the turn
    useEffect(() => {
        let color: "w" | "b" | "wb" = colorToPlay;
        if (gameStatus === "playingSandBox") {
            color = "wb";
        }
        const [map, numberOfMove] = getValidMoves(color, pieces, lastMove);
        setValidMoves(map);
        if (numberOfMove === 0) {
            if (lastMove?.check) {
                setColorWinner(invertColor(colorToPlay));
                lastMove.checkMate = true;
                lastMove.san = getChessNotation(lastMove);
            } else {
                setColorWinner("s");
            }
            setGameStatus("gameEnd");
        }
    }, [
        colorToPlay,
        lastMove,
        pieces,
        setColorWinner,
        gameStatus,
        setGameStatus,
    ]);

    // Pieces promotion
    useEffect(() => {
        if (!promotionBoxVisible && nextMove) {
            registerMove(nextMove, pieces);
            setNextMove(null);
        }
    }, [promotionBoxVisible, nextMove, pieces, registerMove]);

    // Display validMoves for the selectedPiece
    useEffect(() => {
        if (!selectedPiece) {
            setDisplayMoves([]);
            return;
        }
        setDisplayMoves(validMoves.get(selectedPiece.id));
    }, [selectedPiece, validMoves]);

    // Handle board click events
    const [boardClickEvent, boardRef] = useBoardClickEvent(
        promotionCloseRef,
        validMoves,
        displayMoves,
        setDisplayMoves,
        selectedPiece,
        setSelectedPiece,
        promotionBoxVisible,
        setPromotionBoxVisible,
        setNextMove
    );

    return (
        <div className="board-layout">
            <CapturedPieces color={playerColor} onlyComputerScreen />
            <div className="chessboard-layout">
                <EvaluationBar />
                <div className="board" {...boardClickEvent}>
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
                                setNextMove={setNextMove}
                                nextMove={nextMove}
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
