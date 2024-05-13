import { readFileSync } from "fs"
import { app, BrowserWindow, ipcMain, dialog } from "electron"
import jspdf from "jspdf"

const createWindow = function() {
    const mainWindow = new BrowserWindow({
        webPreferences: { preload: `${__dirname}/preload.js` }
    })
    mainWindow.loadFile("build/index.html")
};

(async function() {
    await app.whenReady()
    createWindow()
})()

ipcMain.handle("summarize", async function() {
    const csvPath = (await dialog.showOpenDialog({})).filePaths[0]
    if (csvPath) {
        const pdfName = `summary-${Date.now()}.pdf`
        new jspdf().text(
            readFileSync(csvPath, "utf8").trim().split("\r\n").map(function(reportRow, rowNumber) {
                const rowArray = reportRow.split(",")
                return `
                    row ${rowNumber} average:
                    ${rowArray.map(Number).reduce(function(first, second) {
                        return first + second
                    }) / rowArray.length}
                `
            }).join(""),
            0,
            10
        ).save(pdfName)
        return `created ${pdfName}`
    }
})

app.on("window-all-closed", function() {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", function() {
    if (!BrowserWindow.getAllWindows()[0]) {
        createWindow()
    }
})