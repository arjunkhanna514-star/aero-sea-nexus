import urllib.request
import ssl
import os

def download_file(url, filename):
    print(f"Downloading {filename}...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    
    try:
        with urllib.request.urlopen(req, context=ctx) as r, open(filename, 'wb') as f:
            f.write(r.read())
        print(f"Success: {filename}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

if __name__ == '__main__':
    videos = {
        "bg-cargo.mp4": "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-cargo-ship-in-the-ocean-10022-large.mp4",
        "video-maritime.mp4": "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-cargo-ship-in-the-ocean-10022-large.mp4",
        "video-aviation.mp4": "https://assets.mixkit.co/videos/preview/mixkit-airplane-taking-off-in-the-sun-27988-large.mp4",
        "video-data.mp4": "https://assets.mixkit.co/videos/preview/mixkit-data-center-server-racks-with-flashing-lights-29433-large.mp4"
    }
    
    for filename, url in videos.items():
        download_file(url, filename)
