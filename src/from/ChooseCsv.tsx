import React from "react"
import CsvButton from "./CsvButton.tsx"

export default function ChooseCsv(props: { setChecked: Function, csvState: [string, Function] }) {
    const inputRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null)

    return <>
        <input ref = {inputRef} name = {"file"} type = {"radio"} disabled />
        <div style = {{ display: "flex", gap: "6px" }}>
            {props.csvState[0]}
            <CsvButton setChecked = {props.setChecked} setCsv = {props.csvState[1]} inputRef = {inputRef} />
        </div>
    </>
}