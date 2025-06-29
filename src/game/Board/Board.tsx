import { useEffect, useRef, useState } from "react";
import Piece, { piece } from "./Piece";
import BoardInfo from "./BoardInfo";
import getSquarePos from "../../utils/getSquarePos";
import PromotionBox from "./PromotionBox";
import { completeMove, move } from "../../types";
import BoardCoordinates from "../../assets/svg/BoardCoordinates";
import useGameContext from "../../hooks/useGameContext";
import "../../styles/Board.scss";
import getValidMoves from "../../utils/moves/getValidMoves";
import WinnerPopup from "../Components/WinnerPopup";
import invertColor from "../../utils/invertColor";
import useCallbackRegisterMove from "../../hooks/useCallbackRegisterMove";
import getCompleteMove from "../../utils/moves/getCompleteMove";
import useBot from "../../hooks/useBot";

function Board() {
    const {
        movesHistory,
        actualMove,
        colorToPlay,
        setColorWinner,
        invertedColor,
        gameStatus,
        setGameStatus,
    } = useGameContext();

    const boardRef = useRef<HTMLDivElement>(null);
    const promotionCloseRef = useRef<HTMLDivElement>(null);
    const [validMoves, setValidMoves] = useState(new Map());
    const [displayMoves, setDisplayMoves] = useState<move[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<piece | null>(null);
    const [promotionBoxVisible, setPromotionBoxVisible] = useState(false);
    const [nextMove, setNextMove] = useState<completeMove | null>(null);

    const pieces = movesHistory[actualMove].pieces;
    const lastMove = movesHistory[actualMove].lastMove;

    // Remove the selected piece on board change
    useEffect(() => {
        setSelectedPiece(null);
    }, [setSelectedPiece, pieces]);

    useBot(validMoves, gameStatus === "playingVsBot");

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
            const newPieces = structuredClone(pieces).map((piece) =>
                piece.id === nextMove.toPiece?.id ? nextMove.toPiece : piece
            );
            registerMove(nextMove, newPieces);
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

    // Handle the board click event
    function handleBoardClick(event: React.MouseEvent<HTMLDivElement>) {
        if (promotionBoxVisible && event.target === promotionCloseRef.current) {
            setNextMove(null);
            setPromotionBoxVisible(false);
            return;
        }

        const board = boardRef.current;
        if (board) {
            const { x, y } = getSquarePos(event, board, invertedColor);

            // If a piece is selected, move it to the clicked position
            if (selectedPiece) {
                const validMove = displayMoves.find(
                    (move) =>
                        move.x === x - selectedPiece.x &&
                        move.y === y - selectedPiece.y
                );

                if (validMove) {
                    const completeMove = getCompleteMove(
                        validMove,
                        selectedPiece
                    );

                    if (completeMove.special === "promotion") {
                        setPromotionBoxVisible(true);
                        setNextMove(completeMove);
                    } else {
                        registerMove(completeMove, pieces);
                    }
                }
                setSelectedPiece(null);
            }
        }
    }

    // Handle the piece click event
    function handlePieceClick(piece: piece) {
        const isSandBox = gameStatus === "playingSandBox";
        const isVsBot = gameStatus === "playingVsBot";
        const isvsFriend = gameStatus === "playingVsFriend";
        const isYourTurn = colorToPlay === (invertedColor ? "b" : "w");
        const isColorToPlay = piece.type[0] === colorToPlay;

        if (
            isSandBox ||
            (isColorToPlay && ((isVsBot && isYourTurn) || isvsFriend))
        ) {
            setSelectedPiece(piece);
        }
    }

    return (
        <div className="board" ref={boardRef} onClick={handleBoardClick}>
            <BoardCoordinates />
            {lastMove ? (
                <>
                    <BoardInfo
                        className="highlight"
                        x={lastMove.toX}
                        y={lastMove.toY}
                    />
                    <BoardInfo
                        className="highlight"
                        x={lastMove.fromX}
                        y={lastMove.fromY}
                    />
                </>
            ) : null}
            {selectedPiece ? (
                <>
                    <BoardInfo
                        className="highlight"
                        x={selectedPiece.x}
                        y={selectedPiece.y}
                    />
                    {displayMoves.map((move, index) => {
                        return (
                            <BoardInfo
                                className={
                                    move.capture ? "capture-hint" : "hint"
                                }
                                borderWidth={
                                    boardRef.current?.clientWidth
                                        ? boardRef.current?.clientWidth *
                                              0.011 +
                                          "px"
                                        : undefined
                                }
                                key={index}
                                x={move.x + selectedPiece.x}
                                y={move.y + selectedPiece.y}
                            />
                        );
                    })}
                </>
            ) : null}
            {pieces.map((piece) => (
                <Piece
                    key={invertedColor ? piece.id + 64 : piece.id}
                    piece={piece}
                    onPieceClick={handlePieceClick}
                />
            ))}
            {promotionBoxVisible ? (
                <>
                    <div
                        ref={promotionCloseRef}
                        className="promotion-box-close"
                    />
                    <PromotionBox
                        x={nextMove?.toX}
                        y={nextMove?.toY}
                        setPromotionBoxVisible={setPromotionBoxVisible}
                        setNextMove={setNextMove}
                        nextMove={nextMove}
                    />
                </>
            ) : null}
            <WinnerPopup />
        </div>
    );
}

export default Board;
