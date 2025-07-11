import { useEffect, useRef, useState } from "react";
import Piece from "./Piece";
import BoardInfo from "./BoardInfo";
import getSquarePos from "../../utils/getSquarePos";
import PromotionBox from "./PromotionBox";
import { CompleteMove, RelativeMove, Piece as PieceType } from "../../types";
import BoardCoordinates from "../../assets/svg/BoardCoordinates";
import useGameContext from "../../hooks/useGameContext";
import "../../styles/Board.scss";
import getValidMoves from "../../utils/moves/getValidMoves";
import WinnerPopup from "../Components/WinnerPopup";
import invertColor from "../../utils/invertColor";
import useCallbackRegisterMove from "../../hooks/useCallbackRegisterMove";
import getCompleteMove from "../../utils/moves/getCompleteMove";
import useBot from "../../hooks/useBot";
import BoardHighLight from "./BoardHighLight";
import { CapturedPieces } from "../Components/CapturedPieces";
import EvaluationBar from "./EvaluationBar";
import Arrows from "./Arrows";
import getChessNotation from "../../utils/getChessNotation";

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
    const [displayMoves, setDisplayMoves] = useState<RelativeMove[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<PieceType | null>(null);
    const [promotionBoxVisible, setPromotionBoxVisible] = useState(false);
    const [nextMove, setNextMove] = useState<CompleteMove | null>(null);

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
    function handlePieceClick(piece: PieceType) {
        const isSandBox = gameStatus === "playingSandBox";
        const isVsBot = gameStatus === "playingVsBot";
        const isvsFriend = gameStatus === "playingVsFriend";
        const isYourTurn = colorToPlay === (invertedColor ? "b" : "w");
        const isColorToPlay = piece.color === colorToPlay;

        if (
            isSandBox ||
            (isColorToPlay && ((isVsBot && isYourTurn) || isvsFriend))
        ) {
            setSelectedPiece(piece);
        }
    }

    return (
        <div className="board-layout">
            <CapturedPieces
                color={invertedColor ? "b" : "w"}
                onlyComputerScreen
            />
            <div className="chessboard-layout">
                <EvaluationBar />
                <div
                    className="board"
                    ref={boardRef}
                    onClick={handleBoardClick}
                >
                    <BoardCoordinates />
                    <BoardHighLight
                        selectedPiece={selectedPiece}
                        lastMove={lastMove}
                    />
                    {selectedPiece
                        ? displayMoves.map((move, index) => {
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
                          })
                        : null}
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
                    <Arrows />
                    <WinnerPopup />
                </div>
            </div>
            <CapturedPieces
                color={invertedColor ? "w" : "b"}
                onlyComputerScreen
            />
        </div>
    );
}

export default Board;
