from env import DB_QUERY_STRING

def createUserBalance(logger,db_connection,userID:str):
    try:
        cursor=db_connection.cursor()
        cursor.execute(DB_QUERY_STRING)
        
        cursor.execute("""
            INSERT INTO reports_users_balances
            (user_id, score)
            VALUES(%s, 0);

        """,(userID))
        db_connection.commit()
        cursor.close()
    except Exception as err:
        logger.warn(f"Error while creating users {userID} balance: {err}")
        print(err)

def addUserBalance(logger,db_connection,userID:str,action:str):
    try:
        cursor=db_connection.cursor()
        cursor.execute(DB_QUERY_STRING)
        
        cursor.execute("select value from reports_scores_nomenclator where action =upper(%s)",[action])

        VALUE=(cursor.fetchone())[0]

        cursor.execute("""
            update reports_users_balances set balance=balance+%s
            where user_id=%s
        """,[VALUE,userID])

        db_connection.commit()
        cursor.close()
    except Exception as err:
        logger.warn(f"Error while creating users {userID} balance: {err}")
        print(err)
