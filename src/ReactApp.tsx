import React from "react"

export default function ReactApp() {
    const statusState = React.useState()

    return <>
        <button onClick = {async () => statusState[1](await window["electron"]("summarize"))}>summarize csv</button> {statusState[0]}
    </>
}