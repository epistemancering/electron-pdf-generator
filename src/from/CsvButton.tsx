import React from "react"

export default function CsvButton(props: { setChecked: Function, setCsv: Function, inputRef: React.MutableRefObject<HTMLInputElement | null> }) {
    const onClick = async function() {
        const csvPath = await window["electron"]("dialog")

        if (csvPath && props.inputRef.current) {
            props.inputRef.current.disabled = false
            props.inputRef.current.checked = true
            props.setCsv(csvPath)
            props.setChecked(true)
        }
    }

    return <button type = {"button"} onClick = {onClick}>
        choose CSV
    </button>
}