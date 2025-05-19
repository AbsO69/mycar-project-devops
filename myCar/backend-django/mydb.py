import mysql.connector

database = mysql.connector.connect(
	host = 'localhost',
	user = 'root',
	passwd = 'Admin1!'
	)

cursorObject = database.cursor()

cursorObject.execute("CREATE DATABASE carDB_01")

print("All DONE")