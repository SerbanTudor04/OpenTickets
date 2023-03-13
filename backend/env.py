import json
import os

from structures import DbEnv, EmailConfig

try:
    envFile = json.load(
        open(os.path.join(os.getcwd(), 'env.json')))
except Exception as e:
    print("Error loading environment")
    print(str(e))
    exit(1)


cfg = EmailConfig()
cfg.smtp_host = envFile["email"]["smtp"]["host"]
cfg.smtp_port = envFile["email"]["smtp"]["port"]
cfg.smtp_sender = envFile["email"]["smtp"]["sender_name"]
cfg.smtp_username = envFile["email"]["smtp"]["username"]
cfg.smtp_password = envFile["email"]["smtp"]["password"]

cfg.imap_host = envFile["email"]["imap"]["host"]
cfg.imap_port = envFile["email"]["imap"]["port"]
cfg.imap_username = envFile["email"]["imap"]["username"]
cfg.imap_password = envFile["email"]["imap"]["password"]


dbCfg = DbEnv(host=envFile["database"]["host"], database=envFile["database"]["name"], port=envFile["database"]["port"],
              username=envFile["database"]["username"], password=envFile["database"]["password"])

DB_QUERY_STRING="SET search_path TO "

for i in envFile["database"]["schema"]:
    DB_QUERY_STRING+=f"{i},"

# remove the , from the last caracter
DB_QUERY_STRING=DB_QUERY_STRING[:-1]