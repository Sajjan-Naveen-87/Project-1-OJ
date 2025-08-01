import os
import socket
import time

# Get DB host and port from environment variables.
# These names MUST match the variables in your .env file.
DB_HOST = os.environ.get('DATABASE_HOST', 'localhost')
DB_PORT = int(os.environ.get('DATABASE_PORT', 3306))
WAIT_TIMEOUT = 60  # seconds

print(f"--- Waiting for database at {DB_HOST}:{DB_PORT}...")

start_time = time.time()
while time.time() - start_time < WAIT_TIMEOUT:
    try:
        with socket.create_connection((DB_HOST, DB_PORT), timeout=5):
            print("--- Database connection successful.")
            exit(0)
    except (socket.timeout, ConnectionRefusedError, OSError) as e:
        print(f"--- Database not yet available (error: {e}), retrying in 5 seconds...")
        time.sleep(5)

print(f"--- Error: Timed out after {WAIT_TIMEOUT} seconds waiting for the database.")
exit(1)