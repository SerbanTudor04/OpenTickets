from __main__ import server, db, logger,mailer
import uuid
from flask import request, jsonify
from libs import makeReturnResponse, adminLoginCheck, superUserCheck, genTicketCode, addInboxMessageForDepartment
import psycopg2.errors as dbErrors
import datetime
from env import DB_QUERY_STRING

log = logger


def buildReportTree(conn,master_id:int= -1):
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)
    cursor.execute("""
    SELECT id, "name", page_id, master_id FROM reports_tree a where master_id=%s order by a.order
    """,[master_id])
    data=[]

    for row in cursor.fetchall():
        l_row={
            "id":row[0],
            "name":row[1],
            "page_id":row[2],
            "master_id":row[3],
            "childrens":None
        }
        cursor.execute("""
            select count(*) from reports_tree where master_id=%s
        """,[l_row["id"]])
        HAS_CHILDS=cursor.fetchone()[0]
        # print(HAS_CHILDS)
        if HAS_CHILDS > 0:
            l_row["childrens"]=buildReportTree(conn,l_row["id"])

        data.append(l_row)

    cursor.close()
    # print("interdata",data)
    return data

@server.route("/admin/reports/getReportsTree", methods=['GET'])
@adminLoginCheck
@superUserCheck
def getReportsTree():
    conn = db.getConnection()
    data=buildReportTree(conn)
    # print(data)
    db.releaseConnection(conn)
    return makeReturnResponse({"status": "success", "message": "Ok", "data":data}), 200

@server.route("/admin/reports/getPageDetails", methods=['POST'])
@adminLoginCheck
@superUserCheck
def getPageDetails():

    data = jsonify(request.json)

    jsonData = data.json

    if "page_id" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing page_id',
        }
        return makeReturnResponse(__responseObject), 400

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    cursor.execute("""
        SELECT id, "name", title, description FROM reports_pages where id=%s;
    """,[jsonData["page_id"]])

    q= cursor.fetchone()

    if q is None:
        cursor.close()
        db.releaseConnection(conn)

        return makeReturnResponse({"status": "invalid", "message": "Page not found"}), 400

    data={
        "id":q[0],
        "name":q[1],
        "title":q[2],
        "description":q[3]
    }
    cursor.close()

    db.releaseConnection(conn)
    return makeReturnResponse({"status": "success", "message": "Ok", "data":data}), 200


@server.route("/admin/reports/getPageComponents", methods=['POST'])
@adminLoginCheck
@superUserCheck
def getPageComponents():

    data = jsonify(request.json)

    jsonData = data.json

    if "page_id" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing page_id',
        }
        return makeReturnResponse(__responseObject), 400

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    cursor.execute("""
       SELECT id, "name", "type", html_code, sql_code, master_id, page_id, title FROM reports_pages_components where page_id=%s;

    """,[jsonData["page_id"]])

    q= cursor.fetchall()

    if q is None:
        cursor.close()
        db.releaseConnection(conn) 
        return makeReturnResponse({"status": "invalid", "message": "Page doesn't have components"}), 400

    data=[]
    columns = [desc[0] for desc in cursor.description]
    
    for i in q:
        l_row={}
        for column in columns:
            l_row[column]=i[columns.index(column)]
        data.append(l_row)

    cursor.close()
    db.releaseConnection(conn)
    return makeReturnResponse({"status": "success", "message": "Ok", "data":data}), 200


@server.route("/admin/reports/getPageComponentData", methods=['POST'])
@adminLoginCheck
@superUserCheck
def getPageComponentData():

    q_data = jsonify(request.json)

    jsonData = q_data.json

    if "component_id" not in jsonData:
        __responseObject = {
            'status': 'invalid',
            'message': 'Missing component_id',
        }
        return makeReturnResponse(__responseObject), 400

    conn = db.getConnection()
    cursor = conn.cursor()
    cursor.execute(DB_QUERY_STRING)

    cursor.execute("""
        SELECT html_code, sql_code FROM reports_pages_components where id=%s;
    """,[jsonData["component_id"]])

    q= cursor.fetchone()

    if q is None:
        cursor.close()
        db.releaseConnection(conn) 
        return makeReturnResponse({"status": "invalid", "message": "Page doesn't have components"}), 400
   
    HTML_CODE=q[0]

    if HTML_CODE is None or len(str(HTML_CODE))==0:
        HTML_CODE=""


    data={
        "html":HTML_CODE,
        "query":None
    }

    SQL_CODE=q[1]
    q_data=[]
    if SQL_CODE is not None and  len(SQL_CODE) >0:
        # deepcode ignore Sqli: it's internal sql code, witch is written by a dev
        cursor.execute(str(SQL_CODE))

        columns = [desc[0] for desc in cursor.description]

        q_data=cursor.fetchall()

        data["query"]={
            "columns":columns,
            "data":q_data
            
        }
    # print(data)
    cursor.close()
    db.releaseConnection(conn)
    return makeReturnResponse({"status": "success", "message": "Ok", "data":data}), 200