import React from "react"

export default function GoogleFolders(props: { googleFolders: { name: string, id: string }[] }) {
    return props.googleFolders.map(function(googleFolder) {
        return <button key = {googleFolder.id} id = {googleFolder.id}>
            {googleFolder.name}
        </button>
    })
}