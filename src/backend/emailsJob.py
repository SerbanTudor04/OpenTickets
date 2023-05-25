from asyncio import sleep,run as asincio_run
from env import cfg,envFile
import traceback
import db as dbInit

server=None
db = dbInit.Database()
from logger import Logger
logger = Logger()

logger.info("Starting up the mailer service")

from emails.emails import Mailer
mailer = Mailer(cfg)

from emails.procesors import MailerProcessor
mailerProcessor=MailerProcessor()

TIMEOUT=envFile["JOBS_TIMEOUTS"]["emails"]


async def main():
    while True:
        try:
            print("Processing the inbox mails")
            mailerProcessor.processInboxMails()
            await sleep(TIMEOUT)
        except Exception as e:
            traceback.print_exc()
            logger.error("Error while processing the inbox mails "+str(e))
            break

    logger.info("Exiting the mailer service")
    exit(0)

if __name__=="__main__":
    asincio_run(main())


