from flask import Flask, render_template, request
import bcrypt
import sqlite3

app = Flask(__name__)

 #a get_db_connection function
def get_db_connection():
    connection = sqlite3.connect('carbon.db')
    return connection

@app.route('/signin', methods=['POST'])
def signin():
    connection = get_db_connection()
    cursor = connection.cursor()

    # The rest of your code for handling form submission
    username = request.form['username']
    password = request.form['password']

    cursor.execute("SELECT * FROM signin WHERE username=%s", (username,))
    user = cursor.fetchone()

    if user and user[2] and bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8')):
        return render_template('index.html', username=username)

    return "Invalid username or password."

if __name__ == '__main__':
    app.run(debug=True)


