import psycopg2
from psycopg2 import pool
from env import dbCfg

class Database:
    def __init__(self):
        self.connection = psycopg2.pool.ThreadedConnectionPool(1,20,host=dbCfg.host,database=dbCfg.database,user=dbCfg.username,password=dbCfg.password)
        if self.connection:
            print("Connecting to database has been successfuly completed!")


    def getConnection(self):
        return self.connection.getconn()

    def releaseConnection(self,conn):
        self.connection.putconn(conn)


    # def __del__(self):
        # if self.connection:
            # print("closing all db connections")
            # self.connection.closeall()

# dbConnection = psycopg2.connect(host="10.10.110.11",database="tgsapps",user='tgsaccounts',password='tgsaccounts')
# if dbConnection is None:
#     raise psycopg2.DatabaseError("Could not connect to database")
# cursor = dbConnection.cursor()
