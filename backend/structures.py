from dataclasses import dataclass

@dataclass
class DbEnv:
    host:str="localost"
    port:int=5432
    database:str="postgres"
    username:str="postgres"
    password:str="postgres"