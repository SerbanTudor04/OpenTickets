from __main__ import server, db, logger, cache
import uuid
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from libs import encode_auth_token, makeReturnResponse, adminLoginCheck, superUserCheck
import psycopg2.errors as dbErrors
from env import DB_QUERY_STRING


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
    print(jsonData)

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
    print(jsonData)

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
@cache.cached(timeout=600)
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