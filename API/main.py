from flask import Flask, request, jsonify
import yt_dlp

import helper.config as configLib

app = Flask(__name__)

# @app.route("/")
# def root():
#     return "Root directory"

@app.route("/video-info/<video_id>")
def info(video_id):
    
    ydl_opts = {
        'format': 'bestvideo',  # We'll filter resolutions later
        'quiet': True,     # Don't display output in the terminal
        'force_generic_extractor': True,  # Use generic extractor
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=False)
        
    return info


if __name__ == "__main__":
    with open ("config.json", "r") as f:
        config = configLib.get_config(f)
    
    if config["SSL"]["HTTPS_enabled"] == False:
        app.run(
            host=config["HOST"],
            port=config["PORT"],
            debug=config["DEBUG"]
        )
    
    else:
        app.run(
            host=config["HOST"],
            port=config["PORT"],
            debug=config["DEBUG"],
            ssl_context=(
                config["SSL"]["cert_path"],
                config["SSL"]["key_path"]
            )
        )