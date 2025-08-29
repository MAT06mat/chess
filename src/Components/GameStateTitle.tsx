import SettingsCog from "../assets/svg/SettingsCog";
import { useGameStateStore } from "../services/stores/useGameStateStore";
import { useModalStore } from "../services/stores/useModalStore";
import "../styles/GameStateTitle.scss";
import SettingsModal from "./SettingsModal";

interface Props {
    onlyComputerScreen?: boolean;
    onlyMobileScreen?: boolean;
}

function GameStateTitle({ onlyComputerScreen, onlyMobileScreen }: Props) {
    const title = useGameStateStore((state) => state.title);
    const addModal = useModalStore((state) => state.addModal);

    const className = onlyComputerScreen
        ? " computer-screen"
        : onlyMobileScreen
        ? " mobile-screen"
        : "";

    return (
        <div className={"game-title" + className}>
            {title}
            <button
                className="open-settings"
                onClick={() => addModal(<SettingsModal />)}
            >
                <SettingsCog />
            </button>
        </div>
    );
}

export default GameStateTitle;
