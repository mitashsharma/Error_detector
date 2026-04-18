from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os
from detector import detect_errors

app = Flask(__name__)
CORS(app)

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'support.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Support Ticket Model
class SupportTicket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "message": self.message,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }

# Initialize database
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/detect', methods=['POST'])
def detect():
    data = request.json
    code = data.get('code', '')
    language = data.get('language', 'python')
    
    if not code:
        return jsonify({"status": "error", "message": "No code provided"}), 400
    
    result = detect_errors(code, language)
    return jsonify(result)

@app.route('/api/support', methods=['POST'])
def create_ticket():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    
    if not all([name, email, message]):
        return jsonify({"status": "error", "message": "Missing required fields"}), 400
    
    new_ticket = SupportTicket(name=name, email=email, message=message)
    db.session.add(new_ticket)
    db.session.commit()
    
    return jsonify({"status": "success", "message": "Support ticket submitted successfully!"})

@app.route('/api/tickets', methods=['GET'])
def get_tickets():
    tickets = SupportTicket.query.order_by(SupportTicket.created_at.desc()).all()
    return jsonify([ticket.to_dict() for ticket in tickets])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
