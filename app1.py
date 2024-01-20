from flask import Flask, redirect, render_template, request
import sqlite3
import bcrypt
app1 = Flask(__name__)

def get_db_connection():
    connection = sqlite3.connect('carbon.db')
    return connection
@app1.route('/signup', methods=['POST'])
def signup():
    connection = get_db_connection()
    cursor = connection.cursor()
    
    username = request.form['username']
    email = request.form['email']
    location = request.form['location']
    phone = request.form['phone']
    password = request.form['password']
    
    confirm_password = request.form['confirm_password']

    if password != confirm_password:
        return "Passwords and Confirm Password do not match."

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    cursor.execute("INSERT INTO signin (username, password,email,location,phone) VALUES (%s, %s,%s,%s,%d)", (username, hashed_password,email,location,phone))
    connection.commit()
    return redirect('/signin')