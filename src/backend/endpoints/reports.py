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