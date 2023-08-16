var dButton = null
var dButtonDiv = null
var dButtonList = null

addEventListener("yt-page-data-updated", (event) => {
    if (dButtonDiv == null || dButton == null) {
        addButton()
    }
    // call the updateList (async) function outside of an async function
    (async () => {
        await updateList(window.location.href)
    })();

});

function addButton() {
    console.log("adding button")
    
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
    if (dButtonList != null) {
        dButtonList.remove()
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

        console.log(response)
        console.log(response["formats"].length)

        recreateDButtonList()

        for (let i = 0; i < response["formats"].length; i ++) {
            let format = response["formats"][i]
            if ("filesize" in format) {
                console.log(format)

                let resolution = format["resolution"]

                let listEntry = document.createElement("div")
                
                let dLink = document.createElement("a")
                dLink.innerText = resolution
        
                listEntry.appendChild(dLink)
                dButtonList.appendChild(listEntry)
            }
        }
    
        dButton.appendChild(dButtonList)
    }

    catch {
        let errorMessage = document.createElement("p")
        errorMessage.textContent = "sorry, an error occured :("

        dButtonList.appendChild(errorMessage)
        dButton.appendChild(dButtonList)
    }
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