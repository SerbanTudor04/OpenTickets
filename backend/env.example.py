from structures import DbEnv,EmailConfig

cfg=EmailConfig()
cfg.smtp_host="localhost"
cfg.smtp_port=587
cfg.smtp_sender="Open Tickets"
cfg.smtp_username="support@example.com"
cfg.smtp_password="passwd"

cfg.imap_host="localhost"
cfg.imap_port=993
cfg.imap_username="support@example.com"
cfg.imap_password="passwd"


dbCfg=DbEnv(host="localhost",database="opentickets",username='opentickets',password='opentickets')