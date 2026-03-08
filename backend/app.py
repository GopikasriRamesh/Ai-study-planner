from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from utils import calculate_plan

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///study_plans.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- Database Model ---
class StudyPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    total_hours = db.Column(db.Integer)
    total_days = db.Column(db.Integer)
    # Storing the result as a string/JSON for simplicity in this version
    plan_data = db.Column(db.JSON) 

# Initialize the database
with app.app_context():
    db.create_all()

# --- API Routes ---

@app.route('/api/generate-plan', methods=['POST'])
def generate():
    data = request.json
    hours = int(data.get('hours'))
    days = int(data.get('days'))
    subjects = data.get('subjects')
    
    # Run our algorithm from utils.py
    result = calculate_plan(hours, days, subjects)
    
    # Save to Database
    new_plan = StudyPlan(
        total_hours=hours, 
        total_days=days, 
        plan_data=result
    )
    db.session.add(new_plan)
    db.session.commit()
    
    return jsonify(result)

@app.route('/api/history', methods=['GET'])
def get_history():
    plans = StudyPlan.query.order_by(StudyPlan.created_at.desc()).all()
    output = []
    for p in plans:
        output.append({
            "id": p.id,
            "date": p.created_at.strftime("%Y-%m-%d %H:%M"),
            "plan": p.plan_data
        })
    return jsonify(output)

if __name__ == '__main__':
    app.run(debug=True, port=5000)