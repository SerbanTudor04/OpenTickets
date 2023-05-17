# Open Tickets
A free support software for any little bussiness.
Please keep in mind, that this application is under development, and every pre-release could be unstable or certain function wont work.

## Issues
For any issue of bug you find, please consider open an issue [here](https://github.com/SerbanTudor04/OpenTickets/issues)

## Installation requirements
There are the requirements:
- PostgresSQL 13 or higher.
- Python 3.11.x.
- NodeJs 18 or greater stable version.

## How to install
This are the steps before an official release and manual installation is required at the moment. This are the steps:
1. Create a new fresh Postgres 13 or higher database and a schema if you want, name them as you want.
```sql
create database opentickets_production;
```
2. Create a new user with create rights on database and schema, here is an example.
```sql
-- please don't use in a production environment a password same as the username.
-- feel free to replace any name with what you want.
create user opentickets_production with password 'opentickets_production'; 
grant all on opentickets_production to opentickets_production;
```
3. Install on database uuid extension.
```sql
-- this should be runned by a superuser
CREATE EXTENSION "uuid-ossp";
```
4. `cd` in the `<opentickets project directory>` and run the following scripts from a bash.
```bash
# python or python3.x or python3 depends on the OS type and the number of python instances
python -m venv ./venv_build
# if you are on the windows, remove the source word and change "bin" with "Scripts".
source ./venv_build/bin/activate
pip3 install -r ./install/raw/requirements.txt
cd install
# this is not runnable from a windows CMD, consider using GIT Bash.
./build.bash
# this will build as executable the python scripts, and you'll find them under install/bin
cd bin
./install
# and follow the CLI instructions
# also you can run it silently
./install silent 
# after this a help message will popup with all the configurations

# next, after the the scripts has been finished with success
cp ./output/env.json ../../backend
# or if you are on the windows, simply copy the env.json from the output folder into the backend.

# and to finalize the installation run , in install/bin:
./create_admin_user
# also you can run it silently
./create_admin_user silent 
# after this a help message will popup with all the configurations
```

## How to run the program
Currently there isn't a standard running form, we recommand using the python as a Daemon service.
Also you can serve the statics of the application using `Httpd` or `Nginx`.

## Contributing
Any contribution is welcomed. Please feel free tom open any issue or pull request with your features or any kind of ideea.


## License
The license full can be found [here](./LICENSE)

OpenTickets a helpdesk system
Copyright (C) 2023  Serban Tudor Gabriel

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.