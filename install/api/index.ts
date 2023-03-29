import express from 'express';
import { rename,createWriteStream } from 'fs';
import  cors from "cors"
import helmet from "helmet";
import bodyParser from 'body-parser';
import csurf from "csurf"
// Initialize the express engine
const app: express.Application = express();
 
app.use(bodyParser.json());

app.use(helmet());
app.use(csurf())
// Take a port 3000 for running server.
const port: number = 3000;
 
app.use(cors())

// Handling '/' Request
app.get('/health', (_req, _res) => {
    _res.send("Very");
});

app.post('/',(_req,_res)=>{
        
    let data={
        db_ip:_req.body.db_ip,
        db_port:_req.body.db_port,
        db_name:_req.body.db_name,
        db_schemas:_req.body.db_schemas,
        db_username:_req.body.db_username,
        db_password:_req.body.db_password,
        smtp_host:_req.body.smtp_host,
        smtp_port:_req.body.smtp_port,
        smtp_username:_req.body.smtp_username,
        smtp_password:_req.body.smtp_password,
        smtp_sendername:_req.body.smtp_sendername,
        smtp_ssl:_req.body.smtp_ssl,
        imap_host:_req.body.imap_host,
        imap_port:_req.body.imap_port,
        imap_username:_req.body.imap_username,
        imap_password:_req.body.imap_password,
        imap_ssl:_req.body.imap_ssl,
        admin_email:_req.body.admin_email,
        admin_password:_req.body.admin_password,
        admin_repeatpassword:_req.body.admin_repeatpassword,
        backend_host:_req.body.backend_host,
        backend_port:_req.body.backend_port,
        backend_location:_req.body.backend_location,
        }
    
        
    
    // console.log(_req.body);
    _res.send("Ok")
    // const stream=createWriteStream(apiPath)
})
 
// Server setup
app.listen(port, () => {
    console.log(`http://localhost:${port}/`);
});