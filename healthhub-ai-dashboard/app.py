from flask import Flask, jsonify, request
from flask_cors import CORS
from db import get_db_connection
from mysql.connector import Error

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return "HealthHub AI Dashboard API is running!"

@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        # Exclude password from result
        cursor.execute("SELECT id, email, name, height, target_weight, goal, age, gender, created_at FROM users")
        users = cursor.fetchall()
        return jsonify(users)
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        # In production, use hashed passwords (e.g., bcrypt)!
        cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
        user = cursor.fetchone()

        if user:
            # Remove password before sending back
            del user['password']
            return jsonify(user)
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    required_fields = ['email', 'password', 'name', 'height', 'target_weight', 'goal', 'age', 'gender']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        
        # Check if email exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (data['email'],))
        if cursor.fetchone():
             return jsonify({"error": "Email already registered"}), 409

        sql = """INSERT INTO users (email, password, name, height, target_weight, goal, age, gender) 
                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
        values = (
            data['email'], 
            data['password'], # Note: Storing plain text as requested for simplicity. Use hashing in real apps.
            data['name'], 
            data['height'], 
            data['target_weight'], 
            data['goal'], 
            data['age'], 
            data['gender']
        )
        cursor.execute(sql, values)
        conn.commit()
        
        return jsonify({"message": "User registered successfully"}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/api/weight/<int:user_id>', methods=['GET'])
def get_weight_records(user_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
        
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM weight_records WHERE user_id = %s ORDER BY date DESC", (user_id,))
        records = cursor.fetchall()
        return jsonify(records)
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/api/health/<int:user_id>', methods=['GET'])
def get_health_metrics(user_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
        
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM health_metrics WHERE user_id = %s ORDER BY date DESC", (user_id,))
        metrics = cursor.fetchall()
        return jsonify(metrics)
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        # Check if user exists
        cursor.execute("SELECT id FROM users WHERE id = %s", (user_id,))
        if not cursor.fetchone():
             return jsonify({"error": "User not found"}), 404

        # Dynamic update query
        fields = []
        values = []
        allowed_fields = ['name', 'height', 'target_weight', 'goal', 'age', 'gender']
        
        for field in allowed_fields:
            if field in data:
                fields.append(f"{field} = %s")
                values.append(data[field])
        
        if not fields:
            return jsonify({"message": "No fields to update"}), 200

        values.append(user_id)
        sql = f"UPDATE users SET {', '.join(fields)} WHERE id = %s"
        
        cursor.execute(sql, tuple(values))
        conn.commit()
        
        # Return updated user
        cursor.execute("SELECT id, email, name, height, target_weight, goal, age, gender FROM users WHERE id = %s", (user_id,))
        updated_user = cursor.fetchone()
        
        return jsonify(updated_user)
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/api/weight', methods=['POST'])
def add_weight_record():
    data = request.json
    required_fields = ['user_id', 'date', 'weight', 'bmi']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        sql = """INSERT INTO weight_records (id, user_id, date, weight, height, bmi, memo) 
                 VALUES (%s, %s, %s, %s, %s, %s, %s)"""
        values = (
            data.get('id'), # Assuming ID is generated by frontend or we can generate it here
            data['user_id'],
            data['date'],
            data['weight'],
            data.get('height'),
            data['bmi'],
            data.get('memo')
        )
        cursor.execute(sql, values)
        conn.commit()
        return jsonify({"message": "Weight record added"}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/api/workouts', methods=['POST'])
def add_workout_record():
    data = request.json
    required_fields = ['user_id', 'date', 'category', 'type', 'intensity', 'duration', 'met', 'calories', 'title']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        sql = """INSERT INTO workout_records (id, user_id, date, category, type, intensity, duration, met, calories, completed, title, memo) 
                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
        values = (
            data.get('id'),
            data['user_id'],
            data['date'],
            data['category'],
            data['type'],
            data['intensity'],
            data['duration'],
            data['met'],
            data['calories'],
            data.get('completed', False),
            data['title'],
            data.get('memo')
        )
        cursor.execute(sql, values)
        conn.commit()
        return jsonify({"message": "Workout record added"}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/api/health', methods=['POST'])
def add_health_metric():
    data = request.json
    required_fields = ['user_id', 'date', 'systolic', 'diastolic', 'blood_sugar', 'sleep_hours']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        sql = """INSERT INTO health_metrics (user_id, date, systolic, diastolic, blood_sugar, sleep_hours) 
                 VALUES (%s, %s, %s, %s, %s, %s)"""
        values = (
            data['user_id'],
            data['date'],
            data['systolic'],
            data['diastolic'],
            data['blood_sugar'],
            data['sleep_hours']
        )
        cursor.execute(sql, values)
        conn.commit()
        return jsonify({"message": "Health metric added"}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
