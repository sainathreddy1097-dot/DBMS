"""
AutoCare Pro - AI Microservice REST API
Runs on Port 5001 with pure Python standard library HTTP server.
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from predictor import VehicleMaintenancePredictor

predictor = VehicleMaintenancePredictor()

class AIServiceHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        if self.path == '/health' or self.path == '/':
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "status": "UP",
                "service": "AutoCare Pro AI Maintenance Prediction Service",
                "version": "1.0.0"
            }).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

    def do_POST(self):
        if self.path == '/predict':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                predictions = predictor.predict(data)
                self._set_headers(200)
                self.wfile.write(json.dumps({
                    "vehicle": data,
                    "prediction_count": len(predictions),
                    "recommendations": predictions
                }).encode('utf-8'))
            except Exception as e:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

def run(port=5001):
    server_address = ('', port)
    httpd = HTTPServer(server_address, AIServiceHandler)
    print(f"AutoCare Pro AI Service listening on http://localhost:{port}")
    httpd.serve_forever()

if __name__ == '__main__':
    run(5001)
