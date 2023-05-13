from __main__ import server, db, logger
from datetime import datetime
import uuid
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from libs import encode_auth_token, makeReturnResponse, adminLoginCheck, superUserCheck,validateRequestsFields,assignQueryToFields
import psycopg2.errors as dbErrors
from env import DB_QUERY_STRING
from functions import scoreManagement as scMGM

log = logger


@server.route("/admin/create_user", methods=['POST'])
@adminLoginCheck
@superUserCheck
def create_user():

    data = jsonify(request.json)

    jsonData = data.json

    if "username" not in jsonData or "password" not in jsonData or "email" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing username, password or email',
        }
        return makeReturnResponse(__responseObject), 400

    first_name = ""
    if "first_name" in jsonData:
        first_name = jsonData["first_name"]

    last_name = ""
    if "last_name" in jsonData:
        last_name = jsonData["last_name"]

    is_su = False
    if "is_su" in jsonData and jsonData["is_su"] is not None:
        is_su = jsonData["is_su"]

    userData = {
        "id": str(uuid.uuid4()),
        "username": jsonData["username"],
        "password": generate_password_hash(jsonData["password"]),
        "email": jsonData["email"],
        "first_name": first_name,
        "last_name": last_name,
        "is_su": is_su
    }

    log.info(
        f"User {request.user.id} is creating a new account with username {userData['username']}.")

    conn = db.getConnection()
    cursor = conn.cursor()
    try:
        cursor.execute(DB_QUERY_STRING)

        cursor.execute(f"""
        INSERT INTO admin_users
        (id, username, "password", email, first_name, last_name, created_at, updated_at, is_su)
        VALUES(%s, %s, %s, %s, %s, %s, now(), now(), %s)
    """, (userData["id"], userData["username"], userData["password"], userData["email"], userData["first_name"], userData["last_name"], userData["is_su"]))

        conn.commit()

        if "department_id" in jsonData:

            cursor.execute("""
            insert into admin_departments_members (department_id, user_id, created_at)
        values (%s,%s,now());
            """, (jsonData["department_id"], userData["id"]))

            conn.commit()
    except dbErrors.UniqueViolation as err:
        responseObject = {
            'status': 'invalid',
            'message': 'A user already exits with this username.',

        }
        cursor.close()
        db.releaseConnection(conn)
        return makeReturnResponse(responseObject), 400

    cursor.close()

    
    scMGM.createUserBalance(log,conn,userData["id"])
    db.releaseConnection(conn)

    log.info(
        f"User {request.user.id} has created user {userData['username']}.")

    return makeReturnResponse({"status": "success", "message": "User created successfully!", "data": userData}), 200


@server.route("/admin/updateUser", methods=['POST'])
@adminLoginCheck
@superUserCheck
def updateUser():

    data = jsonify(request.json)

    jsonData = data.json
    # print(jsonData)

    if "id" not in jsonData or "username" not in jsonData or "password" not in jsonData or "email" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing id,username, password or email',
        }
        return makeReturnResponse(__responseObject), 400

    first_name = ""
    if "first_name" in jsonData:
        first_name = jsonData["first_name"]

    last_name = ""
    if "last_name" in jsonData:
        last_name = jsonData["last_name"]

    is_su = False
    if "is_su" in jsonData and jsonData["is_su"] is not None:
        is_su = jsonData["is_su"]

    userData = {
        "id": jsonData["id"],
        "username": jsonData["username"],
        "password": generate_password_hash(jsonData["password"]),
        "email": jsonData["email"],
        "first_name": first_name,
        "last_name": last_name,
        "is_su": is_su
    }

    log.info(
        f"User {request.user.id} has updated the account {userData['id']}.")

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)
    cursor.execute(f"""
        update admin_users
        set username=%s, "password"=%s, email=%s, updated_at=now(), is_su=%s
        where id=%s
    """, [userData["username"], userData["password"], userData["email"],  userData["is_su"], userData["id"]])

    if "department_id" in jsonData:

        cursor.execute("""
            insert into admin_departments_members (department_id, user_id, created_at)
            values (%s,%s,now()) on conflict (user_id) do update set department_id=%s;
            """, (jsonData["department_id"], userData["id"], jsonData["department_id"]))

    conn.commit()
    cursor.close()
    db.releaseConnection(conn)

    log.info(
        f"User {request.user.id} has created user {userData['username']}.")

    return makeReturnResponse({"status": "success", "message": "User created successfully!"}), 200


@server.route("/admin/deleteUser", methods=['POST'])
@adminLoginCheck
@superUserCheck
def deleteUser():

    data = jsonify(request.json)

    jsonData = data.json
    # print(jsonData)

    if "id" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing id',
        }
        return makeReturnResponse(__responseObject), 400

    log.info(f"User {request.user.id} is deleting account {jsonData['id']}.")

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)
    cursor.execute("""
        delete from admin_users where id=%s;
    """, [jsonData['id']])

    cursor.execute("""
        delete from  admin_departments_members where user_id=%s;
        """,  [jsonData['id']])

    conn.commit()
    cursor.close()
    db.releaseConnection(conn)

    log.info(f"User {request.user.id} has deleted account {jsonData['id']}.")

    return makeReturnResponse({"status": "success", "message": "User created successfully!"}), 200


@server.route("/admin/login_user", methods=["POST"])
def login_user():
    data = jsonify(request.json)
    jsonData = data.json

    if "email" not in jsonData and "password" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing email or password',
        }
        return makeReturnResponse(__responseObject), 400

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    cursor.execute("SELECT id,password FROM admin_users where email = %s", [
                   jsonData["email"]])
    retData = cursor.fetchone()

    if retData is None:
        __responseObject = {
            'status': 'forbidden',
            'message': 'Password or email is invalid',
        }
        conn.commit()
        cursor.close()
        db.releaseConnection(conn)

        return makeReturnResponse(__responseObject), 403

    userID = retData[0],
    userPassword = retData[1]

    if not check_password_hash(userPassword, jsonData["password"]):
        __responseObject = {
            'status': 'forbidden',
            'message': 'Password or email is invalid',
        }
        conn.commit()
        cursor.close()
        db.releaseConnection(conn)
        return makeReturnResponse(__responseObject), 403

    userToken = encode_auth_token(userID)
    try:
        cursor.execute("""INSERT INTO admin_users_sessions
                    (user_id, "token")
                    VALUES(%s, %s);
                    """, (userID, userToken))

    except dbErrors.UniqueViolation as err:
        conn.rollback()
        cursor.execute(DB_QUERY_STRING)

        log.warn(f"Invalidating all sessions for user {userID}.")

        cursor.execute("""insert into admin_users_sessions_blacklisted(user_id,"token")
	            select user_id, "token" from admin_users_sessions where user_id=%s ;
        """, (userID,))

        log.info(f"Update user {userID[0]} session to the latest token .")

        cursor.execute(
            """update admin_users_sessions set token=%s where user_id=%s""", (userToken, userID))

    conn.commit()
    cursor.close()
    db.releaseConnection(conn)

    log.info(f"User {userID[0]} has been logged in successfully!")

    responseObject = {
        'status': 'success',
        'message': 'Successfully logged in.',
        'auth_token': userToken
    }

    return makeReturnResponse(responseObject), 200


@server.route("/admin/create_department", methods=["POST"])
@adminLoginCheck
def create_department():

    data = jsonify(request.json)
    jsonData = data.json

    if "name" not in jsonData and "description" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing name or description',
        }

        return makeReturnResponse(__responseObject), 400

    conn = db.getConnection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO tickets.admin_departments
        ("name", created_at, updated_at, description)
        VALUES(%s, now(), now(), %s)
        """, (jsonData["name"], jsonData["description"]))
        conn.commit()

    except dbErrors.UniqueViolation:
        cursor.close()
        db.releaseConnection(conn)
        __responseObject = {
            'status': 'invalid',
            'message': f'The department {jsonData["name"]} already exists.',
        }
        log.warn(
            f"User {request.user.id} tried to create a department {jsonData['name']} which already exists!")

        return makeReturnResponse(__responseObject), 400

    cursor.close()
    db.releaseConnection(conn)

    log.info(
        f"User {request.user.id} has created department {jsonData['name']}!")

    return makeReturnResponse({"status": "success", "message": f"Department {jsonData['name']} created successfully!"}), 200


@server.route("/admin/check_auth", methods=["POST", "GET"])
@adminLoginCheck
def check_auth():
    return makeReturnResponse({"status": "success", "message": f"Ok"}), 200


@server.route("/admin/info_user", methods=["GET"])
@adminLoginCheck
def info_user():
    conn = db.getConnection()
    cursor = conn.cursor()

    cursor.execute(DB_QUERY_STRING)

    cursor.execute("select id,username, email,first_name ,last_name,is_su from admin_users where id =  %s", [
                   request.user.id])

    data = cursor.fetchone()

    __responseObject = {
        'status': 'success',
        'message': f'Data obtained with success!',
        'data': {
            "id": data[0],
            "username": data[1],
            "email": data[2],
            "first_name": data[3],
            "last_name": data[4],
            "is_su": data[5]
        }
    }
    cursor.close()
    db.releaseConnection(conn)
    return makeReturnResponse(__responseObject), 200


@server.route("/admin/singout_user", methods=["GET"])
@adminLoginCheck
def signout_user():
    conn = db.getConnection()
    cursor = conn.cursor()

    cursor.execute(DB_QUERY_STRING)

    log.warn(f"Invalidating all sessions for user {request.user.id}.")

    cursor.execute("""insert into admin_users_sessions_blacklisted(user_id,"token")
            select user_id, "token" from admin_users_sessions where user_id=%s ;
    """, (request.user.id,))

    cursor.close()
    db.releaseConnection(conn)
    return makeReturnResponse({}), 200


@server.route("/admin/get_user_inbox_number", methods=["GET"])
@adminLoginCheck
def get_user_inbox_number():
    conn = db.getConnection()
    cursor = conn.cursor()

    cursor.execute(DB_QUERY_STRING)

    cursor.execute(
        "SELECT count(*) viewed FROM admin_users_inbox where user_id = %s  and viewed=false", [request.user.id])

    data = cursor.fetchone()

    __responseObject = {
        'status': 'success',
        'message': f'Data obtained with success!',
        'data': {
            "inbox_counter": data[0]
        }
    }
    cursor.close()
    db.releaseConnection(conn)
    return makeReturnResponse(__responseObject), 200


@server.route("/admin/get_user_inbox_messages", methods=["GET"])
@adminLoginCheck
def get_user_inbox_messages():

    conn = db.getConnection()
    cursor = conn.cursor()

    cursor.execute(DB_QUERY_STRING)

    cursor.execute("select id,user_id,message,created_at,viewed,state from admin_users_inbox where user_id = %s and viewed=false;", [
                   request.user.id])

    rawdata = cursor.fetchall()
    data = []
    for i in rawdata:
        __insert_data = {
            "id": i[0],
            "user_id": i[1],
            "message": i[2],
            "created_at": i[3],
            "viewed": i[4],
            "state": i[5],
        }
        data.append(__insert_data)
    __responseObject = {
        'status': 'success',
        'message': f'Data obtained with successfuly!',
        'data': data
    }

    cursor.close()
    db.releaseConnection(conn)
    return makeReturnResponse(__responseObject), 200


@server.route("/admin/markMessageAsViewed", methods=["POST"])
@adminLoginCheck
def markMessageAsViewed():
    data = jsonify(request.json)
    jsonData = data.json

    if "id" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing id ',
        }
        return makeReturnResponse(__responseObject), 400

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)
    cursor.execute("update  admin_users_inbox set viewed=true where user_id = %s and id=%s;", [
                   request.user.id, jsonData["id"]])

    conn.commit()
    cursor.close()
    db.releaseConnection(conn)
    __responseObject = {
        'status': 'success',
        'message': 'OK',
    }
    return makeReturnResponse(__responseObject), 200


@server.route("/admin/isSuperUser_user", methods=["GET"])
@adminLoginCheck
def isSuperUser_user():

    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data": {
            "is_su": request.user.is_su
        }
    }

    return makeReturnResponse(__responseObject), 200


@server.route("/admin/getUsers", methods=["GET"])
@adminLoginCheck
@superUserCheck
def getUsers():
    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    cursor.execute("""                select i.*,
                (select q.name as department_name from admin_departments q where i.department_id = q.id) as department_name
            from (SELECT a.id,
                        a.username,
                        a.email,
                        a.created_at,
                        a.is_su,
                        (select b.department_id from admin_departments_members b where b.user_id = a.id) as department_id
                FROM admin_users a) i;

    """)

    rawData = cursor.fetchall()

    data = []
    for i in rawData:
        i_data = {
            "id": i[0],
            "username": i[1],
            "email": i[2],
            "created_at": i[3],
            "is_su": i[4],
            "department_id": i[5],
            "department_name": i[6]
        }
        data.append(i_data)

    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data": data
    }

    cursor.close()
    db.releaseConnection(conn)

    return makeReturnResponse(__responseObject), 200


@server.route("/admin/getDepartments", methods=["GET"])
@adminLoginCheck
@superUserCheck
def getDepartments():
    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    cursor.execute("""
        select id,name,description,created_at,updated_at from tickets.admin_departments;
    """)

    rawData = cursor.fetchall()

    data = []
    for i in rawData:
        i_data = {
            "id": i[0],
            "name": i[1],
            "description": i[2],
            "created_at": i[3],
            "updated_at": i[4],
        }
        data.append(i_data)

    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data": data
    }

    cursor.close()
    db.releaseConnection(conn)

    return makeReturnResponse(__responseObject), 200


# deleteDepartment
@server.route("/admin/deleteDepartment", methods=["POST"])
@adminLoginCheck
@superUserCheck
def deleteDepartment():
    data = jsonify(request.json)
    jsonData = data.json

    if "id" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing id',
        }
        return makeReturnResponse(__responseObject), 400

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    _id = int(jsonData["id"])

    cursor.execute("""
       delete from admin_departments_members where department_id=%s;
    """, [_id])

    conn.commit()

    cursor.execute("""
       delete from admin_departments_leaders where department_id=%s;
    """, [_id])

    conn.commit()

    cursor.execute("""
       delete from admin_departments where id=%s;
    """, [_id])

    conn.commit()

    cursor.close()
    db.releaseConnection(conn)

    __responseObject = {
        'status': 'success',
        'message': 'OK',
        # "data":data
    }

    return makeReturnResponse(__responseObject), 200


@server.route("/admin/updateDepartment", methods=["POST"])
@adminLoginCheck
@superUserCheck
def updateDepartment():
    data = jsonify(request.json)
    jsonData = data.json

    if "id" not in jsonData and "name" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing id',
        }
        return makeReturnResponse(__responseObject), 400

    # file deepcode ignore replace~__len__~len: len() is slower than __len__()
    if str(jsonData["id"]).__len__() == 0 and str(jsonData["name"]).__len__() == 0:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing id',
        }
        return makeReturnResponse(__responseObject), 400

    desc = "-"
    if "description" in jsonData:
        desc = jsonData["description"]
    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    cursor.execute("""
       update admin_departments set name=%s ,description=%s,updated_at=now()  where id=%s;
    """, [jsonData["name"], desc, jsonData["id"]])

    conn.commit()

    cursor.close()
    db.releaseConnection(conn)

    __responseObject = {
        'status': 'success',
        'message': 'OK',
        # "data":data
    }

    return makeReturnResponse(__responseObject), 200


# createDepartment

@server.route("/admin/createDepartment", methods=["POST"])
@adminLoginCheck
@superUserCheck
def createDepartment():
    data = jsonify(request.json)
    jsonData = data.json

    if "name" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing name',
        }
        return makeReturnResponse(__responseObject), 400

    if str(jsonData["name"]).__len__() == 0:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing name',
        }
        return makeReturnResponse(__responseObject), 400

    desc = "-"
    if "description" in jsonData:
        desc = jsonData["description"]

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    cursor.execute("""
       insert into admin_departments(name,description,created_at,updated_at) 
       values (%s,%s,now(),now());
    """, (jsonData["name"], desc))

    conn.commit()

    cursor.close()
    db.releaseConnection(conn)

    __responseObject = {
        'status': 'success',
        'message': 'OK',
        # "data":data
    }

    return makeReturnResponse(__responseObject), 200


@server.route("/admin/getAdminPageTitle", methods=["GET"])
@adminLoginCheck
def getAdminPageTitle():
    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    cursor.execute(
        "select value from app_config where name ='APP_ADMIN_PAGE_TITLE'")

    app_title = cursor.fetchone()[0]

    cursor.close()
    db.releaseConnection(conn)
    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data": {
            "title": app_title
        }
    }

    return makeReturnResponse(__responseObject), 200


@server.route("/admin/getAppConfig", methods=["GET"])
@adminLoginCheck
@superUserCheck
def getAppConfig():

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    cursor.execute(
        "select name , value from app_config")

    r=cursor.fetchall()
    appData = []
    for i in r:
        insertData={
            "name":i[0],
            "value":i[1]
        }
        appData.append(insertData)

    cursor.close()
    db.releaseConnection(conn)
    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data": appData
    }

    return makeReturnResponse(__responseObject), 200

@server.route("/admin/updateAppConfig", methods=["POST"])
@adminLoginCheck
@superUserCheck
def updateAppConfig():
    data = jsonify(request.json)
    jsonData = data.json

    if "name" not in jsonData and "value" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing name or value',
        }
        return makeReturnResponse(__responseObject), 400

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)
    # print(jsonData["value"],jsonData["name"])
    cursor.execute(
        "update app_config set value=%s where name=%s",(jsonData["value"],jsonData["name"]))

    conn.commit()
    cursor.close()
    db.releaseConnection(conn)
    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":{}
        
    }

    return makeReturnResponse(__responseObject), 200

@server.route("/admin/templates", methods=["GET"])
@adminLoginCheck
@superUserCheck
def getTemplates():

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)
    cursor.execute(
        '''SELECT a.id, a."content", a.created_at, a.updated_at,
        COALESCE((select upper(q.username) from admin_users q where q.id=a.created_by),'SYSTEM') created_by, 
        COALESCE((select upper(q.username) from admin_users q where q.id=a.updated_by),'SYSTEM') updated_by, 
        a."name", a.is_name_editable, a."label" FROM emails_templates a order by id''')

    # map requests to column

    data=[]

    for i in cursor.fetchall():
        insert_data={
            "id":i[0],
            "content":i[1],
            "created_at":i[2], 
            "updated_at":i[3], 
            "created_by":i[4], 
            "updated_by":i[5], 
            "name":i[6], 
            "is_name_editable":i[7],
            "label":i[8]
        }
        data.append(insert_data)
    cursor.close()
    db.releaseConnection(conn)

    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":data
        
    }

    return makeReturnResponse(__responseObject), 200

@server.route("/admin/templates/blocks", methods=["GET"])
@adminLoginCheck
@superUserCheck
def getBlocks():

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)
    cursor.execute(
        '''SELECT id, "name", "content", created_at,  
        COALESCE((select upper(q.username) from admin_users q where q.id=a.created_by),'SYSTEM') created_by, 
        COALESCE((select upper(q.username) from admin_users q where q.id=a.updated_by),'SYSTEM') updated_by,  
        updated_at
FROM emails_blocks a order by id
''')

    # map requests to column

    data=[]

    for i in cursor.fetchall():
        insert_data={
            "id":i[0],
            "name":i[1], 
            "content":i[2],
            "created_at":i[3], 
            "created_by":i[4], 
            "updated_by":i[5], 
            "updated_at":i[6], 
        }
        data.append(insert_data)
    cursor.close()
    db.releaseConnection(conn)

    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":data
        
    }

    return makeReturnResponse(__responseObject), 200

@server.route("/admin/templates/variables", methods=["GET"])
@adminLoginCheck
@superUserCheck
def getVariables():

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)
    cursor.execute(
        '''SELECT id, "name", "content", created_at, 
COALESCE((select upper(q.username) from admin_users q where q.id=a.created_by),'SYSTEM') created_by, 
updated_at, 
COALESCE((select upper(q.username) from admin_users q where q.id=a.updated_by),'SYSTEM') updated_by, 
is_static
FROM emails_variables a order by id
''')

    # map requests to column

    data=[]

    for i in cursor.fetchall():
        insert_data={
            "id":i[0],
            "name":i[1], 
            "content":i[2],
            "created_at":i[3], 
            "created_by":i[4], 
            "updated_at":i[5], 
            "updated_by":i[6], 
            "is_staic":i[7]
        }
        data.append(insert_data)
    cursor.close()
    db.releaseConnection(conn)

    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":data
        
    }

    return makeReturnResponse(__responseObject), 200

@server.route("/admin/templates/create", methods=["POST"])
@adminLoginCheck
@superUserCheck
def createTemplates():

    data = jsonify(request.json)
    jsonData = data.json

    if "name" not in jsonData or "label" not in jsonData or "content"  not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing name,label or content',
        }
        return makeReturnResponse(__responseObject), 400


    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    CREATED_AT=datetime.now()
    
    try:
        cursor.execute(
            '''INSERT INTO emails_templates
    ("content", created_at, updated_at, created_by, updated_by, "name", is_name_editable, "label")
    VALUES(%s, %s, %s, %s, %s, %s, true, %s);
    ''',(jsonData["content"],CREATED_AT,CREATED_AT,request.user.id,request.user.id,jsonData["name"],jsonData["label"]))

    except Exception as err:
        print(err)
        conn.rollback()
        cursor.close()
        db.releaseConnection(conn)
        __responseObject = {
            'status': 'error',
            'message': str(err),
            "data":[]
            
        }
        

        return makeReturnResponse(__responseObject), 400 
    conn.commit()

    log.info(f"User {request.user.username} with id {request.user.id} has created template with name {jsonData['name']}")

    cursor.close()
    db.releaseConnection(conn)

    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":[]
        
    }

    return makeReturnResponse(__responseObject), 200


@server.route("/admin/templates/template", methods=["POST"])
@adminLoginCheck
@superUserCheck
def getTemplate():
    data = jsonify(request.json)
    jsonData = data.json

    if "template_id" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing or invalid template_id',
        }
        return makeReturnResponse(__responseObject), 400

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)


    cursor.execute("""
        SELECT id, "content", created_at, updated_at, created_by, updated_by, "name", is_name_editable, "label"
        FROM emails_templates where id=%s;
 
    """,[jsonData["template_id"]])
    data=assignQueryToFields( cursor.fetchone(),["id","content","created_at","updated_at","created_by","updated_by","name","is_name_editable","label"] )  


    cursor.close()
    db.releaseConnection(conn)

    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":data
        
    }

    return makeReturnResponse(__responseObject), 200

@server.route("/admin/templates/blocks/block", methods=["POST"])
@adminLoginCheck
@superUserCheck
def getBlock():
    data = jsonify(request.json)
    jsonData = data.json

    if "block_id" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing or invalid block_id',
        }
        return makeReturnResponse(__responseObject), 400

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)


    cursor.execute("""
        SELECT id, "name", "content", created_at, created_by, updated_at, updated_by
        FROM emails_blocks where id =%s;

 
    """,[jsonData["block_id"]])
    data=assignQueryToFields( cursor.fetchone(),["id","name","content","created_at","created_by","updated_at","updated_by"] )


    cursor.close()
    db.releaseConnection(conn)

    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":data
        
    }

    return makeReturnResponse(__responseObject), 200

@server.route("/admin/templates/update", methods=["POST"])
@adminLoginCheck
@superUserCheck
def updateTemplates():

    data = jsonify(request.json)
    jsonData = data.json

    if "id"not in jsonData or "name" not in jsonData or "label" not in jsonData or "content"  not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing id,name,label or content',
        }
        return makeReturnResponse(__responseObject), 400


    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    
    try:
        cursor.execute("select is_name_editable from emails_templates where id=%s",[jsonData['id']])
        r=cursor.fetchone()
        if r is None:
            raise ValueError("Invalid template name")
        
        IS_NAME_EDITABLE=r[0]

        if IS_NAME_EDITABLE:
            cursor.execute("""
            UPDATE emails_templates
            SET "content"=%s, updated_at=now(), updated_by=%s, "name"=%s, "label"=%s
            WHERE id=%s;
            """,[jsonData["content"],request.user.id,jsonData["name"],jsonData["label"],jsonData["id"]])
        else:
            cursor.execute("""
            UPDATE emails_templates
            SET "content"=%s, updated_at=now(), updated_by=%s, "label"=%s
            WHERE id=%s;
            """,[jsonData["content"],request.user.id,jsonData["label"],jsonData["id"]])

    except Exception as err:
        print(err)
        conn.rollback()
        cursor.close()
        db.releaseConnection(conn)
        __responseObject = {
            'status': 'error',
            'message': str(err),
            "data":[]
            
        }

        return makeReturnResponse(__responseObject), 400 
    
    conn.commit()

    log.info(f"User {request.user.username} with id {request.user.id} has updated template with name {jsonData['name']}")

    cursor.close()
    db.releaseConnection(conn)

    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":[]
        
    }

    return makeReturnResponse(__responseObject), 200


@server.route("/admin/templates/delete", methods=["POST"])
@adminLoginCheck
@superUserCheck
def deleteTemplates():

    data = jsonify(request.json)
    jsonData = data.json

    if "id" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing id,name,label or content',
        }
        return makeReturnResponse(__responseObject), 400


    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    
    try:
        cursor.execute("select is_name_editable from emails_templates where id=%s",[jsonData['id']])
        r=cursor.fetchone()
        if r is None:
            raise ValueError("Invalid template name")
        
        IS_NAME_EDITABLE=r[0]

        if not IS_NAME_EDITABLE:
            raise PermissionError("You cannot delete this template, becouse is critical!")
        
        cursor.execute("""
            delete from emails_templates
            WHERE id=%s;
            """,[jsonData["id"]])

    except Exception as err:
        print(err)
        conn.rollback()
        cursor.close()
        db.releaseConnection(conn)
        __responseObject = {
            'status': 'error',
            'message': str(err),
            "data":[]
            
        }

        return makeReturnResponse(__responseObject), 400 
    
    conn.commit()

    log.info(f"User {request.user.username} with id {request.user.id} has deleted template with name {jsonData['id']}")

    cursor.close()
    db.releaseConnection(conn)

    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":[]
        
    }

    return makeReturnResponse(__responseObject), 200


@server.route("/admin/templates/blocks/update", methods=["POST"])
@adminLoginCheck
@superUserCheck
def updateBlocks():

    data = jsonify(request.json)
    jsonData = data.json

    if "id"not in jsonData or "name" not in jsonData  or "content"  not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing id,name or content',
        }
        return makeReturnResponse(__responseObject), 400


    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    
    try:


        cursor.execute("""
        UPDATE emails_blocks
        SET "content"=%s, updated_at=now(), updated_by=%s, "name"=%s
        WHERE id=%s;
        """,[jsonData["content"],request.user.id,jsonData["name"],jsonData["id"]])
    

    except Exception as err:
        print(err)
        conn.rollback()
        cursor.close()
        db.releaseConnection(conn)
        __responseObject = {
            'status': 'error',
            'message': str(err),
            "data":[]
            
        }

        return makeReturnResponse(__responseObject), 400 
    
    conn.commit()

    log.info(f"User {request.user.username} with id {request.user.id} has updated block with name {jsonData['name']}")

    cursor.close()
    db.releaseConnection(conn)

    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":[]
        
    }

    return makeReturnResponse(__responseObject), 200

@server.route("/admin/templates/blocks/create", methods=["POST"])
@adminLoginCheck
@superUserCheck
def createBlock():

    data = jsonify(request.json)
    jsonData = data.json

    if "name" not in jsonData  or "content"  not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing name or content',
        }
        return makeReturnResponse(__responseObject), 400


    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    CREATED_AT=datetime.now()
    
    try:
        cursor.execute(
            '''INSERT INTO emails_blocks
            ("content", created_at, updated_at, created_by, updated_by, "name" )
            VALUES(%s, %s, %s, %s, %s, %s);
            ''',(jsonData["content"],CREATED_AT,CREATED_AT,request.user.id,request.user.id,jsonData["name"]))

    except Exception as err:
        print(err)
        conn.rollback()
        cursor.close()
        db.releaseConnection(conn)
        __responseObject = {
            'status': 'error',
            'message': str(err),
            "data":[]
            
        }
        

        # return makeReturnResponse(__responseObject), 400 
    conn.commit()

    log.info(f"User {request.user.username} with id {request.user.id} has created block with name {jsonData['name']}")

    cursor.close()
    db.releaseConnection(conn)

    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":[]
        
    }

    return makeReturnResponse(__responseObject), 200


@server.route("/admin/templates/blocks/delete", methods=["POST"])
@adminLoginCheck
@superUserCheck
def deleteBlock():

    data = jsonify(request.json)
    jsonData = data.json

    if "id" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing id',
        }
        return makeReturnResponse(__responseObject), 400


    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    
    try:
      
        
        cursor.execute("""
            delete from emails_blocks
            WHERE id=%s;
            """,[jsonData["id"]])

    except Exception as err:
        print(err)
        conn.rollback()
        cursor.close()
        db.releaseConnection(conn)
        __responseObject = {
            'status': 'error',
            'message': str(err),
            "data":[]
            
        }

        return makeReturnResponse(__responseObject), 400 
    
    conn.commit()

    log.info(f"User {request.user.username} with id {request.user.id} has deleted block with id {jsonData['id']}")

    cursor.close()
    db.releaseConnection(conn)

    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":[]
        
    }

    return makeReturnResponse(__responseObject), 200

# dashboard reports


@server.route("/admin/dashboard/reports/users", methods=["GET"])
@adminLoginCheck
def usersReports():
    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    data={}

    cursor.execute("""
    select count(*) from tickets a where 
        a.id in (select q.ticket_id from tickets_users_assigned q where q.user_id =%s ) 
        and a.created_by != %s 
        and a.status not in ('OPEN','RELEASED')
    --group by created_at
    """,[request.user.id,request.user.id])

    # tickets assgined
    data["assigned"]=(cursor.fetchone())[0]

    cursor.execute("""
        select count(*) from tickets a where 
            a.created_by = %s 
            and a.status not in ('OPEN','RELEASED')
            
    """,[request.user.id])
    # tickets created
    data["created"]=(cursor.fetchone())[0]

    # deparment

    cursor.execute("""
            select ad."name" from admin_departments ad where id = (select q.id from admin_departments_members q where q.user_id=%s) 
    """,[request.user.id])

    data["department"]=(cursor.fetchone())[0]

    cursor.close()
    db.releaseConnection(conn)
    
    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":data
        
    }

    return makeReturnResponse(__responseObject), 200


@server.route("/admin/superuser/clients/create", methods=["POST"])
@adminLoginCheck
@superUserCheck
def createClient():
    
    data = jsonify(request.json)
    jsonData = data.json

    if "type" not in jsonData or str(jsonData["type"]).lower() not in ["business","person"]:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing or invalid type ',
        }
        return makeReturnResponse(__responseObject), 400

    client_type=str(jsonData["type"]).lower()

    if client_type=="person":
        fields=["email","phone","address","city","country_id","zipcode","region","first_name","last_name","middle_name","unique_id"]
        message='Missing "email" or"phone" or"address" or"city" or"country_id" or"zipcode" or"region" or"first_name" or"last_name" or"middle_name" or "unique_id"'
    else:
        fields=["email","phone","address","city","country_id","zipcode","region","full_name","registration_code","code"]
        message='Missing "name" or"email" or"phone" or"address" or"city" or"country_id" or"zipcode" or"region" or"first_name" or"last_name" or"middle_name"'
    
    if not validateRequestsFields(jsonData,fields):
        __responseObject = {
            'status': 'invalid',
            'message': message,
        }
        return makeReturnResponse(__responseObject), 400

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":{}
        
        }


    if  client_type=="person":
        full_name=f'{jsonData["first_name"]} {jsonData["middle_name"]} {jsonData["last_name"]}'
        
        cursor.execute("""
            INSERT INTO admin_clients
            (full_name, first_name, middle_name, last_name, address, country_id, city, region, unique_id, email, phone, zipcode,created_by,updated_by)
            VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s,%s);
        """,[full_name,jsonData["first_name"],jsonData["middle_name"],jsonData["last_name"],jsonData["address"],jsonData["country_id"],jsonData["city"],jsonData["region"],jsonData["unique_id"],
                        jsonData["email"],jsonData["phone"],jsonData["zipcode"],request.user.id,request.user.id])

        conn.commit()
        
        log.info(f"User {request.user.username} with id {request.user.id} has created person client named {full_name}")

        cursor.close()
        db.releaseConnection(conn)
        return makeReturnResponse(__responseObject), 200

    cursor.execute("""
    INSERT INTO admin_clients_as_bussiness
    (full_name, address, email, registration_code, code, country_id, city, region, phone, zipcode,created_by,updated_by)
    VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s,%s);
    """,(jsonData["full_name"],jsonData["address"],jsonData["email"],jsonData["registration_code"],jsonData["code"],
         jsonData["country_id"],jsonData["city"],jsonData["region"],jsonData["phone"],jsonData["zipcode"],request.user.id,request.user.id))
    

    conn.commit()
    log.info(f'User {request.user.username} with id {request.user.id} has created person client named {jsonData["full_name"]}')

    cursor.close()
    db.releaseConnection(conn)
    return makeReturnResponse(__responseObject), 200

@server.route("/admin/superuser/clients", methods=["GET"])
@adminLoginCheck
@superUserCheck
def getAllClients():

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    cursor.execute("""
        select 	
            a.full_name, a.address,
            (select q.name from nomenclators_countries q where q.id=a.country_id) as country,
            a.region, unique_id as code ,
            a.email,a.phone, false as is_business,uid from admin_clients a
        union all
        select 	
            a.full_name, a.address,
            (select q.name from nomenclators_countries q where q.id=a.country_id) as country,
            a.region, a.registration_code || ' ' || a.code as code ,
            a.email,a.phone, true as is_business,uid from admin_clients_as_bussiness a
    """)

    data=[]

    fields=["full_name","address","country","region","code","email","phone","is_business","uid",]
    for i in cursor.fetchall():
        data.append(assignQueryToFields(i,fields))

    cursor.close()
    db.releaseConnection(conn)
    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":data
        
        }

    return makeReturnResponse(__responseObject), 200


@server.route("/admin/superuser/clients/getCountries", methods=["GET"])
@adminLoginCheck
@superUserCheck
def getCountries():

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    cursor.execute("""
        select id, name || ' - ' || code as name from nomenclators_countries
    """)

    data=[]

    for i in cursor.fetchall():
        data.append({
            "id":i[0],
            "name":i[1]
        })
    # print(data)
    cursor.close()
    db.releaseConnection(conn)
    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":data
        
        }

    return makeReturnResponse(__responseObject), 200

@server.route("/admin/superuser/clients/getClient", methods=["POST"])
@adminLoginCheck
@superUserCheck
def getClient():
    data = jsonify(request.json)
    jsonData = data.json
    if "client_uid" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing or invalid client_id',
        }
        return makeReturnResponse(__responseObject), 400
    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)
    try:
        cursor.execute("""
            select 	
                false is_business from admin_clients a where a.uid=%s
            union all
            select 	
                true is_business from admin_clients_as_bussiness a where a.uid=%s
        """,[jsonData["client_uid"],jsonData["client_uid"]])
    except Exception as e:
        __responseObject = {
        'status': 'success',
        'message': 'The client_uid is invalid',
        "data":{}
        
        }

        return makeReturnResponse(__responseObject), 400
    
    is_business=cursor.fetchone()[0]
    # print("is_business",is_business)
    if  is_business == False:
        cursor.execute("""
            SELECT first_name, middle_name, last_name, address, country_id, 
            city, region, unique_id, id, email, phone, zipcode, created_at, 
            updated_at, created_by, updated_by, uid
            FROM admin_clients where uid=%s;
        """,[jsonData["client_uid"]])
        fields=["first_name","middle_name","last_name","address","country_id","city","region","unique_id","id","email","phone","zipcode","created_at","updated_at","created_by","updated_by","uid"]
        
    else:
        cursor.execute("""
        SELECT id, full_name, address, email, registration_code, code, country_id, city, region, phone, zipcode, created_by, updated_by, created_at, updated_at, uid
        FROM admin_clients_as_bussiness where uid=%s;
        """,[jsonData["client_uid"]])
        fields=["id","full_name","address","email","registration_code","code","country_id","city","region","phone","zipcode","created_by","updated_by","created_at","updated_at","uid"]
    
    r=cursor.fetchone()
    if r is None:
        __responseObject = {
        'status': 'success',
        'message': 'The client_uid is invalid',
        "data":{}
        
        }

        return makeReturnResponse(__responseObject), 400
    data=assignQueryToFields(r,fields)

    data["is_business"]=is_business

    cursor.close()
    db.releaseConnection(conn)
    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":data
        
        }

    return makeReturnResponse(__responseObject), 200


@server.route("/admin/superuser/clients/notes/create", methods=["POST"])
@adminLoginCheck
@superUserCheck
def createNotes():
    data = jsonify(request.json)
    jsonData = data.json

    if "client_uid" not in jsonData or "note_content" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing or invalid client_uid or note_content',
        }
        return makeReturnResponse(__responseObject), 400
    
    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    try:
        cursor.execute("""
            select 	
                id from admin_clients a where a.uid=%s
            union all
            select 	
                id from admin_clients_as_bussiness a where a.uid=%s
        """,[jsonData["client_uid"],jsonData["client_uid"]])

        r=cursor.fetchone()[0]
        if r is None:
            raise Exception("No uid")
    except Exception as e:
        __responseObject = {
        'status': 'success',
        'message': 'The client_uid is invalid',
        "data":{}
        
        }

        return makeReturnResponse(__responseObject), 400

    cursor.execute("""
        INSERT INTO admin_clients_notes
        (note, created_at, client_uid,created_by)
        VALUES(%s, now(), %s);
    """,(jsonData["note_content"],jsonData["client_uid"],request.user.id))

    log.info(f"User {request.user.username} with id {request.user.id} created note for client with uid {jsonData['client_uid']}")

    conn.commit()
    cursor.close()
    db.releaseConnection(conn)
    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":{}
        
        }

    return makeReturnResponse(__responseObject), 200

@server.route("/admin/superuser/clients/notes", methods=["POST"])
@adminLoginCheck
@superUserCheck
def getClientNotes():
    data = jsonify(request.json)
    jsonData = data.json

    if "client_uid" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing or invalid client_uid',
        }
        return makeReturnResponse(__responseObject), 400
    
    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    cursor.execute("""
        SELECT id, note,
        (select q.username from admin_users q where q.id=created_by) as created_by,created_at
        FROM admin_clients_notes where client_uid=%s;
    """,[jsonData["client_uid"]])

    r=cursor.fetchall()
    
    if r is None:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing or invalid client_uid',
        }
        return makeReturnResponse(__responseObject), 400 

    data=[]
    for i in r:
        data.append({"id":i[0],"note":i[1],"created_by":i[2],"created_at":i[3]})

    cursor.close()
    db.releaseConnection(conn)
    __responseObject = {
        'status': 'success',
        'message': 'OK',
        "data":data
        
        }

    return makeReturnResponse(__responseObject), 200


@server.route("/admin/superuser/clients/edit", methods=["POST"])
@adminLoginCheck
@superUserCheck
def editClient():
    data = jsonify(request.json)
    jsonData = data.json
    if "client_uid" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing or invalid client_uid',
        }
        return makeReturnResponse(__responseObject), 400
    
    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    try:
        cursor.execute("""
            select 	
                false is_business from admin_clients a where a.uid=%s
            union all
            select 	
                true is_business from admin_clients_as_bussiness a where a.uid=%s
        """,[jsonData["client_uid"],jsonData["client_uid"]])
        r= cursor.fetchone()
        if r is None:
            raise Exception("No uid")
    except Exception as e:
        __responseObject = {
        'status': 'error',
        'message': 'The client_uid is invalid',
        "data":{}
        
        }

        return makeReturnResponse(__responseObject), 400
    is_business=r[0]

    if is_business == False:
        fields=["email","phone","address","city","country_id","zipcode","region","first_name","last_name","middle_name","unique_id"]
        message='Missing "email" or"phone" or"address" or"city" or"country_id" or"zipcode" or"region" or"first_name" or"last_name" or"middle_name" or "unique_id"'
    else:
        fields=["email","phone","address","city","country_id","zipcode","region","full_name","registration_code","code"]
        message='Missing "name" or"email" or"phone" or"address" or"city" or"country_id" or"zipcode" or"region" or"first_name" or"last_name" or"middle_name"'
    # TODO finish this function

    if not validateRequestsFields(jsonData,fields):
        __responseObject = {
            'status': 'invalid',
            'message': message,
        }
        return makeReturnResponse(__responseObject), 400
    
    __responseObject = {
                'status': 'success',
                'message': 'OK',
                "data":{}
                
                }
    __responseCode=200
    try:
        if is_business == False:
            cursor.execute("""
                UPDATE admin_clients SET
                email=%s, phone=%s, address=%s, city=%s, country_id=%s, zipcode=%s, region=%s, first_name=%s, last_name=%s, middle_name=%s, unique_id=%s, updated_by=%s, updated_at=now(),full_name=%s
                WHERE uid=%s;
            """,(jsonData["email"],jsonData["phone"],jsonData["address"],jsonData["city"],jsonData["country_id"],jsonData["zipcode"],jsonData["region"],jsonData["first_name"],jsonData["last_name"],jsonData["middle_name"],jsonData["unique_id"],request.user.id,f"{jsonData['first_name']} {jsonData['middle_name']} {jsonData['last_name']}",jsonData["client_uid"]))
        else:
            cursor.execute("""
                    UPDATE admin_clients_as_bussiness SET
                    email=%s, phone=%s, address=%s, city=%s, country_id=%s, zipcode=%s, region=%s, full_name=%s, registration_code=%s, code=%s, updated_by=%s, updated_at=now()
                    where uid=%s
            """,(jsonData["email"],jsonData["phone"],jsonData["address"],jsonData["city"],jsonData["country_id"],jsonData["zipcode"],jsonData["region"],jsonData["full_name"],jsonData["registration_code"],jsonData["code"],request.user.id,jsonData["client_uid"]))

        conn.commit()

    except Exception as e:
        conn.rollback()
        log.error(f"User {request.user.username} with id {request.user.id} failed to edit client with uid {jsonData['client_uid']} with error: {str(e)}")
        __responseObject = {
        'status': 'error',
        'message': str(e),
        "data":{}
        
        }
        __responseCode=500

        
    cursor.close()
    db.releaseConnection(conn)

    return makeReturnResponse(__responseObject), __responseCode

@server.route("/admin/superuser/clients/delete", methods=["POST"])
@adminLoginCheck
@superUserCheck
def deleteClient():
    data = jsonify(request.json)
    jsonData = data.json
    if "client_uid" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing or invalid client_uid',
        }
        return makeReturnResponse(__responseObject), 400
    
    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    try:
        cursor.execute("""
            select 	
                false is_business from admin_clients a where a.uid=%s
            union all
            select 	
                true is_business from admin_clients_as_bussiness a where a.uid=%s
        """,[jsonData["client_uid"],jsonData["client_uid"]])
        r= cursor.fetchone()
        if r is None:
            raise Exception("No uid")
    except Exception as e:
        __responseObject = {
        'status': 'error',
        'message': 'The client_uid is invalid',
        "data":{}
        
        }

        return makeReturnResponse(__responseObject), 400
    is_business=r[0]

    if is_business == False:
        cursor.execute("""
            DELETE FROM admin_clients WHERE uid=%s;
        """,[jsonData["client_uid"]])
    else:
        cursor.execute("""
            DELETE FROM admin_clients_as_bussiness WHERE uid=%s;
        """,[jsonData["client_uid"]])
    conn.commit()
    cursor.close()
    db.releaseConnection(conn)
    __responseObject = {
                'status': 'success',
                'message': 'OK',
                "data":{}
                
                }
    return makeReturnResponse(__responseObject), 200

