import { usePopupStore } from "../../stores/usePopupStore";

function PopupProvider() {
    return usePopupStore((state) => state.currentPopup);
}

export default PopupProvider;
