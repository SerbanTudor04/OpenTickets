import sys
import psycopg2
import os
import random
import string
import json


def askInputOfUser(question: str, default_value: any = "", is_empty: bool = True, validAnswers: list = []) -> str:
    while True:
        try:
            answer = str(input(question))
            answer_size = len(answer)
            if answer_size > 0:
                if len(validAnswers) > 0 and answer.upper() not in validAnswers:
                    raise ValueError(
                        f"Answer {answer} is not an appropiate input.")
                return answer
            if is_empty == False:
                raise ValueError("Field can't be empty.")
            answer = default_value
        except ValueError as e:
            print(str(e))
            continue
        break
    return answer


def generateSecretKey(length: int = 16):
    letters = string.ascii_lowercase
    return "OT_"+''.join(random.choice(letters) for _ in range(length))


# END AUXILIAR FUNCTIONS


def main():
    """
    expect something like:
    python script.py silent 
    """
    try:
        mode = sys.argv[1]
    except IndexError:
        print("Starting in interactive mode.")
        mode = ""
    config = {}
    if mode.lower() == "silent":
        config = silent()
    else:
        config = interactive()

    if len(config) == 0:
        print("ERROR -> Can't obtain config.")

    doInstall(config)


def interactive():
    db_host = askInputOfUser("Database host [localhost]: ", "localhost")
    db_port = askInputOfUser("Database port [5432]: ", 5432)
    db_name = askInputOfUser("Database name [postgres]: ", "postgres")
    db_username = askInputOfUser("Database username [postgres]: ", "postgres")
    db_password = askInputOfUser("Database password [postgres]: ", "postgres")
    db_schemas = (askInputOfUser(
        "Database schemas [public] (comma separeted): ", "public")).split(",")
    db_schemas = [i.strip() for i in db_schemas]
    smtp_host = askInputOfUser("Email SMTP host [localhost]: ", "localhost")
    smtp_port = askInputOfUser("Email SMTP port [587]: ", 587)
    smtp_ssl = askInputOfUser("Email SMTP ssl [Y/n]: ", "Y", False, ["Y", "N"])
    smtp_sender = askInputOfUser(
        "Email SMTP sender name [Open Tickets Team]: ", "Open Tickets Team")
    smtp_username = askInputOfUser(
        "Email SMTP username [support@opentickets.com]: ", "support@opentickets.com", is_empty=False)
    smtp_password = askInputOfUser(
        "Email SMTP password [superpassword]: ", "superpassword", is_empty=False)
    imap_host = askInputOfUser("Email IMAP host [localhost]: ", "localhost")
    imap_port = askInputOfUser("Email IMAP port [993]: ", 993)
    imap_ssl = askInputOfUser("Email IMAP ssl [Y/n]: ", "Y", False, ["Y", "N"])
    imap_username = askInputOfUser(
        "Email IMAP username [support@opentickets.com]: ", "", False)
    imap_password = askInputOfUser(
        "Email IMAP password [superpassword]: ", "", False)

    print("Config obtained successfuly.")
    print("CONFIG:")
    print(f"""
    # Database:
    \t Host: {db_host}
    \t Port: {db_port}
    \t Name: {db_name}
    \t Username: {db_username}
    \t Password: ************
    \t Schemas: {db_schemas}
    
    # Emails:

    \t # SMTP:
    \t\t Host: {smtp_host}
    \t\t Port: {smtp_port}
    \t\t SSL: {smtp_ssl}
    \t\t Username: {smtp_username}
    \t\t Password: ************
    \t\t Sender Name: {smtp_sender}

    \t # IMAP:
    \t\t Host: {imap_host}
    \t\t Port: {imap_port}
    \t\t SSL: {imap_ssl}
    \t\t Username: {imap_username}
    \t\t Password: ************
    
    """)

    return {
        "db_host": db_host,
        "db_port": db_port,
        "db_name": db_name,
        "db_username": db_username,
        "db_password": db_password,
        "db_schemas": db_schemas,
        "smtp_host": smtp_host,
        "smtp_port": smtp_port,
        "smtp_ssl": smtp_ssl,
        "smtp_sender": smtp_sender,
        "smtp_username": smtp_username,
        "smtp_password": smtp_password,
        "imap_host": imap_host,
        "imap_port": imap_port,
        "imap_ssl": imap_ssl,
        "imap_username": imap_username,
        "imap_password": imap_password,
    }


def silent():
    if len(sys.argv) < 18:
        silent_help()
        sys.exit(1)
    db_host = sys.argv[2]
    db_port = sys.argv[3]
    db_name = sys.argv[4]
    db_username = sys.argv[5]
    db_password = sys.argv[6]
    db_schemas = str(sys.argv[7]).split(",")
    db_schemas = [i.strip() for i in db_schemas]
    smtp_host = sys.argv[8]
    smtp_port = sys.argv[9]
    smtp_ssl = sys.argv[10]
    smtp_sender = sys.argv[11]
    smtp_username = sys.argv[12]
    smtp_password = sys.argv[13]
    imap_host = sys.argv[14]
    imap_port = sys.argv[15]
    imap_ssl = sys.argv[16]
    imap_username = sys.argv[17]
    imap_password = sys.argv[18]

    print("Config obtained successfuly.")
    print("CONFIG:")
    print(f"""
    # Database:
    \t Host: {db_host}
    \t Port: {db_port}
    \t Name: {db_name}
    \t Username: {db_username}
    \t Password: ************
    \t Schemas: {db_schemas}
    
    # Emails:

    \t # SMTP:
    \t\t Host: {smtp_host}
    \t\t Port: {smtp_port}
    \t\t SSL: {smtp_ssl}
    \t\t Username: {smtp_username}
    \t\t Password: ************
    \t\t Sender Name: {smtp_sender}

    \t # IMAP:
    \t\t Host: {imap_host}
    \t\t Port: {imap_port}
    \t\t SSL: {imap_ssl}
    \t\t Username: {imap_username}
    \t\t Password: ************
    
    """)

    return {
        "db_host": db_host,
        "db_port": db_port,
        "db_name": db_name,
        "db_username": db_username,
        "db_password": db_password,
        "db_schemas": db_schemas,
        "smtp_host": smtp_host,
        "smtp_port": smtp_port,
        "smtp_ssl": smtp_ssl,
        "smtp_sender": smtp_sender,
        "smtp_username": smtp_username,
        "smtp_password": smtp_password,
        "imap_host": imap_host,
        "imap_port": imap_port,
        "imap_ssl": imap_ssl,
        "imap_username": imap_username,
        "imap_password": imap_password,
    }


def silent_help():
    print("""Here is a an example of calling the script:
python install.py silent <db_host> <db_port> <db_name> <db_username> <db_password> <db_schemas (comma separated)> <smtp_host> <smtp_port> <smtp_ssl> <smtp_sender> <smtp_username> <smtp_password> <imap_host> <imap_port> <imap_ssl> <imap_username> <imap_password> 
or 
install.exe silent <db_host> <db_port> <db_name> <db_username> <db_password> <db_schemas> <smtp_host> <smtp_port> <smtp_ssl> <smtp_sender> <smtp_username> <smtp_password> <imap_host> <imap_port> <imap_ssl> <imap_username> <imap_password> 
    """)


def doInstall(cfg: dict):
    # database part:
    jsonOutput = {}
    try:
        dbConn = psycopg2.connect(database=cfg["db_name"], user=cfg["db_username"],
                                  password=cfg["db_password"], host=cfg["db_host"], port=cfg["db_port"])
    except Exception as err:
        print("An error occured while trying to connect to database:")
        print(str(err))
        sys.exit(1)

    try:
        sqlFile = open(os.path.join(os.getcwd(), "sql", "tables.sql"), 'r')

    except Exception as e:
        print("ERROR -> Couldn't find sql files. (tables)")
        print(e)
        sys.exit(1)

    sqlContent = sqlFile.read()
    sqlFile.close()
    crs = dbConn.cursor()
    DB_QUERY_STRING = "SET search_path TO "

    for i in cfg["db_schemas"]:
        DB_QUERY_STRING += f'"{i}",'
    DB_QUERY_STRING = DB_QUERY_STRING[:-1]

    # EXECUTE sql to activate requirements
    try:
        print("Start intalling database extensions")
        crs.execute('CREATE EXTENSION "uuid-ossp";')
    except Exception as err:
        print(err)
        dbConn.rollback()
    else:
        print("Installation of extensison has finished with success")

    # deepcode ignore Sqli: string is generated by script and also is runned by an admin
    crs.execute(DB_QUERY_STRING)
    try:
        # print(sqlContent)
        print("Install application in database")
        crs.execute(sqlContent, [])
        dbConn.commit()
        print("Application tables has been created with success.")
    except Exception as e:
        print(e)
    try:
        sqlDataFile = open(os.path.join(os.getcwd(), "sql", "data.sql"), 'r')
    except Exception as e:
        print("ERROR -> Couldn't find sql files. (data)")
        print(e)
        sys.exit(1)
    sqlContent = sqlDataFile.read()
    sqlDataFile.close()

    try:
        # print(sqlContent)
        print("Install application in database")
        crs.execute(sqlContent, [])
        dbConn.commit()
        print("Application default data has been created with success.")
    except Exception as e:
        print(e)


    crs.close()

    dbConn.close()
    jsonOutput["database"] = {
        "host": cfg["db_host"],
        "port": cfg["db_port"],
        "name": cfg["db_name"],
        "username": cfg["db_username"],
        "password": cfg["db_password"],
        "schema": cfg["db_schemas"],
    }

    # TODO to implement a validation for email
    jsonOutput["email"] = {
        "imap": {
            "host": cfg["imap_host"],
            "port": cfg["imap_port"],
            "username": cfg["imap_username"],
            "password": cfg["imap_password"],
            "ssl": cfg["imap_ssl"],
        },
        "smtp": {
            "host": cfg["smtp_host"],
            "port": cfg["smtp_port"],
            "username": cfg["smtp_username"],
            "password": cfg["smtp_password"],
            "ssl": cfg["smtp_ssl"],
            "sender_name": cfg["smtp_sender"],
        }
    }
    jsonOutput["SECRET_KEY"] = generateSecretKey()
    jsonOutput["SERVER_HOST"] = "0.0.0.0"
    jsonOutput["SERVER_PORT"] = 8080
    jsonOutput["SERVER_DEBUG"] = False
    jsonOutput["DEBUG_ENDPOINTS"] = False

    jsonStringOutput = json.dumps(jsonOutput)

    jsonFilePath = os.path.join(os.getcwd(), 'output', 'env.json')

    jsonFile = open(jsonFilePath, 'w')
    jsonFile.write(jsonStringOutput)
    jsonFile.close()

    print(f"""
Installation has been completed!

Env file: {jsonFilePath}
Secret key: {jsonOutput["SECRET_KEY"]}
* Please consider not sharing the secret key.
* In order to complete the installation please copy the env file into backend root directory.
* For future operations with scripts from install, please consider not removing env file or move it. Just a simple copy :)
    """)

    return


if __name__ == "__main__":
    main()
