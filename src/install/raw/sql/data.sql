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

-- IMPORT COUNTRIES
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Andorra','AD','42.546245','1.601554'),
	 ('United Arab Emirates','AE','23.424076','53.847818'),
	 ('Afghanistan','AF','33.93911','67.709953'),
	 ('Antigua and Barbuda','AG','17.060816','-61.796428'),
	 ('Anguilla','AI','18.220554','-63.068615'),
	 ('Albania','AL','41.153332','20.168331'),
	 ('Armenia','AM','40.069099','45.038189'),
	 ('Netherlands Antilles','AN','12.226079','-69.060087'),
	 ('Angola','AO','-11.202692','17.873887'),
	 ('Antarctica','AQ','-75.250973','-0.071389');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Argentina','AR','-38.416097','-63.616672'),
	 ('American Samoa','AS','-14.270972','-170.132217'),
	 ('Austria','AT','47.516231','14.550072'),
	 ('Australia','AU','-25.274398','133.775136'),
	 ('Aruba','AW','12.52111','-69.968338'),
	 ('Azerbaijan','AZ','40.143105','47.576927'),
	 ('Bosnia and Herzegovina','BA','43.915886','17.679076'),
	 ('Barbados','BB','13.193887','-59.543198'),
	 ('Bangladesh','BD','23.684994','90.356331'),
	 ('Belgium','BE','50.503887','4.469936');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Burkina Faso','BF','12.238333','-1.561593'),
	 ('Bulgaria','BG','42.733883','25.48583'),
	 ('Bahrain','BH','25.930414','50.637772'),
	 ('Burundi','BI','-3.373056','29.918886'),
	 ('Benin','BJ','9.30769','2.315834'),
	 ('Bermuda','BM','32.321384','-64.75737'),
	 ('Brunei','BN','4.535277','114.727669'),
	 ('Bolivia','BO','-16.290154','-63.588653'),
	 ('Brazil','BR','-14.235004','-51.92528'),
	 ('Bahamas','BS','25.03428','-77.39628');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Bhutan','BT','27.514162','90.433601'),
	 ('Bouvet Island','BV','-54.423199','3.413194'),
	 ('Botswana','BW','-22.328474','24.684866'),
	 ('Belarus','BY','53.709807','27.953389'),
	 ('Belize','BZ','17.189877','-88.49765'),
	 ('Canada','CA','56.130366','-106.346771'),
	 ('Cocos [Keeling] Islands','CC','-12.164165','96.870956'),
	 ('Congo [DRC]','CD','-4.038333','21.758664'),
	 ('Central African Republic','CF','6.611111','20.939444'),
	 ('Congo [Republic]','CG','-0.228021','15.827659');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Switzerland','CH','46.818188','8.227512'),
	 ('Côte d''Ivoire','CI','7.539989','-5.54708'),
	 ('Cook Islands','CK','-21.236736','-159.777671'),
	 ('Chile','CL','-35.675147','-71.542969'),
	 ('Cameroon','CM','7.369722','12.354722'),
	 ('China','CN','35.86166','104.195397'),
	 ('Colombia','CO','4.570868','-74.297333'),
	 ('Costa Rica','CR','9.748917','-83.753428'),
	 ('Cuba','CU','21.521757','-77.781167'),
	 ('Cape Verde','CV','16.002082','-24.013197');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Christmas Island','CX','-10.447525','105.690449'),
	 ('Cyprus','CY','35.126413','33.429859'),
	 ('Czech Republic','CZ','49.817492','15.472962'),
	 ('Germany','DE','51.165691','10.451526'),
	 ('Djibouti','DJ','11.825138','42.590275'),
	 ('Denmark','DK','56.26392','9.501785'),
	 ('Dominica','DM','15.414999','-61.370976'),
	 ('Dominican Republic','DO','18.735693','-70.162651'),
	 ('Algeria','DZ','28.033886','1.659626'),
	 ('Ecuador','EC','-1.831239','-78.183406');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Estonia','EE','58.595272','25.013607'),
	 ('Egypt','EG','26.820553','30.802498'),
	 ('Western Sahara','EH','24.215527','-12.885834'),
	 ('Eritrea','ER','15.179384','39.782334'),
	 ('Spain','ES','40.463667','-3.74922'),
	 ('Ethiopia','ET','9.145','40.489673'),
	 ('Finland','FI','61.92411','25.748151'),
	 ('Fiji','FJ','-16.578193','179.414413'),
	 ('Falkland Islands [Islas Malvinas]','FK','-51.796253','-59.523613'),
	 ('Micronesia','FM','7.425554','150.550812');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Faroe Islands','FO','61.892635','-6.911806'),
	 ('France','FR','46.227638','2.213749'),
	 ('Gabon','GA','-0.803689','11.609444'),
	 ('United Kingdom','GB','55.378051','-3.435973'),
	 ('Grenada','GD','12.262776','-61.604171'),
	 ('Georgia','GE','42.315407','43.356892'),
	 ('French Guiana','GF','3.933889','-53.125782'),
	 ('Guernsey','GG','49.465691','-2.585278'),
	 ('Ghana','GH','7.946527','-1.023194'),
	 ('Gibraltar','GI','36.137741','-5.345374');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Greenland','GL','71.706936','-42.604303'),
	 ('Gambia','GM','13.443182','-15.310139'),
	 ('Guinea','GN','9.945587','-9.696645'),
	 ('Guadeloupe','GP','16.995971','-62.067641'),
	 ('Equatorial Guinea','GQ','1.650801','10.267895'),
	 ('Greece','GR','39.074208','21.824312'),
	 ('South Georgia and the South Sandwich Islands','GS','-54.429579','-36.587909'),
	 ('Guatemala','GT','15.783471','-90.230759'),
	 ('Guam','GU','13.444304','144.793731'),
	 ('Guinea-Bissau','GW','11.803749','-15.180413');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Guyana','GY','4.860416','-58.93018'),
	 ('Gaza Strip','GZ','31.354676','34.308825'),
	 ('Hong Kong','HK','22.396428','114.109497'),
	 ('Heard Island and McDonald Islands','HM','-53.08181','73.504158'),
	 ('Honduras','HN','15.199999','-86.241905'),
	 ('Croatia','HR','45.1','15.2'),
	 ('Haiti','HT','18.971187','-72.285215'),
	 ('Hungary','HU','47.162494','19.503304'),
	 ('Indonesia','ID','-0.789275','113.921327'),
	 ('Ireland','IE','53.41291','-8.24389');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Israel','IL','31.046051','34.851612'),
	 ('Isle of Man','IM','54.236107','-4.548056'),
	 ('India','IN','20.593684','78.96288'),
	 ('British Indian Ocean Territory','IO','-6.343194','71.876519'),
	 ('Iraq','IQ','33.223191','43.679291'),
	 ('Iran','IR','32.427908','53.688046'),
	 ('Iceland','IS','64.963051','-19.020835'),
	 ('Italy','IT','41.87194','12.56738'),
	 ('Jersey','JE','49.214439','-2.13125'),
	 ('Jamaica','JM','18.109581','-77.297508');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Jordan','JO','30.585164','36.238414'),
	 ('Japan','JP','36.204824','138.252924'),
	 ('Kenya','KE','-0.023559','37.906193'),
	 ('Kyrgyzstan','KG','41.20438','74.766098'),
	 ('Cambodia','KH','12.565679','104.990963'),
	 ('Kiribati','KI','-3.370417','-168.734039'),
	 ('Comoros','KM','-11.875001','43.872219'),
	 ('Saint Kitts and Nevis','KN','17.357822','-62.782998'),
	 ('North Korea','KP','40.339852','127.510093'),
	 ('South Korea','KR','35.907757','127.766922');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Kuwait','KW','29.31166','47.481766'),
	 ('Cayman Islands','KY','19.513469','-80.566956'),
	 ('Kazakhstan','KZ','48.019573','66.923684'),
	 ('Laos','LA','19.85627','102.495496'),
	 ('Lebanon','LB','33.854721','35.862285'),
	 ('Saint Lucia','LC','13.909444','-60.978893'),
	 ('Liechtenstein','LI','47.166','9.555373'),
	 ('Sri Lanka','LK','7.873054','80.771797'),
	 ('Liberia','LR','6.428055','-9.429499'),
	 ('Lesotho','LS','-29.609988','28.233608');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Lithuania','LT','55.169438','23.881275'),
	 ('Luxembourg','LU','49.815273','6.129583'),
	 ('Latvia','LV','56.879635','24.603189'),
	 ('Libya','LY','26.3351','17.228331'),
	 ('Morocco','MA','31.791702','-7.09262'),
	 ('Monaco','MC','43.750298','7.412841'),
	 ('Moldova','MD','47.411631','28.369885'),
	 ('Montenegro','ME','42.708678','19.37439'),
	 ('Madagascar','MG','-18.766947','46.869107'),
	 ('Marshall Islands','MH','7.131474','171.184478');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Macedonia [FYROM]','MK','41.608635','21.745275'),
	 ('Mali','ML','17.570692','-3.996166'),
	 ('Myanmar [Burma]','MM','21.913965','95.956223'),
	 ('Mongolia','MN','46.862496','103.846656'),
	 ('Macau','MO','22.198745','113.543873'),
	 ('Northern Mariana Islands','MP','17.33083','145.38469'),
	 ('Martinique','MQ','14.641528','-61.024174'),
	 ('Mauritania','MR','21.00789','-10.940835'),
	 ('Montserrat','MS','16.742498','-62.187366'),
	 ('Malta','MT','35.937496','14.375416');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Mauritius','MU','-20.348404','57.552152'),
	 ('Maldives','MV','3.202778','73.22068'),
	 ('Malawi','MW','-13.254308','34.301525'),
	 ('Mexico','MX','23.634501','-102.552784'),
	 ('Malaysia','MY','4.210484','101.975766'),
	 ('Mozambique','MZ','-18.665695','35.529562'),
	 ('Namibia','NA','-22.95764','18.49041'),
	 ('New Caledonia','NC','-20.904305','165.618042'),
	 ('Niger','NE','17.607789','8.081666'),
	 ('Norfolk Island','NF','-29.040835','167.954712');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Nigeria','NG','9.081999','8.675277'),
	 ('Nicaragua','NI','12.865416','-85.207229'),
	 ('Netherlands','NL','52.132633','5.291266'),
	 ('Norway','NO','60.472024','8.468946'),
	 ('Nepal','NP','28.394857','84.124008'),
	 ('Nauru','NR','-0.522778','166.931503'),
	 ('Niue','NU','-19.054445','-169.867233'),
	 ('New Zealand','NZ','-40.900557','174.885971'),
	 ('Oman','OM','21.512583','55.923255'),
	 ('Panama','PA','8.537981','-80.782127');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Peru','PE','-9.189967','-75.015152'),
	 ('French Polynesia','PF','-17.679742','-149.406843'),
	 ('Papua New Guinea','PG','-6.314993','143.95555'),
	 ('Philippines','PH','12.879721','121.774017'),
	 ('Pakistan','PK','30.375321','69.345116'),
	 ('Poland','PL','51.919438','19.145136'),
	 ('Saint Pierre and Miquelon','PM','46.941936','-56.27111'),
	 ('Pitcairn Islands','PN','-24.703615','-127.439308'),
	 ('Puerto Rico','PR','18.220833','-66.590149'),
	 ('Palestinian Territories','PS','31.952162','35.233154');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Portugal','PT','39.399872','-8.224454'),
	 ('Palau','PW','7.51498','134.58252'),
	 ('Paraguay','PY','-23.442503','-58.443832'),
	 ('Qatar','QA','25.354826','51.183884'),
	 ('Réunion','RE','-21.115141','55.536384'),
	 ('Romania','RO','45.943161','24.96676'),
	 ('Serbia','RS','44.016521','21.005859'),
	 ('Russia','RU','61.52401','105.318756'),
	 ('Rwanda','RW','-1.940278','29.873888'),
	 ('Saudi Arabia','SA','23.885942','45.079162');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Solomon Islands','SB','-9.64571','160.156194'),
	 ('Seychelles','SC','-4.679574','55.491977'),
	 ('Sudan','SD','12.862807','30.217636'),
	 ('Sweden','SE','60.128161','18.643501'),
	 ('Singapore','SG','1.352083','103.819836'),
	 ('Saint Helena','SH','-24.143474','-10.030696'),
	 ('Slovenia','SI','46.151241','14.995463'),
	 ('Svalbard and Jan Mayen','SJ','77.553604','23.670272'),
	 ('Slovakia','SK','48.669026','19.699024'),
	 ('Sierra Leone','SL','8.460555','-11.779889');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('San Marino','SM','43.94236','12.457777'),
	 ('Senegal','SN','14.497401','-14.452362'),
	 ('Somalia','SO','5.152149','46.199616'),
	 ('Suriname','SR','3.919305','-56.027783'),
	 ('São Tomé and Príncipe','ST','0.18636','6.613081'),
	 ('El Salvador','SV','13.794185','-88.89653'),
	 ('Syria','SY','34.802075','38.996815'),
	 ('Swaziland','SZ','-26.522503','31.465866'),
	 ('Turks and Caicos Islands','TC','21.694025','-71.797928'),
	 ('Chad','TD','15.454166','18.732207');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('French Southern Territories','TF','-49.280366','69.348557'),
	 ('Togo','TG','8.619543','0.824782'),
	 ('Thailand','TH','15.870032','100.992541'),
	 ('Tajikistan','TJ','38.861034','71.276093'),
	 ('Tokelau','TK','-8.967363','-171.855881'),
	 ('Timor-Leste','TL','-8.874217','125.727539'),
	 ('Turkmenistan','TM','38.969719','59.556278'),
	 ('Tunisia','TN','33.886917','9.537499'),
	 ('Tonga','TO','-21.178986','-175.198242'),
	 ('Turkey','TR','38.963745','35.243322');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Trinidad and Tobago','TT','10.691803','-61.222503'),
	 ('Tuvalu','TV','-7.109535','177.64933'),
	 ('Taiwan','TW','23.69781','120.960515'),
	 ('Tanzania','TZ','-6.369028','34.888822'),
	 ('Ukraine','UA','48.379433','31.16558'),
	 ('Uganda','UG','1.373333','32.290275'),
	 ('U.S. Minor Outlying Islands','UM','',''),
	 ('United States','US','37.09024','-95.712891'),
	 ('Uruguay','UY','-32.522779','-55.765835'),
	 ('Uzbekistan','UZ','41.377491','64.585262');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Vatican City','VA','41.902916','12.453389'),
	 ('Saint Vincent and the Grenadines','VC','12.984305','-61.287228'),
	 ('Venezuela','VE','6.42375','-66.58973'),
	 ('British Virgin Islands','VG','18.420695','-64.639968'),
	 ('U.S. Virgin Islands','VI','18.335765','-64.896335'),
	 ('Vietnam','VN','14.058324','108.277199'),
	 ('Vanuatu','VU','-15.376706','166.959158'),
	 ('Wallis and Futuna','WF','-13.768752','-177.156097'),
	 ('Samoa','WS','-13.759029','-172.104629'),
	 ('Kosovo','XK','42.602636','20.902977');
INSERT INTO nomenclators_countries ("name",code,latitude,longitude) VALUES
	 ('Yemen','YE','15.552727','48.516388'),
	 ('Mayotte','YT','-12.8275','45.166244'),
	 ('South Africa','ZA','-30.559482','22.937506'),
	 ('Zambia','ZM','-13.133897','27.849332'),
	 ('Zimbabwe','ZW','-19.015438','29.154857');

