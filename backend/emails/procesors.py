import uuid
import datetime

from __main__ import db,mailer,logger as log
from libs import makeReturnResponse, genTicketCode, addInboxMessageForDepartment


class MailerProcessor:
    def __init__(self) -> None:
        self.isProcessFinished = True

    def processInboxMails(self):
        self.isProcessFinished=False
        data=mailer.fetchInbox()
        conn = db.getConnection()


        for key,value in data.items():
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

            log.error("Exception "+str(e))
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


        template_id=int(cursor.fetchone()[0])
        cursor.close()
        template_html=self.__buildEmailTemplate(template_id,conn)

        mailer.send(to=[],subject=f"[Request received] {ticketSubject}",content="",htmlContent=template_html,paremeters={
            "ticketCode": ticketCode
        })


    def __handleEmailValid(self,eId,email,conn)->str:

        pass

    def __handleEmailInvalid(self,eId,email,conn)->str:

        pass

    def __buildEmailTemplate(self,template_id:int,conn):
        cursor = conn.cursor()
        cursor.execute("SET search_path TO tickets")

        
        cursor.execute("""
            select name,content from emails_templates where id=%s
        """,[template_id])

        
        # TODO to parse ${component ''}
        # TODO to build the jinja template



        retTemplate=str(cursor.fetchone()[1])

        cursor.close()
        indexOfBlock=retTemplate.find("${")
        while indexOfBlock>=0:
            retTemplate=self.__buildEmailTemplate_FindAndReplaceComponents(indexOfBlock,retTemplate)
            
            indexOfBlock=retTemplate.find("${")

        return retTemplate
 
    def __buildEmailTemplate_FindAndReplaceComponents(self,start_index:int,template:str,conn):
        comp=""
        for i in range(start_index,template.__len__()):
            if i in ["}","\n"]:
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
                    if i in ["'","\n",'"']:
                        break 
                    compName+=comp[i]
                compName=compName.strip()
                cursor = conn.cursor()
                cursor.execute("SET search_path TO tickets")
                cursor.execute("""
                    select content from emails_blocks where upper(name) = %s
                """,[compName.upper()])

                blockContent=cursor.fetchone()[0]

                return template.replace(comp,blockContent)

        if "variable" in comp.lower():
            indexOfString=comp.find("'")
            if indexOfString==-1:
                indexOfString=comp.find('"')
            
            if indexOfString>=0:
                compName=""
                for i in range(indexOfString+1,comp.__len__()):
                    if i in ["'","\n",'"']:
                        break 
                    compName+=comp[i]
                compName=compName.strip()
                cursor = conn.cursor()
                cursor.execute("SET search_path TO tickets")
                cursor.execute("""
                    select content from emails_variables where upper(name) = %s
                """,[compName.upper()])

                blockContent=cursor.fetchone()[0]

                return template.replace(comp,blockContent) 
