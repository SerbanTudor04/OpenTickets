from env import cfg
from flask import Flask
from flask_cors import CORS
from flask_caching import Cache

server = Flask(__name__)

server.config.update(
    DEBUG=True,
    SECRET_KEY="TGSWORLDisAwesome",
    CACHE_TYPE="SimpleCache",  # Flask-Caching related configs
    CACHE_DEFAULT_TIMEOUT=300
)

cache = Cache(server)


import db as dbInit
db = dbInit.Database()

server.config['CORS_HEADERS'] = 'Content-Type'
CORS(server, supports_credentials=True)

from logger import Logger
logger = Logger()


from emails.emails import Mailer
mailer = Mailer(cfg)

if __name__ == '__main__':
    import endpoints.backoffice
    import endpoints.tickets

    if server.config.get('DEBUG'):
        import endpoints.test
    try:
        server.run("0.0.0.0", port=8080)
    except Exception as e:
        print(e)
        exit(1)
