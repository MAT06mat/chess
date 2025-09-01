import { AllHTMLAttributes, useRef, useState } from "react";
import Copy from "../../assets/svg/Copy";
import CheckMark from "../../assets/svg/CheckMark";

interface Props extends AllHTMLAttributes<HTMLDivElement> {
    text: string;
    nowrap?: boolean;
    allowCopy?: boolean;
}

function TextBox({ text, nowrap, allowCopy, ...props }: Props) {
    const [check, setCheck] = useState(false);
    const lastTimeOut = useRef<number | undefined>(undefined);

    function copy() {
        navigator.clipboard.writeText(text);
        setCheck(true);
        clearTimeout(lastTimeOut.current);
        lastTimeOut.current = setTimeout(() => setCheck(false), 1000);
    }

    return (
        <div className="text-box" {...props}>
            <span className={"text" + (nowrap ? " nowrap" : "")}>{text}</span>
            {allowCopy ? (
                <button className="text-copy" onClick={copy}>
                    {check ? <CheckMark /> : <Copy />}
                </button>
            ) : null}
        </div>
    );
}

export default TextBox;
