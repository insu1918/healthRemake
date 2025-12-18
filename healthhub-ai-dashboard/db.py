import mysql.connector
from mysql.connector import Error

def get_db_connection():
    """Establishes and returns a connection to the database."""
    connection = None
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='123',
            database='test'
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return None

if __name__ == "__main__":
    # Test the connection
    conn = get_db_connection()
    if conn and conn.is_connected():
        print("Successfully connected to the database 'aiProject' as 'root'!")
        conn.close()
    else:
        print("Failed to connect.")
