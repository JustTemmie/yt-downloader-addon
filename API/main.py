from flask import Flask, request, jsonify, send_file, redirect

import yt_dlp
import random

import helper.config as configLib

app = Flask(__name__)

# @app.route("/")
# def root():
#     return "Root directory"

@app.route("/info/<video_id>")
def info(video_id):
    
    ydl_opts = {
        'format': 'bestvideo',  # We'll filter resolutions later
        'quiet': True,     # Don't display output in the terminal
        'force_generic_extractor': True,  # Use generic extractor
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=False)
        
    return info

@app.route("/download/<video_id>")
def download_video(video_id):
    # unused rn
    # authenticationToken = request.args.get("token")
    
    sessionID = str(random.randint(0, 999999))
    
    videoFormatID = request.args.get("vfID")
    audioFormatID = request.args.get("afID")
    # if video
    if audioFormatID != None and videoFormatID == None:
        videoID = audioFormatID
    # if audio
    elif audioFormatID == None and videoFormatID != None:
        videoID = f"{videoFormatID}+bestaudio"
    # if audio and video
    elif audioFormatID != None and videoFormatID != None:
        videoID = f"{videoFormatID}+{audioFormatID}"
    # if neither
    elif audioFormatID == None and videoFormatID == None:
        return "invalid request"
    else:
        return "what the fuck did you just do??"
    
    global fileLocation
    fileLocation = ""
    
    def yt_dlp_monitor(d):
        global fileLocation
        fileLocation = d.get('info_dict').get('_filename')
    
    ydl_opts = {
        "format": videoID,
        "outtmpl": f"temp/%(title)s.id={sessionID}&format={videoID}.%(ext)s",
        "progress_hooks": [yt_dlp_monitor]
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download(f"https://www.youtube.com/watch?v={video_id}")
            
    print("---------------------")
    return send_file(fileLocation, as_attachment=True)
    
    
    # file = read_image(pid)
    # response = make_response(image_binary)
    # response.headers.set('Content-Type', 'image/jpeg')
    # response.headers.set(
    #     'Content-Disposition', 'attachment', filename='%s.jpg' % pid)
    # return response
    
    return f"file is located at `{fileLocation}`"

if __name__ == "__main__":
    with open ("config.json", "r") as f:
        config = configLib.get_config(f)
    
    app.run(
        host=config["HOST"],
        port=config["PORT"],
        debug=config["DEBUG"]
    )