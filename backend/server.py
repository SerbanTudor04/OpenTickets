import atexit

from env import cfg,envFile
from flask import Flask
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
import sys

server = Flask(__name__)

server.config.update(
    DEBUG=envFile["SERVER_DEBUG"],
    SECRET_KEY=envFile["SECRET_KEY"],
    CACHE_TYPE="SimpleCache",  # Flask-Caching related configs
    CACHE_DEFAULT_TIMEOUT=300
)



import db as dbInit
db = dbInit.Database()

server.config['CORS_HEADERS'] = 'Content-Type'
CORS(server, supports_credentials=True)

from logger import Logger
logger = Logger()


from emails.emails import Mailer
mailer = Mailer(cfg)

from emails.procesors import MailerProcessor

mailerProcessor=MailerProcessor()

scheduler  = BackgroundScheduler(daemon=True)
# Explicitly kick off the background thread
scheduler.add_job(func=mailerProcessor.processInboxMails, trigger="interval", seconds=300)
scheduler.start()

atexit.register(lambda: scheduler.shutdown())


if __name__ == '__main__':
    import endpoints.backoffice
    import endpoints.tickets
    import endpoints.frontoffice

    if server.config.get('DEBUG_ENDPOINTS'):
        import endpoints.test
    try:
        server.run(envFile["SERVER_HOST"], port=envFile["SERVER_PORT"])
    except Exception as e:
        print(e)
        sys.exit(1)
