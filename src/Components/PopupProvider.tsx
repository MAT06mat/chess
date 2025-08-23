import { usePopupStore } from "../services/stores/usePopupStore";

function PopupProvider() {
    return usePopupStore((state) => state.currentPopup);
}

export default PopupProvider;
