import jwt
import datetime
import random, string

from flask import jsonify,make_response,request
from __main__ import server,db
from env import DB_QUERY_STRING
# import db
from functools import wraps
from dataclasses import dataclass

@dataclass
class User:
    id:str=None
    username:str=None
    email:str=None
    is_su:bool=False


def encode_auth_token( user_id):
    """
    Generates the Auth Token
    :return: string
    """
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1, ),
            'iat': datetime.datetime.utcnow(),
            'sub': user_id
        }
        # print('Token Validation with key',server.config.get('SECRET_KEY'))

        return jwt.encode(
            payload,
            server.config.get('SECRET_KEY'),
            algorithm='HS256'
        )
    except Exception as e:
        return e


def admin_decode_auth_token(auth_token) ->tuple[str,bool]:
    """
    Validates the auth token
    :param auth_token:
    :return: string,bool
    """
    conn=db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    try:
        # print('Token Validation with key',server.config.get('SECRET_KEY'))
        cursor.execute("select user_id,token from admin_users_sessions_blacklisted where token = %s",[auth_token])
        data=cursor.fetchone()
        
        
        if data is not None:
            cursor.close()
            db.releaseConnection(conn)

            return "You login session has been invalidated. Please log in again.",False
        # print(auth_token)
        payload = jwt.decode(auth_token, server.config.get('SECRET_KEY'), algorithms=["HS256"])
        cursor.close()
        db.releaseConnection(conn)
        return payload["sub"],True

    except jwt.ExpiredSignatureError:
        conn.rollback()
        cursor.execute(DB_QUERY_STRING)

        cursor.execute("""insert into admin_users_sessions_blacklisted(user_id,"token")
                        select user_id, "token" from admin_users_sessions where token=%s ;
        """,(auth_token,))

        cursor.execute("""
            delete from admin_users_sessions where token=%s
        """,[auth_token])
        conn.commit()
        cursor.close()
        db.releaseConnection(conn)
        return 'Signature expired. Please log in again.',False
    
    except jwt.InvalidTokenError:
        # db.rollback()
        cursor.execute(DB_QUERY_STRING)

        cursor.execute("""insert into admin_users_sessions_blacklisted(user_id,"token")
                select user_id, "token" from admin_users_sessions where token=%s ;
        """,(auth_token,))

        cursor.execute("""
            delete from admin_users_sessions where token=%s
        """,[auth_token])

        conn.commit()
        cursor.close()
        db.releaseConnection(conn)  
        return 'Invalid token. Please log in again.',False

    

def adminLoginCheck(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        headers = request.headers
        bearer = headers.get('Authorization')
        cookie=request.cookies.get("__open-tickets-sessiontoken")

        if bearer is None and cookie is None:
            print("No cookie specified and no authorization")
            __responseObject = {
                'status': 'forbidden',
                'message': 'Authentication required',
            }
            return makeReturnResponse(__responseObject), 403

        if bearer is not None:
            token = bearer.split()[1]
        else: 
            token = cookie
        
        if token.__len__()==0:
            __responseObject = {
                'status': 'forbidden',
                'message': 'Authentication required',
            }
            return makeReturnResponse(__responseObject), 403

        
        response,validate=admin_decode_auth_token(token)

        if not validate:
            __responseObject = {
                'status': 'forbidden',
                'message': response,
            }
            return makeReturnResponse(__responseObject), 403

        conn=db.getConnection()
        cursor = conn.cursor()
        cursor.execute(DB_QUERY_STRING)

        cursor.execute("SELECT id,is_su,username,email from admin_users WHERE id = %s",[response[0]])
        r=cursor.fetchone()
        request.user=User()
        request.user.id=r[0]
        request.user.is_su=r[1]
        request.user.username=r[2]
        request.user.email=r[3] 
        cursor.close()
        db.releaseConnection(conn)  

        return f(*args, **kwargs)
    return wrap

def makeReturnResponse(responseOBJ:dict):
    return make_response(jsonify(responseOBJ))


def superUserCheck(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        
        if not request.user.is_su :
            __responseObject = {
                'status': 'forbidden',
                'message': 'You need to be superuser in order to access this content.',
            }
            return makeReturnResponse(__responseObject), 403

        
       

        return f(*args, **kwargs)
    return wrap

def genTicketCode(length:int=10):
    letters = string.ascii_lowercase
    return 'TGS'+''.join(random.choice(letters) for _ in range(length))


def addInboxMessageForDepartment(conn,subject,department_id):
    cursor=conn.cursor()

    cursor.execute("""
    select user_id from admin_departments_members where department_id=%s
    """,[department_id])

    buffer=0
    for i in cursor.fetchall():
        userID=i[0]
        currDate=datetime.datetime.now()
        cursor.execute("""
            insert into admin_users_inbox ( user_id, message, created_at, viewed, state)
            values (%s,%s,%s,false,'INFO');
        """,(userID,subject,currDate))
        if buffer%10==0:
            conn.commit()
        buffer+=1
        
    conn.commit()


def addInboxMessageForUser(conn,subject,user_id):
    cursor=conn.cursor()
    currDate=datetime.datetime.now()
    cursor.execute("""
        insert into admin_users_inbox ( user_id, message, created_at, viewed, state)
        values (%s,%s,%s,false,'INFO');
    """,(user_id,subject,currDate))
        
    conn.commit()
