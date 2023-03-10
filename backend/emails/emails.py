from __main__ import logger

from redmail import EmailSender
# from imapclient import IMAPClient
from imap_tools import MailBox
import ssl
import email
# import html2text
from structures import EmailConfig


class Mailer:
    def __init__(self,config:EmailConfig):
        self.config=config

        self.smtp_connection=None
        self.imap_connection=None
        self.__init__connection()

    def __init__connection(self):
        try:

            self.smtp_connection=EmailSender(self.config.smtp_host, self.config.smtp_port,self.config.smtp_username,self.config.smtp_password)
            print("Smtp connection established")
        except Exception as e:
            print("Smtp connection failed")
            print(e)
        
        try:
            
            ctx = ssl._create_unverified_context()
            # self.imap_connection=IMAPClient(self.config.imap_host, self.config.imap_port,use_uid=True,ssl_context=ctx)
            # self.imap_connection.login(self.config.imap_username,self.config.imap_password)
            self.imap_connection=MailBox(self.config.imap_host, self.config.imap_port,ssl_context=ctx).login(self.config.imap_username,self.config.imap_password)
            print("Imap connection established")
        except Exception as e:
            print("Imap connection failed")
            print(e)
        
        

    def send(self,to:list[str],subject,content:str="",htmlContent:str="",parameters:dict={}):
        print("params",parameters)
        self.smtp_connection.send(
            subject=subject,
            sender=self.config.smtp_sender,
            receivers=to,
            text=content,
            html=htmlContent,
            body_params=parameters
        )


    def test_connection(self,send_emails:list[str]):
        print("Sending test emails...")
        subject = "TGS Support"
        message="This is a test message automatically generated from the application."
        html="""
            <html>
            <head></head>
            <body>
                <p>This is a test email</p>
                <p>With respect,</p>
                <p>TGS Software Team</p>
                
            </body>
            </html>
            """
        self.send(send_emails, subject, message,htmlContent=html)

    def fetchInbox(self)->dict:
        retData={}
        try:
            for msg in self.imap_connection.fetch(charset='utf8'):
                retData[msg.uid]=msg
        except Exception as err:
            logger.error("Failed to fetch messages from imbox with error: "+str(err))
        return retData
    



    def createFolder(self,path:str,name:str)->bool:
        """
        Returns True if the given folder has been created, False otherwise

        param path: The path to the folder separated by /
        param name: The name of the folder
        
        """
        path=path.replace('/','.')
        try:
            self.imap_connection.folder.create(f"{path}.{name}")
            return True
        except Exception as e:
            print(e)
            return False        
    
    def deleteFolder(self, path)->bool:
        """
        Returns True if the given folder has been created, False otherwise

        param path: The path to the folder separated by /
        
        """
        path=path.replace('/','.')

        try:
            self.imap_connection.folder.delete(path)
            return True
        except Exception as e:
            print(e)
            return False        
    
    def moveEmailsToFolder(self,emailsID:list,path:str):
        """
        Returns True if the given email was moved, False otherwise

        param path: The path to the folder separated by /
        
        """
        try:
            path=path.replace('/','.')
            self.imap_connection.move(emailsID,path)
            return True
        except Exception as e:
            print(e)
            return False        

