from env import cfg,envFile
from flask import Flask
from flask_cors import CORS
import sys

server = Flask(__name__)

server.config.update(
    DEBUG=envFile["SERVER_DEBUG"],
    SECRET_KEY=envFile["SECRET_KEY"],
    CACHE_TYPE="SimpleCache",  # Flask-Caching related configs
    CACHE_DEFAULT_TIMEOUT=300,
    DEBUG_ENDPOINTS=envFile["DEBUG_ENDPOINTS"]
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
