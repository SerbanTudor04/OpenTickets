# 0.9.0
## Features:
- Migrate from `jsx` to `tsx`
- Add Documentation page with complete features.
- Implement partially reports users balance
- Migrate management part from the web_admin to a hole new application web_superuser
- Remove todo comment
- Add when a message is sent, notify every user that has any right on this ticket
- Added ability to send email to the creator of the ticket or to add message to inbox of the creator.
# Fixes:
- Fix typo
- Fix AMgmDeparment table view error
- Fix tickets on message send when a message is send
- Fix bug in server.py in for test endpoints
# 0.8.1
## Fixes:
- Added missing default data on installation
- Added update indexes of tables

# 0.8.0
## Features:
- Added a view in `managment` on admin panel to create/update/or delete email templates
- Added APIs for crud of email templates.
## Fixes:
- Fix sidebar `dashboard` icon.
- Fix `management/config` view, in which superuser validation doesn't exists.
# 0.7.0
- Added `web_install` in order to serve the frontend for the installation application 

# 0.6.0
## Features:
- Added a view in `managment` on admin panel to update configs values.
## Fixes:
- Fix security on users actions, add superUser middleware to apis, which was missing
- Fix in pages redirects link from `/admin` to `/`

# 0.5.2
## Features:
- Added capability to customize prefix of the tickets code.

# 0.5.1
## Fixes
- Add missing libraries from backend
# 0.5.0
## Features
- Added a system for config file loading, by removing static config from `env.py` to `env.json`
- Added ability to setup the schema for querying database by dynamically setting up in `env.json`
- Added app_config table in database.
- Added functionality to cache responses of routes.
- Added route for getting application title from app_config 
- Added in frontend:
    - Dynamically loading navbar title from app title
    - Dynamically load application header title from backend
    - Change login token name

# 0.4.0
## Features
- Added handling for emails in which has an invalid ticket code in subject.
- Added template for emails with invalid ticket code in subject.

# 0.3.1
## Fixes
- Fix getting open or released tickets query from geting your own tickets


# 0.3.0
## Features
- Added handling for emails in which is found in subject the ticket code.
- Added template for email
## Fixes
- Fix error log at ` log.error("Exception"+str(e))` to ` log.error("Exception  at ticket creating"+str(e))`, to be more informative in table of logs

# 0.2.1
## Fixes:
- Fix in emails/processor/MailerProcessor  from `if "variable" in comp.lower():` to `elif "variable" in comp.lower():` for a little optimization.


# 0.2.0
## Features
- Finished system for mails that are send and not directly connected to a ticket.
- Build databse dynamically templating system for standard emails.
## Fixes:
- Small typos fixes in env.example.py

# 0.1.0
## Features
- Added ui interface with react in the admin interface
- Admin interface:
    - Handle ticket creation,editing and deleting
    - Handle authentication
    - Added management interface for super users:
        - Added user creation system 
        - Added user updating system
        - Added user deleting system
    - Tickets handling page:
        - Added my created tickets view(CRUD)
        - Added my pending to solve tickets view(CRUD)
        - Added tickets in pending to be assigned view (CRUD)
- Backend:
    -   Added system for database connections pooling
    - Added support for postgresql
    - Added support for endpoints
    - Split endpoints into multiple files
    - Create a logging system 
    - Added authentication system, with cookie support and a databased stored sessions
    - Implement middlewares for handling user authentication and rights
    - Implement backend support for tickets CRUD
    - Implement emails processing system, which can be runned on scheduler
