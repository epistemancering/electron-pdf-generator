import { readFileSync } from "fs"
import { app, BrowserWindow, ipcMain, dialog } from "electron"
import { sign } from "jsonwebtoken"
import jspdf from "jspdf"

const createWindow = function() {
    const mainWindow = new BrowserWindow({
        webPreferences: { preload: `${__dirname}/preload.js` }
    })

    mainWindow.loadFile("build/index.html")
}

const googleAccount: {
    headers: {},
    files: {}[],
    folders: {}[]
} = {
    headers: {},
    files: [],
    folders: []
}

;(async function() {
    try {
        const googleJson = "./key"
        const googleCredentials = await import(googleJson)

        googleAccount.headers = {
            authorization: `Bearer ${(await (await fetch("https://oauth2.googleapis.com/token", {
                method: "post",
                body: JSON.stringify({
                    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                    assertion: sign({ aud: "https://oauth2.googleapis.com/token", iss: googleCredentials.client_email, scope: "https://www.googleapis.com/auth/drive", exp: Math.floor(Date.now() / 1000) + 3600 }, googleCredentials.private_key, { algorithm: "RS256" })
                })
            })).json()).access_token}`
        }

        const googleFiles = (await (await fetch("https://www.googleapis.com/drive/v3/files", {
            headers: googleAccount.headers
        })).json()).files

        for (const file in googleFiles) {
            if (googleFiles[file].mimeType === "application/vnd.google-apps.spreadsheet") {
                googleAccount.files[googleAccount.files.length] = googleFiles[file]
            } else if (googleFiles[file].mimeType === "application/vnd.google-apps.folder") {
                googleAccount.folders[googleAccount.folders.length] = googleFiles[file]
            }
        }
    } catch {}

    await app.whenReady()
    createWindow()
})()

ipcMain.handle("google", function() {
    return googleAccount
})

ipcMain.handle("dialog", function() {
    return dialog.showOpenDialogSync({
        filters: [{ name: "CSV spreadsheets", extensions: ["csv"] }]
    })?.[0]
})

ipcMain.handle("fs", function(invokeEvent, filePath) {
    return readFileSync(filePath, "utf8")
})

ipcMain.handle("jspdf", function(invokeEvent, summaryValues) {
    const pdfName = `summary-${Date.now()}.pdf`
    new jspdf().text(summaryValues, 0, 10).save(pdfName)
    return pdfName
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