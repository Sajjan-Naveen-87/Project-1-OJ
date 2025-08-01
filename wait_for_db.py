import os
import socket
import time

# Get DB host and port from environment variables with defaults
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_PORT = int(os.environ.get('DB_PORT', 3306)) # Assuming MySQL/MariaDB default port
WAIT_TIMEOUT = 60  # seconds

print(f"Waiting for database at {DB_HOST}:{DB_PORT}...")

start_time = time.time()
while time.time() - start_time < WAIT_TIMEOUT:
    try:
        # Try to create a connection to the database server
        with socket.create_connection((DB_HOST, DB_PORT), timeout=5):
            print("Database connection successful.")
            exit(0)
    except (socket.timeout, ConnectionRefusedError, OSError):
        print("Database not yet available, retrying in 5 seconds...")
        time.sleep(5)

print(f"Error: Timed out after {WAIT_TIMEOUT} seconds waiting for the database.")
exit(1)