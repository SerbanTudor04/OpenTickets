from __main__ import server, db, logger
from datetime import datetime
import uuid
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from libs import encode_auth_token, makeReturnResponse, adminLoginCheck, superUserCheck
import psycopg2.errors as dbErrors
from env import DB_QUERY_STRING


log = logger


@server.route("/public/getTicket", methods=["POST"])
@adminLoginCheck
def getTicket():
    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    data={
        
    }

    
    cursor.close()
    db.releaseConnection(conn)
    
    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":data
        
    }

    return makeReturnResponse(__responseObject), 200