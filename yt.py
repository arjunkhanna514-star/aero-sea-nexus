import re, urllib.request, ssl

def get_yt_id(query):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    url = "https://www.youtube.com/results?search_query=" + query.replace(" ", "+")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        res = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
        ids = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', res)
        for vid in ids:
            return vid
    except:
        return None

print("Cargo:", get_yt_id("cargo ship 4k drone"))
print("Aviation:", get_yt_id("airplane taking off 4k"))
print("Data:", get_yt_id("data center server 4k"))
