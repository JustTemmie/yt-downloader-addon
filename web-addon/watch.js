var dButton = null
var dButtonDiv = null
var dButtonList = null

addEventListener("yt-page-data-updated", (event) => {
    if (dButtonDiv == null || dButton == null) {
        addButton()
    }
    updateList(window.location.href)
});

function addButton() {
    console.log("adding button")
    
    let downloadBtnText = document.createElement("span")
    downloadBtnText.textContent = "Download to Disk ▼"
    
    let downloadBtn = document.createElement("button")
    downloadBtn.appendChild(downloadBtnText)
    downloadBtn.className = "yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m"
    downloadBtn.addEventListener("click", showList)
    
    let downloadDiv = document.createElement("div")
    downloadDiv.appendChild(downloadBtn)
    downloadDiv.className = "download-button-YDA style-scope ytd-watch-metadata"

    
    let subscribeDiv = document.getElementById("owner")
    subscribeDiv.appendChild(downloadDiv)
    
    dButton = downloadBtn
    dButtonDiv = downloadDiv
}

function updateList(url) {
    if (dButtonList != null) {
        dButtonList.remove()
        dButtonList = null
    }
    dButtonList = document.createElement("div")
    dButtonList.hidden = true
    dButtonList.className = "YDA_list"

    let entries = [
        ["mp3", `https://loader.to/api/button/?url=${url}&f=mp3`],
        ["mp4", `https://loader.to/api/button/?url=${url}&f=mp4`],
    ]
    
    for (let i = 0; i < entries.length; i ++) {
        let listEntry = document.createElement("div")
        let dLink = document.createElement("a")
        
        console.log(entries)
        console.log(entries[i])
        dLink.innerText = entries[i][0]
        dLink.href = entries[i][1]
        console.log(dLink.innerText)

        listEntry.appendChild(dLink)
        dButtonList.appendChild(listEntry)
    }

    dButton.appendChild(dButtonList)
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
}