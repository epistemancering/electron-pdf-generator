import React from "react"

export default function DeleteButton(props: {
    googleHeaders: {},
    setChecked: Function,
    filesState: [{ name: string, id: string }[], Function],
    id: string,
    inputRef: React.MutableRefObject<HTMLInputElement | null>
}) {
    const deletableState = React.useState("")

    const onClick = async function() {
        if((await fetch(`https://www.googleapis.com/drive/v3/files/${props.id}`, { headers: props.googleHeaders, method: "delete" })).ok) {
            if (props.inputRef.current?.checked) {
                props.setChecked()
            }

            props.filesState[1](props.filesState[0].filter(function(filterFile) {
                return filterFile.id !== props.id
            }))
        } else {
            deletableState[1]("can't ")
        }
    }

    return <button name = {props.id} type = {"button"} style = {{ whiteSpace: "nowrap" }} onClick = {onClick} disabled = {Boolean(deletableState[0])}>
        {deletableState[0]}delete
    </button>
}