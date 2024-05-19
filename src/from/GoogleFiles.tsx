import React from "react"
import GoogleFile from "./GoogleFile.tsx"

export default function GoogleFiles(props: {
    googleHeaders: {},
    setChecked: Function,
    filesState: [{ name: string, id: string }[], Function]
}) {
    return props.filesState[0].map(function(file) {
        return <div key = {file.id} style = {{ display: "flex", justifyContent: "space-between", gap: "6px" }}>
            <GoogleFile googleHeaders = {props.googleHeaders} setChecked = {props.setChecked} filesState = {props.filesState} file = {file} />
        </div>
    })
}