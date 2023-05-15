from dataclasses import dataclass


@dataclass
class DbEnv:
    host: str = "localost"
    port: int = 5432
    database: str = "postgres"
    # deepcode ignore NoHardcodedCredentials: is used as default values
    username: str = "postgres"
    # deepcode ignore NoHardcodedPasswords: is used as default values
    password: str = "postgres"
    schema = ["public"]


@dataclass
class EmailConfig:
    smtp_host: str = "localhost"
    smtp_port: int = 465
    smtp_sender: str = ""
    smtp_username: str = ""
    smtp_password: str = ""
    imap_host: str = "localhost"
    imap_port: int = 465
    imap_ssl: bool = True
    imap_username: str = ""
    imap_password: str = ""
