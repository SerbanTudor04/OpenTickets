import sys
import psycopg2
import os
import json
import uuid

from werkzeug.security import generate_password_hash



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

def silent_help():
    print("""Here is a an example of calling the script:
python create_admin_user.py silent <user_email> <user_username> <user_first_name> <user_last_name> <user_password> 
or 
create_admin_user.exe silent <user_email> <user_username> <user_first_name> <user_last_name> <user_password> 
    """)


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

    print("Data obtained successfuly.")

    print(f"""
    Email: {config['user_email']}
    Username: {config['user_username']}
    First name: {config['user_first_name']}
    Last name: {config['user_last_name']}
    Password: ************
        """)

    doCreateUser(config)


def interactive():
    user_email = askInputOfUser(        "Email [support@opentickets.com]: ", "support@opentickets.com")
    user_username = askInputOfUser("Username [admin]: ", "admin")
    user_first_name = askInputOfUser("First name [Open]: ", "Open")
    user_last_name = askInputOfUser("Last name [Tickets]: ", "Tickets")
    user_password = askInputOfUser("Password [admin]: ", "admin")

    return {
        "user_email": user_email,
        "user_username": user_username,
        "user_first_name": user_first_name,
        "user_last_name": user_last_name,
        "user_password": user_password,
    }


def silent():
    if len(sys.argv) < 7:
        silent_help()
        sys.exit(1)
    user_email=sys.argv[2]
    user_username=sys.argv[3]
    user_first_name=sys.argv[4]
    user_last_name=sys.argv[5]
    user_password=sys.argv[6]
    return {
        "user_email": user_email,
        "user_username": user_username,
        "user_first_name": user_first_name,
        "user_last_name": user_last_name,
        "user_password": user_password,
    }


def doCreateUser(userdata):
    print("Obtain env file")

    envFilePath = os.path.join(os.getcwd(), 'output', 'env.json')
    envFile = open(envFilePath, 'r')
    print("File obtained with success")

    jsonEnvFile = json.loads(envFile.read())
    envFile.close()
    try:
        dbData = jsonEnvFile["database"]
        print("Connecting to database")
        dbConn = psycopg2.connect(database=dbData["name"], user=dbData["username"], password=dbData["password"],
                                  host=dbData["host"], port=dbData["port"])
    except Exception as e:
        print("ERROR -> An error occured while trying to connect to database!")
        print(e)
        sys.exit(1)
    print("Connection has been established with success.")
    userData = {
        "id": str(uuid.uuid4()),
        "username": userdata["user_username"],
        "password": generate_password_hash(userdata["user_password"]),
        "email": userdata["user_email"],
        "first_name": userdata["user_first_name"],
        "last_name": userdata["user_last_name"],
        "is_su": True
    }

    DB_QUERY_STRING = "SET search_path TO "

    for i in dbData["schema"]:
        DB_QUERY_STRING += f"{i},"
    DB_QUERY_STRING = DB_QUERY_STRING[:-1]

    crs=dbConn.cursor()
    crs.execute(DB_QUERY_STRING)

    crs.execute(f"""
    INSERT INTO admin_users
    (id, username, "password", email, first_name, last_name, created_at, updated_at, is_su)
    VALUES(%s, %s, %s, %s, %s, %s, now(), now(), %s)
    """, (userData["id"], userData["username"], userData["password"], userData["email"], userData["first_name"], userData["last_name"], userData["is_su"]))
    # creates balance
    crs.execute("""
    INSERT INTO reports_users_balances
    (user_id, score)
    VALUES(%s, 0);

""",(userData["id"]))

    dbConn.commit()
    crs.close()
    dbConn.close()


if __name__ == "__main__":
    main()


