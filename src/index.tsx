import React from "react"
import { createRoot } from "react-dom/client"
import ReactApp from "./ReactApp.tsx"

(async function() {
    createRoot(document.querySelector("div")).render(<ReactApp googleAccount = {await window["electron"]("google")} />)
})()