import datetime
from __main__ import db
from env import DB_QUERY_STRING

class Logger:
    def __init__(self):pass

    def info(self, message):
        self.__doLog(message, "INFO")

    def warn(self, message):
        self.__doLog(message, "WARNING")

    def error(self, message):
        self.__doLog(message, "ERROR")

    def debug(self, message):
        self.__doLog(message, "DEBUG")

    def __doLog(self, message: str, status: str):
        self.connection = db.getConnection()
        self.cursor = self.connection.cursor()
        self.cursor.execute(DB_QUERY_STRING)
        insertDateTime = datetime.datetime.now()
        self.cursor.execute("""
         INSERT INTO logs (message, status, created_at) VALUES(%s, %s, %s);
        """, (message, status.upper(), insertDateTime))
        self.connection.commit()
        self.cursor.close()
        db.releaseConnection(self.connection)
        print(f"{insertDateTime} :: {status.upper()} - {message} ")

    def __del__(self):
        db.releaseConnection(self.connection)
        # self.cursor.close()
