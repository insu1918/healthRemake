import mysql.connector
from mysql.connector import Error

def create_database():
    try:
        # Connect to MySQL server (no specific database yet)
        connection = mysql.connector.connect(
            host='127.0.0.1',
            user='root',
            password='1234'
        )
        if connection.is_connected():
            cursor = connection.cursor()
            # Create database if it doesn't exist
            cursor.execute("CREATE DATABASE IF NOT EXISTS aiProject1")
            print("Database 'aiProject1' created or already exists.")
            
            # Switch to the database
            connection.database = 'aiProject1'
            
            # Read and execute schema.sql
            with open('schema.sql', 'r', encoding='utf-8') as f:
                schema_sql = f.read()
                
            # Split commands by semicolon (simple parsing)
            # Note: This is a basic split and might fail on complex stored procedures but serves this schema well
            commands = schema_sql.split(';')
            
            for command in commands:
                if command.strip():
                    try:
                        cursor.execute(command)
                    except Error as e:
                        print(f"Error executing command: {e}")
            
            print("Schema executed successfully.")
            connection.commit()
            
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    create_database()
