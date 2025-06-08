import "./styles/App.scss";
import Game from "./game/Game";

function App() {
    return (
        <>
            <Game />
            <div className="footer">
                This is not the official site of Chess.com, we are not
                affiliated with Chess.com in any way.
            </div>
        </>
    );
}

export default App;
