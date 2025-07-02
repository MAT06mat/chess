interface PostChessApiData {
    fen: string;
    variants?: number; // max: 5, default: 1,
    depth?: number; // max: 18, default: 12,
    maxThinkingTime?: number; // max: 100, default: 50 (ms),
    searchmoves?: string; // evaluate specific moves only, ex. 'd2d4 e2e4',
}

interface PostChessApiResponse {
    text: string;
    eval: number;
    move: string;
    fen: string;
    depth: number;
    winChance: number;
    continuationArr: string[];
    mate: null | number;
    centipawns: number;

    san: string;
    lan: string;
    turn: string;
    color: string;
    piece: string;
    flags: string;
    isCapture: boolean;
    isCastling: boolean;
    isPromotion: boolean;

    from: string;
    to: string;
    fromNumeric: number[];
    toNumeric: number[];

    taskId: string;
    time: number;
    type: string;
}

async function postChessApi(
    data: PostChessApiData
): Promise<PostChessApiResponse> {
    const response = await fetch("https://chess-api.com/v1", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

export default postChessApi;
