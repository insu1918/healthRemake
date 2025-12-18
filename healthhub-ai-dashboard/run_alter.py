from db import get_db_connection
import mysql.connector

def update_schema():
    conn = get_db_connection()
    if not conn:
        print("Failed to connect to database.")
        return

    try:
        cursor = conn.cursor()
        print("Attempting to add 'password' column...")
        cursor.execute("ALTER TABLE `users` ADD COLUMN `password` VARCHAR(255) NOT NULL DEFAULT '1234' AFTER `email`")
        conn.commit()
        print("Success: 'password' column added.")
    except mysql.connector.Error as err:
        if err.errno == 1060: # Duplicate column name
            print("Notice: 'password' column already exists. No changes made.")
        else:
            print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    update_schema()
