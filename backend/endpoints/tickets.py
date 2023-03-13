from __main__ import server, db, logger
import uuid
from flask import request, jsonify
from libs import makeReturnResponse, adminLoginCheck, superUserCheck, genTicketCode, addInboxMessageForDepartment
import psycopg2.errors as dbErrors
import datetime
from env import DB_QUERY_STRING

log = logger


@server.route("/admin/tickets/createTicket", methods=['POST'])
@adminLoginCheck
def createTicket():
    data = jsonify(request.json)

    jsonData = data.json

    if "department_id" not in jsonData or "subject" not in jsonData or "description" not in jsonData or "content" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing department_id,subject,description, or content',
        }
        return makeReturnResponse(__responseObject), 400

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    try:
        ticketID = str(uuid.uuid4())
        ticketCode = genTicketCode()
        ticketDateTime = str(datetime.datetime.now())
        try:
            cursor.execute("""
            insert into tickets.tickets (id,code, subject, description, department_id, content, created_at, status,created_by)
            values (%s,%s,%s,%s,%s,%s,%s,'OPEN',%s);
                        """, (ticketID, ticketCode, jsonData["subject"], jsonData["description"], jsonData["department_id"], jsonData["content"], ticketDateTime, request.user.id))

        except Exception as e:

            cursor.close()
            db.releaseConnection(conn)
            log.error("Exception "+str(e))
            __responseObject = {
                'status': 'invalid',
                'message': 'An error has occured',
            }
            return makeReturnResponse(__responseObject), 500

        timelineContent = f"User {request.user.username} has created the ticket with the following subject: {jsonData['subject']}"

        cursor.execute("""
        insert into tickets_timeline (content, created_at, ticket_id,ticket_code)
        values (%s,%s,%s,%s);
        """, (timelineContent, ticketDateTime, ticketID, ticketCode))

        conn.commit()

        cursor.execute("""
            insert into tickets_rights (user_id, ticket_id, code)
            values (%s,%s,%s);
        """, (request.user.id, ticketID, 'OWNER'))

        conn.commit()

        if jsonData["department_id"] is not None:
            try:
                __deptInt = int(jsonData["department_id"])

                cursor.execute("""
                    select name from admin_departments where id=%s
                """, [__deptInt])
                __crsData = cursor.fetchone()

                if __crsData is None:
                    raise ValueError("Could not find the department")
                timelineContent = f"Ticket has been assigned to department {str(__crsData[0])}({str(__deptInt)})"
                cursor.execute("""
                insert into tickets_timeline (content, created_at, ticket_id,ticket_code)
                values (%s,%s,%s,%s);
                
                """, (timelineContent, ticketDateTime, ticketID, str(ticketCode)))
                conn.commit()

                subject = f"""A new ticket has been created for your department.Ticket code #{ticketCode}."""
                try:
                    addInboxMessageForDepartment(
                        conn, subject, jsonData["department_id"])
                except Exception as e:
                    log.info(
                        f"An error has occurred while adding messages to inbox for department "+jsonData["department_id"])
                    log.error(e)

            except Exception as e:
                log.warn(
                    f"User {request.user.id} tried to assign an invalid department to timeline!")
                log.error(e)
    except Exception as e:
        cursor.close()
        db.releaseConnection(conn)
        log.error(
            f"An error has occured when user {request.user.id}  tried to create a ticket")
        log.error(f"User: {request.user.id} ->" + str(e))
        __responseObject = {
            'status': 'invalid',
            'message': 'An error has occured',
        }
        return makeReturnResponse(__responseObject), 500
    cursor.close()
    db.releaseConnection(conn)
    return makeReturnResponse({"status": "success", "message": "Ok", "data": {"ticketID": ticketCode
                                                                                                            }}), 200


@server.route("/admin/tickets/getmyTickets", methods=['GET'])
@adminLoginCheck
def getmyTickets():

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    cursor.execute("""
        select a.id,a.code,a.subject,(select q.label from tickets_status_codes q where q.code=a.status) as status,
        (select q.name from admin_departments q where q.id=a.department_id) as department,a.created_at,a.closed_at 
        from tickets a  where created_by=%s;
    """, [request.user.id])

    data = []

    for i in cursor.fetchall():
        idata = {
            "id": i[0],
            "code": i[1],
            "subject": i[2],
            "status": i[3],
            "department": i[4],
            "created_at": i[5],
            "closed_at": i[6],
        }
        data.append(idata)

    cursor.close()
    db.releaseConnection(conn)
    return makeReturnResponse({"status": "success", "message": "Ok", "data": data}), 200


@server.route("/admin/tickets/getMyPendingRequests", methods=['GET'])
@adminLoginCheck
def getMyPendingRequests():

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    cursor.execute("""
    select a.id,a.code,a.subject,(select q.label from tickets_status_codes q where q.code=a.status) as status,
        (select q.name from admin_departments q where q.id=a.department_id) as department,a.created_at,a.closed_at  
        from tickets a where a.id in (select b.ticket_id from tickets_users_assigned b where b.user_id=%s and "isActive"=true)
                            and status in ('PENDING','ASSIGNED')

    """, [request.user.id])

    data = []

    for i in cursor.fetchall():
        idata = {
            "id": i[0],
            "code": i[1],
            "subject": i[2],
            "status": i[3],
            "department": i[4],
            "created_at": i[5],
            "closed_at": i[6],
        }
        data.append(idata)

    cursor.close()
    db.releaseConnection(conn)
    return makeReturnResponse({"status": "success", "message": "Ok", "data": data}), 200

@server.route("/admin/tickets/getTicketsStatusCodes", methods=['GET'])
@adminLoginCheck
def getTicketsStatusCodes():

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    cursor.execute("""
    select id,code,label from tickets_status_codes where code not in ('ASSIGNED','OPEN')
    """)

    data = []

    for i in cursor.fetchall():
        idata = {
            "id": i[0],
            "code": i[1],
            "label": i[2],
        }
        data.append(idata)

    cursor.close()
    db.releaseConnection(conn)
    return makeReturnResponse({"status": "success", "message": "Department created with success!", "data": data}), 200



@server.route("/admin/tickets/getOpenOrReleasedTickets", methods=['GET'])
@adminLoginCheck
def getOpenOrReleasedTickets():

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    cursor.execute("""
    select a.id,a.code,a.subject,(select q.label from tickets_status_codes q where q.code=a.status) as status,
        (select q.name from admin_departments q where q.id=a.department_id) as department,a.created_at,a.closed_at  
        from tickets a where a.status in ('OPEN','RELEASED') 
                            and (a.department_id = (select q.department_id from admin_departments_members q where q.user_id=%s ) or a.department_id is null)
                           and (a.created_by!=%s or a.created_by is null)

    """, [request.user.id,request.user.id])

    data = []

    for i in cursor.fetchall():
        idata = {
            "id": i[0],
            "code": i[1],
            "subject": i[2],
            "status": i[3],
            "department": i[4],
            "created_at": i[5],
            "closed_at": i[6],
        }
        data.append(idata)

    cursor.close()
    db.releaseConnection(conn)
    return makeReturnResponse({"status": "success", "message": "Ok", "data": data}), 200


@server.route("/admin/tickets/getTicketByID", methods=['POST'])
@adminLoginCheck
def getTicketByID():
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

    ticketID = str(jsonData["id"])

    cursor.execute("""select code from tickets_rights where user_id =%s and ticket_id =%s
    """, [request.user.id, ticketID])

    retValue = cursor.fetchone()

    if retValue is None:
        return makeReturnResponse({"status": "success", "message": "You are not allowed to see this ticket.", "data": {
            "isAllowed2View": False,
        }}), 200

    typeOFView = retValue[0]
    
    
    
    cursor.execute("""select a.id,a.code,a.subject,(select q.label from tickets_status_codes q where q.code=a.status) as status,
        (select q.name from admin_departments q where q.id=a.department_id) as department,a.created_at,a.closed_at ,a.description,
        a.content ,a.status as raw_status,a.updated_at
        from tickets a where a.id =%s
    """, [ticketID])

    retValue = cursor.fetchone()
    if retValue is None:
        return makeReturnResponse({"status": "success", "message": "Unkown ticket.", "data": {
            "isAllowed2View": False,
        }}), 200

    ticketData = {
        "id": retValue[0],
        "code": retValue[1],
        "subject": retValue[2],
        "status": retValue[3],
        "department": retValue[4],
        "created_at": retValue[5],
        "closed_at": retValue[6],
        "description":retValue[7],
        "content":retValue[8],
        "raw_status":retValue[9],
        "updated_at":retValue[10],
    }


    cursor.close()
    db.releaseConnection(conn)
    return makeReturnResponse({"status": "success", "message": "ok!", "data": {
        "isAllowed2View": True,
        "typeOFView": typeOFView,
        "ticket_data": ticketData

    }}), 200


@server.route("/admin/tickets/assignTicket2Me", methods=['POST'])
@adminLoginCheck
def assignTicket2Me():
    data = jsonify(request.json)

    jsonData = data.json

    if "id" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing id or code',
        }
        return makeReturnResponse(__responseObject), 400

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    ticketID = str(jsonData["id"])

    # Validate if tickt exists and get also get the code
    cursor.execute("select code from tickets where id=%s and status in ('OPEN','RELEASED')", [ticketID])
    retVal = cursor.fetchone()
    if retVal is None:
        __responseObject = {
            'status': 'invalid',
            'message': 'Wrong id',
        }
        return makeReturnResponse(__responseObject), 400

    ticketCode = str(retVal[0])

    ticketDateTime = str(datetime.datetime.now())
    try:
        cursor.execute("""
        insert into tickets_users_assigned (ticket_id, user_id, created_at,updated_at, "isActive")
            values (%s,%s,%s,%s,true);
        """, (ticketID, request.user.id, ticketDateTime, ticketDateTime))
        timelineContent = f"Ticket has been assigned to user {request.user.username}"

        conn.commit()
    except dbErrors.UniqueViolation:
        conn.rollback()
        cursor.execute("""
        update tickets_users_assigned
            set "isActive" = true ,
            updated_at =%s
            where ticket_id =%s and user_id =%s;
        """, (ticketDateTime, ticketID, request.user.id))
        conn.commit()
        log.warn(f"User {request.user.id} has been reassigned to {ticketID}.")
        timelineContent = f"User {request.user.username} has been reassigned to {ticketID}"

    cursor.execute("""
    insert into tickets_timeline (content, created_at, ticket_id,ticket_code)
    values (%s,%s,%s,%s);
    """, (timelineContent, ticketDateTime, ticketID, str(ticketCode)))

    cursor.execute("""
        update tickets
            set status = 'ASSIGNED', updated_at =%s
            where id =%s ;
        """, (ticketDateTime, ticketID))
    conn.commit()
    
    try:
        cursor.execute("""
            insert into tickets_rights (user_id, code, ticket_id,created_at, updated_at)
            values (%s,'ADD_CONTENT',%s,%s,%s);
        """,(request.user.id,ticketID,ticketDateTime,ticketDateTime))

    except dbErrors.UniqueViolation:
        conn.rollback()
        cursor.execute("""
        update tickets_rights
            set code = 'ADD_CONTENT' ,
            updated_at =%s
            where ticket_id =%s and user_id =%s;
        """, (ticketDateTime, ticketID, request.user.id))
        log.warn(f"Rights of user {request.user.id} has been adjusted on ticket {ticketID}.")

    conn.commit()

    cursor.close()
    db.releaseConnection(conn)
    return makeReturnResponse({"status": "success", "message": "Ticket assigned with success!", "data": {

    }}), 200


@server.route("/admin/tickets/addMessage2TicketsOrMessage", methods=['POST'])
@adminLoginCheck
def addMessage2TicketsOrMessage():
    data = jsonify(request.json)

    jsonData = data.json

    if "ticket_id" not in jsonData or  "content" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing ticket_id or content',
        }
        return makeReturnResponse(__responseObject), 400
    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    ticketID = str(jsonData["ticket_id"])

    messageMasterID=None
    if "master_message_id" in jsonData:
        messageMasterID=str(jsonData["master_message_id"])
    

    if "ticket_status" in jsonData and jsonData["ticket_status"] is not None:
        cursor.execute("""
            update tickets
                set status = %s, updated_at =%s
                where id =%s ;
            """, (jsonData["ticket_status"],datetime.datetime.now(), ticketID))
        cursor.execute("""
            select label from tickets_status_codes where code=%s
        """,[jsonData["ticket_status"]])

        status_label=(cursor.fetchone())[0]

        markMessage=jsonData["content"]+f"\n*********\nAction: Marked ticket as {status_label}\n*********"
        cursor.execute("""
        insert into ticket_messages (id, content, created_by, id_master, ticket_id, created_at)
        values (%s,%s,%s,%s,%s,%s); 
        """,(str(uuid.uuid4()),markMessage,request.user.id,messageMasterID,ticketID,datetime.datetime.now()))
    else:
        cursor.execute("""
        insert into ticket_messages (id, content, created_by, id_master, ticket_id, created_at)
        values (%s,%s,%s,%s,%s,%s); 
        """,(str(uuid.uuid4()),jsonData["content"],request.user.id,messageMasterID,ticketID,datetime.datetime.now()))


    conn.commit()
    cursor.close()
    db.releaseConnection(conn)
    return makeReturnResponse({"status": "success", "message": "Message added succesfuly!", "data": {

    }}), 200


@server.route("/admin/tickets/getTicketMessages", methods=['POST'])
@adminLoginCheck
def getTicketMessages():
    data = jsonify(request.json)

    jsonData = data.json

    if "ticket_id" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing ticket_id',
        }
        return makeReturnResponse(__responseObject), 400
    
    
    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    ticketID = str(jsonData["ticket_id"])

    if "master_message_id" in jsonData and jsonData["master_message_id"] is not None:
        messageMasterID=str(jsonData["master_message_id"])
        cursor.execute("""
        select a.id,a.content,(select q.username from admin_users q where q.id=a.created_by )as user_username,
        (select q.name from admin_departments q where q.id=(select qq.department_id from admin_departments_members qq where qq.user_id=a.created_by))as user_department,
        created_at,updated_at from ticket_messages a where a.ticket_id =%s and a.id_master=%s
        """,[ticketID,messageMasterID])
    else:
        cursor.execute("""
        select a.id,a.content,(select q.username from admin_users q where q.id=a.created_by )as user_username,
        (select q.name from admin_departments q where q.id=(select qq.department_id from admin_departments_members qq where qq.user_id=a.created_by))as user_department,
        created_at,updated_at from ticket_messages a where a.ticket_id =%s and a.id_master is null
        """,[ticketID])

    data = []

    for i in cursor.fetchall():
        idata = {
            "id": i[0],
            "content": i[1],
            "user_username": i[2],
            "user_department": i[3],
            "created_at": i[4],
            "updated_at": i[5],
        }
        data.append(idata)


    conn.commit()
    cursor.close()
    db.releaseConnection(conn)
    return makeReturnResponse({"status": "success", "message": "Ok!", "data": data}), 200
