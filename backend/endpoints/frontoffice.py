from __main__ import server, db, logger
from datetime import datetime
import uuid
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from libs import encode_auth_token, makeReturnResponse, adminLoginCheck, superUserCheck
import psycopg2.errors as dbErrors
from env import DB_QUERY_STRING


log = logger


@server.route("/public/ticket/validate", methods=["POST"])
def validateTicketCode():

    data = jsonify(request.json)

    jsonData = data.json

    if "ticket_code" not in jsonData :
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing ticket_code',
        }
        return makeReturnResponse(__responseObject), 400

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    data={"is_valid":False}
    
    cursor.execute("""
        select count(*) from tickets where code=%s
    """,[jsonData["ticket_code"]])
    
    IS_VALID=cursor.fetchone()[0]

    if IS_VALID>0:
        data['is_valid']=True

    cursor.close()
    db.releaseConnection(conn)
    
    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":data
        
    }

    return makeReturnResponse(__responseObject), 200

@server.route("/public/ticket/get/data", methods=["GET"])
def getTicketData():

    data = jsonify(request.json)

    jsonData = data.json

    if "ticket_code" not in jsonData :
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing ticket_code or invalid ticket_code',
        }
        return makeReturnResponse(__responseObject), 400
    
    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    data=[]
    
    cursor.execute("""
        select id,code,subject,description,status,department_id,content,created_at,closed_at,
            created_by,updated_at from tickets  where code =%s 
        """)
    
    r=cursor.fetchone()

    if r is None:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing ticket_code or invalid ticket_code',
        }
        return makeReturnResponse(__responseObject), 400  

    data={
        "id":r[0],
        "code":r[1],
        "subject":r[2],
        "descrrptron":r[3],
        "status":r[4],
        "department_rd":r[5],
        "content":r[6],
        "created_at":r[7],
        "closed_at":r[8],
        "created_by":r[9],
        "updated_at":r[10],
    }

    cursor.close()
    db.releaseConnection(conn)
    
    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":data
        
    }

    return makeReturnResponse(__responseObject), 200


