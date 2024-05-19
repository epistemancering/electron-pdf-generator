import React from "react"
import DeleteButton from "./DeleteButton.tsx"

export default function GoogleFile(props: {
    googleHeaders: {},
    setChecked: Function,
    filesState: [{ name: string, id: string }[], Function],
    file: { name: string, id: string }
}) {
    const inputRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null)

    return <>
        <label style = {{ width: "100%", display: "flex", alignItems: "center" }}>
            <input ref = {inputRef} name = {"file"} type = {"radio"} value = {props.file.id} />
            {props.file.name}
        </label>
        <DeleteButton googleHeaders = {props.googleHeaders} setChecked = {props.setChecked} filesState = {props.filesState} id = {props.file.id} inputRef = {inputRef} />
    </>
}