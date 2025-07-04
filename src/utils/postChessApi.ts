import { PostChessApiData, PostChessApiResponse } from "../types";

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
