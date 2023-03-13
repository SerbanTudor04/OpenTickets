import psycopg2
from psycopg2 import pool
from env import dbCfg


class Database:
    def __init__(self):
        self.connection = psycopg2.pool.ThreadedConnectionPool(
            1, 20, host=dbCfg.host, database=dbCfg.database, user=dbCfg.username, password=dbCfg.password)
        if self.connection:
            print("Connecting to database has been successfuly completed!")

    def getConnection(self):
        return self.connection.getconn()

    def releaseConnection(self, conn):
        self.connection.putconn(conn)