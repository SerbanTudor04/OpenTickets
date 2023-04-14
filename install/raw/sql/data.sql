INSERT INTO emails_templates ("content",created_at,updated_at,created_by,updated_by,"name",is_name_editable,"label") VALUES
	 ('<html>
    <head>

    </head>
    <body>
        <div class="content">
           Your ticket code is <strong>{{ ticket_code }}</strong>
        </div>
        <div class="footer">
            ${block ''EMAIL_FOOTER''}
        </div>
    </body>
</html>','2023-03-06 21:01:13.991202','2023-04-14 16:07:57.151168',NULL,'00eb3e95-804c-458b-9f4d-2c0b1a2d8244','CREATE_TICKET_VIA_EMAIL',false,'Create ticket automatically'),
	 ('<html>
    <head>
        <style>
            body {
                background-color: white;
            }
            .message{
                width: 50%;
                text-align: center;
                background-color: gainsboro;
                padding: 1rem 1rem 1rem 1rem;
                border-radius: 1rem;

            }
            .info{
                width: 50%;
                position: relative;
                left: 50%;
                transform: translateX(-50%);
            }
            .info h1{
                text-align: center;

            }
            .info h4{
                color: gray;
                opacity: 70%;
            }
            .position{
                position: relative;
                left: 50%;
                transform: translateX(-50%);
            }
        </style>
    </head>

    <body>
        <div class="info position">
            <h1>Message added with success</h1>
            <h4>#{{ ticket_code }}</h4>
        </div>
        <div class="message position">
            {{message}}
        </div>
        <div class="footer position">
           <div>
            ${block ''EMAIL_FOOTER''}
           </div>
        </div>
    </body>

</html>','2023-03-10 21:31:24.199254','2023-03-10 21:31:24.199254',NULL,NULL,'MESSAGE_ADDED_TO_TICKET',false,'A message has been added to ticket'),
	 ('<html>
    <head>
        <style>
            body {
                background-color: white;
            }
            .message{
                width: 50%;
                text-align: center;
                background-color: gainsboro;
                padding: 1rem 1rem 1rem 1rem;
                border-radius: 1rem;

            }
            .info{
                width: 50%;
                position: relative;
                left: 50%;
                transform: translateX(-50%);
            }
            .position{
                position: relative;
                left: 50%;
                transform: translateX(-50%);
            }
        </style>
    </head>

    <body>
        <div class="message position">
            <p>
                The following code <strong>{{ ticket_code }}</strong> is not associated with a ticket.
            </p>
            <p>
                Please consider check if the provided <strong>code</strong> is right.
            </p>
            <p>
                If you want to create a new ticket, please send an email <strong>without</strong> a <strong>#TICKET_CODE</strong> in subject field.
            </p>
        </div>
        <div class="footer position">
           <div>
            ${block ''EMAIL_FOOTER''}
           </div>
        </div>
    </body>

</html>','2023-03-11 16:07:07.366068','2023-04-14 15:56:37.045246',NULL,'00eb3e95-804c-458b-9f4d-2c0b1a2d8244','INVALID_TICKETCODE',false,'A email send with an invalid ticket code 2');

INSERT INTO emails_blocks ("name","content",created_at,created_by,updated_at,updated_by) VALUES
	 ('EMAIL_FOOTER','<p>Regards,</p>
<p>TGS Team</p>','2023-03-06 21:10:23.73882',NULL,NULL,NULL);


INSERT INTO app_config ("name",value) VALUES
	 ('APP_TICKET_CODE_PREFIX','OT'),
	 ('APP_ADMIN_PAGE_TITLE','OpenTickets');

INSERT INTO tickets_status_codes (code,description,"label","order") VALUES
	 ('RELEASED','Released by an employee to be taken by another one more skilled or something else.','Released',3),
	 ('PENDING','In pending.','Pending',1),
	 ('TEMP_CLOSED','Temporary closed, in waiting for the customer to reopen, if the case.','Temporary Closed',4),
	 ('ASSIGNED','Assigned to a department or employee.','Assigned',0),
	 ('OPEN','Open ticker not assigned yet.','Open',6),
	 ('CLOSED','Closed ticket.','Closed',5);

INSERT INTO tickets_rights_codes (code,description) VALUES
	 ('READ_ONLY','Allow to view only data'),
	 ('ADMIN','Only for superusers'),
	 ('OWNER','Allow the view data, becouse is the owner of it'),
	 ('ADD_CONTENT','Allow to add and view data');

INSERT INTO tickets_emails_status_code (code,"label",description) VALUES
	 ('RECIVED','Recived','Recived on support email'),
	 ('SENDED','Sended','Sended by an internal user');

INSERT INTO admin_departments ("name",created_at,updated_at,description) VALUES
	 ('IT','2023-02-20','2023-02-20','It department'),
	 ('HR','2023-02-20','2023-02-20','HR department'),
	 ('Software Development','2023-02-20','2023-02-20','SD department');
