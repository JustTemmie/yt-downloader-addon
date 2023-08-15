from flask import Flask, request, jsonify
import yt_dlp

app = Flask(__name__)

@app.route("/")
def root():
    return "Root directory"

@app.route("/video-info/<video_id>")
def info(video_id):
    
    ydl_opts = {
        'format': 'bestvideo',  # We'll filter resolutions later
        'quiet': True,     # Don't display output
        'force_generic_extractor': True,  # Use generic extractor
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=False)
        
    return info

if __name__ == "__main__":
    app.run(debug=True)