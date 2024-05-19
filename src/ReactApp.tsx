import React from "react"
import ChooseCsv from "./from/ChooseCsv.tsx"
import GoogleFiles from "./from/GoogleFiles.tsx"
import SaveSummary from "./to/SaveSummary.tsx"

export default function ReactApp(props: {
    googleAccount: {
        files: { name: string, id: string }[],
        folders: [],
        headers: {}
    }
}) {
    const checkedState = React.useState(false)
    const csvState = React.useState("")
    const filesState = React.useState(props.googleAccount.files)
    const statusState = React.useState("")

    const onSubmit = async function(formEvent: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) {
        formEvent.preventDefault()
        const fileAddress = new FormData(formEvent.currentTarget).get("file")
        let sheetValues: string[][]

        if (fileAddress === "on") {
            sheetValues = (await window["electron"]("fs", csvState[0])).trim().split("\r\n").map(function(reportRow: string) {
                return reportRow.split(",")
            })
        } else {
            sheetValues = (await (await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${fileAddress}/values/Sheet1`, { headers: props.googleAccount.headers })).json()).values
        }

        const summaryValues = sheetValues.map(function(sheetRow) {
            return sheetRow.map(Number).reduce(function(first, second) {
                return first + second
            }) / sheetRow.length
        })

        if (formEvent.nativeEvent.submitter?.id) {
            const name = `summary-${Date.now()}`

            const id = (await (await fetch("https://www.googleapis.com/drive/v3/files", {
                headers: props.googleAccount.headers,
                method: "post",
                body: JSON.stringify({ parents: [formEvent.nativeEvent.submitter?.id], mimeType: "application/vnd.google-apps.spreadsheet", name })
            })).json()).id

            await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/Sheet1?valueInputOption=user_entered`, {
                headers: props.googleAccount.headers,
                method: "put",
                body: JSON.stringify({
                    values: summaryValues.map(function(summaryValue) {
                        return [summaryValue]
                    })
                })
            })

            statusState[1](`saved ${name}`)
            filesState[1]([...filesState[0], { name, id }])
        } else {
            statusState[1](`saved ${await window["electron"]("jspdf", summaryValues.map(function(summaryValue, rowNumber) {
                return `
                    row ${rowNumber} average:
                    ${summaryValue}
                `
            }).join(""))}`)
        }
    }

    return <>
        <form style = {{ display: "flex", flexDirection: "column", alignItems: "flex-start" }} onChange = {() => checkedState[1](true)} onSubmit = {onSubmit}>
            <h1>
                Summarize data from:
            </h1>
            <label style = {{ display: "flex", alignItems: "center" }}>
                <ChooseCsv setChecked = {checkedState[1]} csvState = {csvState} />
            </label>
            <div>
                <GoogleFiles googleHeaders = {props.googleAccount.headers} setChecked = {checkedState[1]} filesState = {filesState} />
            </div>
            <SaveSummary googleFolders = {props.googleAccount.folders} getChecked = {checkedState[0]} />
        </form>
        <p>
            {statusState[0]}
        </p>
    </>
}