from flask import Flask
from flask_cors import CORS

server = Flask(__name__)
server.config.update(
    DEBUG=True,
    SECRET_KEY="TGSWORLDisAwesome",
)
import db as dbInit


db = dbInit.Database()

server.config['CORS_HEADERS'] = 'Content-Type'
CORS(server,supports_credentials =True)
from logger import Logger

logger=Logger()

from emails.emails import EmailConfig,Mailer
from env import cfg

mailer=Mailer(cfg)   

if __name__ == '__main__':
    import endpoints.backoffice
    import endpoints.tickets
    # TODO: import test endpoints only in debug mode

    if server.config.get('DEBUG'):
        import endpoints.test
    try:
        server.run("0.0.0.0", port=8080)
    except Exception as e:
        print(e)
        exit(1)
