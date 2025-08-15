import http.server
import socketserver
import os

PORT = 8000
DIRECTORY = os.getcwd() # Serve from the current working directory

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

# Change the current working directory to the directory of the script
# This ensures that relative paths in HTML (like details-v2/) are resolved correctly
os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"serving at port {PORT}")
    httpd.serve_forever()
