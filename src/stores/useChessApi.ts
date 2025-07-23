import { useQuery } from "@tanstack/react-query";
import { PostChessApiData, PostChessApiResponse } from "../types";

function useChessApi(postData: PostChessApiData, ctx: string) {
    const post = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
    };

    async function queryFn(): Promise<PostChessApiResponse> {
        return fetch("https://chess-api.com/v1", post).then((res) =>
            res.json()
        );
    }

    return useQuery({
        queryFn,
        queryKey: ["fen", post.body, ctx],
        enabled: false,
    });
}

export default useChessApi;
