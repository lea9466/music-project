import { useState } from "react";
import '../style/toggleBtn.css'
type Props = {
    btns: { str: string, icon: string }[]
    onSet:Function
    activeTab:string
}

function ToggleButtons(props: Props) {
    const newBtns = props.btns.map(btn =>
        <button
            className={`toggle-btn ${props.activeTab === btn.icon ? 'active' : ''}`}
            onClick={() => props.onSet(btn.icon)}>
            <span className="material-symbols-outlined">{btn.icon}</span>
            {btn.str}
        </button>
    )

    return (
        <div className="wrapperBtns">
            {newBtns}
        </div>
    )
}
export default ToggleButtons