import datetime
from __main__ import db
class Logger:
    def __init__(self):
        
        self.connection = db.getConnection()

    def info(self,message):
        self.__doLog(message,"INFO")

    def warn(self,message):
        self.__doLog(message,"WARNING")


    def error(self,message):
        self.__doLog(message,"ERROR")

    
    def debug(self,message):
        self.__doLog(message,"DEBUG")

    def __doLog(self,message:str,status:str):
        self.cursor= self.connection.cursor()
        self.cursor.execute("SET search_path TO tickets")
        insertDateTime=datetime.datetime.now()
        self.cursor.execute("""
         INSERT INTO logs (message, status, created_at) VALUES(%s, %s, %s);
        """,(message,status.upper(),insertDateTime))
        self.connection.commit()
        self.cursor.close()        
        print(f"{insertDateTime} :: {status.upper()} - {message} ")


    def __del__(self):
        db.releaseConnection(self.connection)
        # self.cursor.close()