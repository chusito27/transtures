
import http.server
import socketserver
import json
from orchestrator.orchestrator import OrchestratorAgent

PORT = 8000

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/command':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            command = data['command']
            
            orchestrator = OrchestratorAgent()
            result = orchestrator.handle_command(command)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'result': result}).encode())
        else:
            super().do_GET()

    def do_GET(self):
        if self.path == '/':
            self.path = '/ui/index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
