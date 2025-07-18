import "./styles/App.scss";
import Game from "./game/Game";
import { usePersistedState } from "./hooks/usePersistedSate";

function App() {
    const [footer, setFooter] = usePersistedState("footer", true);

    return (
        <>
            <Game />
            <div
                className={"footer" + (footer ? " computer-screen " : "")}
                onClick={() => setFooter(!footer)}
            >
                This is not the official site of Chess.com, we are not
                affiliated with Chess.com in any way.{" "}
                <a href="https://github.com/MAT06mat/chess" target="_blanck">
                    See more
                </a>
            </div>
        </>
    );
}

export default App;
