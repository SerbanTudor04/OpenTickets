import uuid
import datetime

from __main__ import db,mailer,logger as log
from libs import  genTicketCode,addInboxMessageForUser

class MailerProcessor:
    def __init__(self) -> None:
        self.isProcessFinished = True

    def processInboxMails(self):
        self.isProcessFinished=False
        data=mailer.fetchInbox()
        conn = db.getConnection()


        for key,value in data.items():
            print("Executing for email address",value.subject)
            r= self.__checkIfEmailIsAssignedToTicket(value,conn)
            if  r== "NOTFOUND":
                self.__handleEmailNotFound(key,value,conn)
                # print(value.subject)

            elif r== "INVALID":
                self.__handleEmailInvalid(key,value,conn)

            else:
                self.__handleEmailValid(key,value,conn)
            conn.commit()


            

        # cursor.close()
        db.releaseConnection(conn)
        self.isProcessFinished=True

    
    def __checkIfEmailIsAssignedToTicket(self, email,conn):
        # parse subject
        cursor = conn.cursor()
        cursor.execute("SET search_path TO tickets")
        subject=str(email.subject)
        ticketCodeIndex=subject.upper().find("#TGS")


        if ticketCodeIndex<0:
            cursor.close()

            return "NOTFOUND"
        
            # verify if ticket code exists

        ticketCode=""
        for i in range(ticketCodeIndex+1,subject.__len__()):
            if subject[i] in [" ","'"]:
                break

            ticketCode+=subject[i]
        ticketCode=ticketCode.strip()
        cursor.execute("""select id from tickets where code = %s""",[ticketCode])
        rData=cursor.fetchone()
        cursor.close()
        if rData is None:
            return "INVALID" 
        return "VALID"

    def __handleEmailValid(self,eId,email,conn)->str:

        ticketCodeIndex=subject.upper().find("#TGS")
        subject=str(email.subject)

        ticketCode=""
        for i in range(ticketCodeIndex+1,subject.__len__()):
            if subject[i] in [" ","'"]:
                break
        cursor = conn.cursor()
        cursor.execute("SET search_path TO tickets")
        cursor.execute("""select id,subject,content,status from tickets where code = %s""",[ticketCode])

        tData=cursor.fetchone()

        if tData is None:
            cursor.close()
            self.__handleEmailInvalid(eId,email,conn)
            return

        ticketID = str(tData[0])
        ticketDateTime = str(datetime.datetime.now())
        ticketContent=str(tData[2])
        ticketSubject=str(tData[1])
        ticketStatus=str(tData[3])

        if ticketStatus in ["CLOSED","TEMP_CLOSED"]:
            try:
                
                cursor.execute("""
                update tickets set status='PENDING'
                where id = %s;
                            """, (ticketID))
                conn.commit()

                # insert into inbox of who is assigned to ticket, that the ticket has a new message
                cursor.execute("""
                    select user_id from tickets_users_assigned where ticket_id =%s
                            """, [ticketID])
                __subject=f"Ticket with code {ticketCode} has a new message. Please consider to check up the ticket. Ticket status has been updated to pending."
                for i in cursor.fetchall():
                    __userID=i[0]
                    addInboxMessageForUser(conn,__subject,__userID)
                conn.commit()
            except Exception as e:

                log.error("Exception at ticket status update: "+str(e))
                return  
        emailSender=email.from_.split('@')

        senderMailBox=str(emailSender[0])
        senderHost=str(emailSender[1])
        timelineContent = f"{senderMailBox}@{senderHost} has added a new message to ticket,at {ticketDateTime}. "

        cursor.execute("""
        insert into tickets_timeline (content, created_at, ticket_id,ticket_code)
        values (%s,%s,%s,%s);
        """, (timelineContent, ticketDateTime, ticketID, ticketCode))



        timelineContent = f"Ticket status has been updated to pending."

        cursor.execute("""
        insert into tickets_timeline (content, created_at, ticket_id,ticket_code)
        values (%s,%s,%s,%s);
        """, (timelineContent, ticketDateTime, ticketID, ticketCode))

        # insert into tickets_emails

        cursor.execute("""
        insert into tickets_emails (ticket_id, ticket_code, subject, content, send_date, status, from_address, mailbox,
                        "domain", email_id, "isSendByAdmin", send_by)
        values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);
        """,(ticketID, ticketCode, ticketSubject,ticketContent,str(email.date),'RECIVED',f"{senderMailBox}@{senderHost}",senderMailBox,senderHost,eId,False,None))

        conn.commit()

        cursor.execute("""
            select id from emails_templates where name='MESSAGE_ADDED_TO_TICKET'
        """)


        # mailer.createFolder('Support/Assigned',ticketCode)

        mailer.moveEmailsToFolder(eId,'Support/Assigned/'+ticketCode)

        # print("Pre build template")

        eData=cursor.fetchone()
        if eData is None: return 

        template_id=int(eData[0])
        
        cursor.close()
        
        template_html=self.__buildEmailTemplate(template_id,conn)
        
        emailContent=str(email.html)


        mailer.send(to=[f"{senderMailBox}@{senderHost}"],subject=f"[Ticket {ticketCode}] Message added with success.",content="",htmlContent=template_html,parameters={
            "ticket_code": ticketCode,
            "message": emailContent
        })


    def __handleEmailNotFound(self,eId,email,conn)->str:

        ticketID = str(uuid.uuid4())
        ticketCode = genTicketCode()
        ticketDateTime = str(datetime.datetime.now())
        ticketContent=str(email.html)
        ticketSubject=str(email.subject)
        ticketDescription=f"Email sended at {str(email.date)}"

        cursor = conn.cursor()
        cursor.execute("SET search_path TO tickets")

        try:
            cursor.execute("""
            insert into tickets.tickets (id,code, subject, description, department_id, content, created_at, status,created_by)
            values (%s,%s,%s,%s,%s,%s,%s,'OPEN',%s);
                        """, (ticketID, ticketCode, ticketSubject, ticketDescription, None, ticketContent, ticketDateTime,None))

        except Exception as e:

            log.error("Exception  at ticket creating"+str(e))
            return 

        timelineContent = f"Automatiically generated ticket on {ticketDateTime}."

        cursor.execute("""
        insert into tickets_timeline (content, created_at, ticket_id,ticket_code)
        values (%s,%s,%s,%s);
        """, (timelineContent, ticketDateTime, ticketID, ticketCode))


        emailSender=email.from_.split('@')

        senderMailBox=str(emailSender[0])
        senderHost=str(emailSender[1])
        timelineContent = f"An email was sended by {senderMailBox}@{senderHost}."

        cursor.execute("""
        insert into tickets_timeline (content, created_at, ticket_id,ticket_code)
        values (%s,%s,%s,%s);
        """, (timelineContent, ticketDateTime, ticketID, ticketCode))

        # insert into tickets_emails

        cursor.execute("""
        insert into tickets_emails (ticket_id, ticket_code, subject, content, send_date, status, from_address, mailbox,
                        "domain", email_id, "isSendByAdmin", send_by)
        values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);
        """,(ticketID, ticketCode, ticketSubject,ticketContent,str(email.date),'RECIVED',f"{senderMailBox}@{senderHost}",senderMailBox,senderHost,eId,False,None))


        cursor.execute("""
            select id from emails_templates where name='CREATE_TICKET_VIA_EMAIL'
        """)

        conn.commit()

        mailer.createFolder('Support/Assigned',ticketCode)

        mailer.moveEmailsToFolder(eId,'Support/Assigned/'+ticketCode)

        # print("Pre build template")


        template_id=int(cursor.fetchone()[0])
        cursor.close()
        template_html=self.__buildEmailTemplate(template_id,conn)
        # print(template_html)
        # print("Pre send mail" , ticketCode)

        mailer.send(to=[f"{senderMailBox}@{senderHost}"],subject=f"[Request received] {ticketSubject}",content="",htmlContent=template_html,parameters={
            "ticket_code": ticketCode
        })


    def __handleEmailInvalid(self,eId,email,conn)->str:
        # TODO: "Do "handleEmailInValid" in emails procesor"
        pass

    def __buildEmailTemplate(self,template_id:int,conn):
        cursor = conn.cursor()
        cursor.execute("SET search_path TO tickets")

        
        cursor.execute("""
            select name,content from emails_templates where id=%s
        """,[template_id])


        retTemplate=str(cursor.fetchone()[1])

        cursor.close()
        indexOfBlock=retTemplate.find("${")
        while indexOfBlock!=-1:
            # print("indexOfBlock",indexOfBlock)
            retTemplate=self.__buildEmailTemplate_FindAndReplaceComponents(indexOfBlock,retTemplate,conn)
            
            indexOfBlock=retTemplate.find("${")

        return retTemplate
 
    def __buildEmailTemplate_FindAndReplaceComponents(self,start_index:int,template:str,conn):
        comp=""
        for i in range(start_index,template.__len__()):
            if template[i] in ["}","\n"]:
                comp+=template[i]
                break
            comp+=template[i]

        if "block" in comp.lower():
            indexOfString=comp.find("'")
            if indexOfString==-1:
                indexOfString=comp.find('"')
            
            if indexOfString>=0:
                compName=""
                for i in range(indexOfString+1,comp.__len__()):
                    if comp[i] in ["'","\n",'"']:
                        break 
                    compName+=comp[i]
                compName=compName.strip()
                cursor = conn.cursor()
                # print("search compname",compName)
                cursor.execute("SET search_path TO tickets")
                cursor.execute("""
                    select content from emails_blocks where upper(name) = %s
                """,[compName.upper()])
                data=cursor.fetchone()
                # print("data val",data)
                if data is not None:
                    blockContent=str((data)[0])
                    return template.replace(comp,blockContent)
                return template.replace(comp,"")

        elif "variable" in comp.lower():
            indexOfString=comp.find("'")
            if indexOfString==-1:
                indexOfString=comp.find('"')
            
            if indexOfString>=0:
                compName=""
                for comp[i] in range(indexOfString+1,comp.__len__()):
                    if i in ["'","\n",'"']:
                        break 
                    compName+=comp[i]
                compName=compName.strip()
                cursor = conn.cursor()

                cursor.execute("SET search_path TO tickets")
                cursor.execute("""
                    select content from emails_variables where upper(name) = %s
                """,[compName.upper()])
                data=cursor.fetchone()
                # print("data val",data)
                if data is not None:
                    blockContent=str((data)[0])
                    return template.replace(comp,blockContent)
                return template.replace(comp,"")
       
        return template
