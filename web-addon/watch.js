var dButton = null
var dButtonDiv = null
var dButtonList = null

const serverPage = "https://beaver.mom:2096"


addEventListener("yt-page-data-updated", (event) => {
    if (dButtonDiv == null || dButton == null) {
        addButton()
    }

    
    // call the updateList (async) function outside of an async function
    (async () => {
        await updateList(window.location.href)
    })();

    removeOfficialDownloadButton()
});

function removeOfficialDownloadButton() {
    const shittyDownloadButtons = document.querySelectorAll("ytd-download-button-renderer")
    
    // Loop through the elements and remove them
    shittyDownloadButtons.forEach(element => {
        console.log("YDA: removing google's shitty download button")
        element.remove();
    });
}

function addButton() {
    console.log("YDA: adding download button")
    
    let downloadDiv = document.createElement("div")
    downloadDiv.className = "download-button-YDA style-scope ytd-watch-metadata"
    
    let downloadBtn = document.createElement("button")
    downloadBtn.className = "yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m"
    downloadBtn.addEventListener("click", showList)
    downloadDiv.appendChild(downloadBtn)
    
    
    let downloadBtnText = document.createElement("span")
    downloadBtnText.textContent = "Download to Disk ▼"
    downloadBtn.appendChild(downloadBtnText)

    
    let subscribeDiv = document.getElementById("owner")
    subscribeDiv.appendChild(downloadDiv)
    
    dButton = downloadBtn
    dButtonDiv = downloadDiv
}

function recreateDButtonList() {
    const elementsToRemove = document.querySelectorAll(".YDA_list")

    // Loop through the elements and remove them
    elementsToRemove.forEach(element => {
        element.remove();
    });
    if (dButtonList != null) {
        dButtonList = null
    }
    dButtonList = document.createElement("div")
    dButtonList.hidden = true
    dButtonList.className = "YDA_list"
}

async function updateList(url) {  
    recreateDButtonList()
    let errorMessage = document.createElement("p")
    errorMessage.textContent = "loading..."
    dButtonList.appendChild(errorMessage)
    dButton.appendChild(dButtonList)

    try {
        // example URL: (https://www.youtube.com/watch?v=dQw4w9WgXcQ)
        const regex = /v=([a-zA-Z0-9_-]{11})/;
        let videoID = url.match(regex)[1]

        response = await fetch(`https://beaver.mom:2096/info/${videoID}`)
            .then((response) => response.json())

        // console.log(response)
        // console.log(response["formats"].length)

        recreateDButtonList()

        let availableFormats = {}
        // thing to put in URL, bitrate
        let highestQualityAudio = ["", 0]

        for (let i = 0; i < response["formats"].length; i ++) {
            let format = response["formats"][i]
            if ("filesize" in format) {
                // console.log(format)

                let resolution = format["resolution"]
                let filesize = formatBytes(format["filesize"])
                let fileExtension = format["ext"]
                let formatID = format["format_id"]

                if (resolution == "audio only") {
                    resolution = `audio - ${format["abr"]}Kbps`
                    // if it's the highest bitrate we've seen so far, save it to be bundled with the video clips when downloading
                    if (format["abr"] > highestQualityAudio[1]) {
                        highestQualityAudio[0] = `&afID=${formatID}`
                        highestQualityAudio[1] = format["abr"]
                    }
                }
                
                if (! (resolution in availableFormats && availableFormats[resolution]["fileExtension"] == "mp4")) {
                    availableFormats[resolution] = {
                        "filesize": filesize,
                        "fileExtension": fileExtension,
                        "formatID": formatID
                    }
                }
            }
        }

        // sort that bad boy to put audio at the bottom
        const sortedAvailableFormats = {}

        for (const [key, value] of Object.entries(availableFormats)) {
            if (! key.includes("audio")) {
                sortedAvailableFormats[key] = value
            }
        }
        for (const [key, value] of Object.entries(availableFormats)) {
            if (key.includes("audio")) {
                sortedAvailableFormats[key] = value
            }
        }

        for (const [key, value] of Object.entries(sortedAvailableFormats)) {
            const resolution = key
            const filesize = value["filesize"]
            const fileExtension = value["fileExtension"]
            const formatID = value["formatID"]


            let listEntry = document.createElement("div")
                    
            let dLink = document.createElement("a")
            dLink.innerText = `${resolution} - ${fileExtension} - (${filesize})`
            dLink.download = "test.mp4"
            dLink.setAttribute("target", "_blank")
            // if it's audio            
            if (resolution.startsWith("audio")) {
                dLink.href = `${serverPage}/download/${videoID}?afID=${formatID}`
            }
            // if it's video
            else {
                dLink.href = `${serverPage}/download/${videoID}?vfID=${formatID}${highestQualityAudio[0]}`
            }


            listEntry.appendChild(dLink)
            dButtonList.appendChild(listEntry)
        
            dButton.appendChild(dButtonList)
        }
    }

    catch {
        errorMessage = document.createElement("p")
        errorMessage.innerHTML = "sorry, an error occured :(</br>time to slam that f5 key :3"

        dButtonList.appendChild(errorMessage)
        dButton.appendChild(dButtonList)
    }

    removeOfficialDownloadButton()
}

function showList() {
    console.log(dButtonList)
    console.log("clicked")

    if (dButtonList.hidden === true) {
        dButtonList.hidden = false
    } 
    else if (dButtonList.hidden === false) {
        dButtonList.hidden = true
    }
    else {
        console.log("what the FFFFuck?!")
    }
}







// helper functions

// ty stack overflow https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}