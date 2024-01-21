from flask import Flask, render_template, request, redirect

import mysql.connector
import base64
import bcrypt

app = Flask(__name__)

# Database connection
db_config = {
    "host": "localhost",
    "user": "shanky",
    "password": "$hanky009",
    "database": "carbon"
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.route('/')
def index():
    return render_template('choice.html')

@app.route('/index')
def next_page():
    return render_template('signup.html')

@app.route('/signin')
def sig():
    return render_template('signin.html')


# signup
@app.route('/signup', methods=['POST'])
def signup():
    connection = get_db_connection()
    cursor = connection.cursor()
    username = request.form['username']
    password = request.form['password']
    confirm_password = request.form['confirm_password']

    if password != confirm_password:
        return "Password and Confirm Password do not match."

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    cursor.execute("INSERT INTO signin1 (username, password) VALUES (%s, %s)", (username, hashed_password))
    connection.commit()
    return redirect('/signin')

#signin
@app.route('/signin', methods=['POST'])
def signin():
    connection = get_db_connection()
    cursor = connection.cursor()
    render_template('signin.html')
    username = request.form['username']
    password = request.form['password']

    cursor.execute("SELECT * FROM signin1 WHERE username=%s", (username,))
    user = cursor.fetchone()

    if user and user[2] and bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8')):
        return render_template('main1.html',username=username)

    return "Invalid username or password."



if __name__ == '__main__':
    app.run(debug=True)