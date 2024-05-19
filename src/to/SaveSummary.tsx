import React from "react"
import GoogleFolders from "./GoogleFolders.tsx"

export default function SaveSummary(props: { googleFolders: [], getChecked: boolean }) {
    if (props.getChecked) {
        return <>
            <h1>
                Save summary to:
            </h1>
            <button>
                local PDF
            </button>
            <GoogleFolders googleFolders = {props.googleFolders} />
        </>
    }
}