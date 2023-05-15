from __main__ import server
from emails.procesors import MailerProcessor
from libs import makeReturnResponse


@server.route("/test/emailProcessor", methods=['GET'])
def tst_emailProcessor():
    a = MailerProcessor()
    a.processInboxMails()
    return makeReturnResponse({"ok": True}), 200
