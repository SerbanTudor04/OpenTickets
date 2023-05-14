-- admin_departments definition

-- Drop table

-- DROP TABLE admin_departments;

CREATE TABLE admin_departments (
	id int8 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	"name" varchar NOT NULL,
	created_at date NULL DEFAULT now(),
	updated_at date NULL DEFAULT now(),
	description text NULL,
	CONSTRAINT admin_departments_pk PRIMARY KEY (id),
	CONSTRAINT admin_departments_un UNIQUE (name)
);


-- admin_departments_leaders definition

-- Drop table

-- DROP TABLE admin_departments_leaders;

CREATE TABLE admin_departments_leaders (
	id int8 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	department_id int8 NOT NULL,
	user_id uuid NOT NULL,
	CONSTRAINT admin_departments_leaders_pk PRIMARY KEY (id),
	CONSTRAINT admin_departments_leaders_un UNIQUE (user_id, department_id)
);


-- admin_departments_members definition

-- Drop table

-- DROP TABLE admin_departments_members;

CREATE TABLE admin_departments_members (
	id int8 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	department_id int8 NOT NULL,
	user_id uuid NOT NULL,
	created_at timestamp NULL DEFAULT now(),
	CONSTRAINT admin_departments_members_pk PRIMARY KEY (id),
	CONSTRAINT admin_departments_members_pk2 UNIQUE (user_id),
	CONSTRAINT admin_departments_members_un UNIQUE (department_id, user_id)
);


-- admin_users definition

-- Drop table

-- DROP TABLE admin_users;

CREATE TABLE admin_users (
	id uuid NOT NULL,
	username varchar NOT NULL,
	"password" varchar NULL,
	email varchar NULL,
	first_name varchar NULL,
	last_name varchar NULL,
	created_at date NULL,
	updated_at date NULL,
	email_verified bool NULL DEFAULT false,
	is_su bool NOT NULL DEFAULT false,
	CONSTRAINT admin_users_pk PRIMARY KEY (id),
	CONSTRAINT admin_users_un UNIQUE (username, email)
);


-- admin_users_inbox definition

-- Drop table

-- DROP TABLE admin_users_inbox;

CREATE TABLE admin_users_inbox (
	id int8 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	user_id uuid NOT NULL,
	message text NULL,
	created_at timestamp NULL DEFAULT now(),
	viewed bool NULL DEFAULT false,
	state varchar NULL DEFAULT 'INFO'::character varying,
	CONSTRAINT admin_users_inbox_pk PRIMARY KEY (id)
);
CREATE INDEX admin_users_inbox_user_id_idx ON admin_users_inbox USING btree (user_id);


-- admin_users_sessions definition

-- Drop table

-- DROP TABLE admin_users_sessions;

CREATE TABLE admin_users_sessions (
	user_id uuid NULL,
	"token" text NULL,
	id int8 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	CONSTRAINT admin_users_sessions_un UNIQUE (user_id)
);
CREATE INDEX admin_users_sessions_user_id_idx ON admin_users_sessions USING btree (user_id);


-- admin_users_sessions_blacklisted definition

-- Drop table

-- DROP TABLE admin_users_sessions_blacklisted;

CREATE TABLE admin_users_sessions_blacklisted (
	id int8 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	user_id uuid NOT NULL,
	"token" text NULL,
	CONSTRAINT admin_users_sessions_blacklisted_pk PRIMARY KEY (id)
);
CREATE INDEX admin_users_sessions_blacklisted_user_id_idx ON admin_users_sessions_blacklisted USING btree (user_id);


-- app_config definition

-- Drop table

-- DROP TABLE app_config;

CREATE TABLE app_config (
	"name" varchar NOT NULL,
	value text NULL,
	CONSTRAINT app_config_pk PRIMARY KEY (name)
);


-- emails_blocks definition

-- Drop table

-- DROP TABLE emails_blocks;

CREATE TABLE emails_blocks (
	id int4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	"name" varchar NULL,
	"content" text NULL,
	created_at timestamp NULL DEFAULT now(),
	created_by uuid NULL,
	updated_at timestamp NULL,
	updated_by uuid NULL,
	CONSTRAINT emails_blocks_pk PRIMARY KEY (id)
);
CREATE UNIQUE INDEX emails_blocks_name_uindex ON emails_blocks USING btree (name);


-- emails_templates definition

-- Drop table

-- DROP TABLE emails_templates;

CREATE TABLE emails_templates (
	id int4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	"content" text NULL,
	created_at timestamp NULL DEFAULT now(),
	updated_at timestamp NULL DEFAULT now(),
	created_by uuid NULL,
	updated_by uuid NULL,
	"name" varchar NOT NULL,
	is_name_editable bool NULL DEFAULT true,
	"label" varchar NULL,
	CONSTRAINT emails_templates_pk PRIMARY KEY (id)
);
CREATE UNIQUE INDEX emails_templates_name_idx ON emails_templates USING btree (name);


-- emails_variables definition

-- Drop table

-- DROP TABLE emails_variables;

CREATE TABLE emails_variables (
	id int4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	"name" varchar NOT NULL,
	"content" text NULL,
	created_at timestamp NULL DEFAULT now(),
	created_by uuid NULL,
	updated_at timestamp NULL DEFAULT now(),
	updated_by uuid NULL,
	is_static bool NULL DEFAULT true,
	CONSTRAINT emails_variables_pk PRIMARY KEY (id)
);
CREATE UNIQUE INDEX emails_variables_name_uindex ON emails_variables USING btree (name);


-- logs definition

-- Drop table

-- DROP TABLE logs;

CREATE TABLE logs (
	id int8 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	message text NOT NULL,
	status varchar NOT NULL,
	created_at timestamp NULL DEFAULT now(),
	CONSTRAINT logs_pk PRIMARY KEY (id)
);


-- ticket_messages definition

-- Drop table

-- DROP TABLE ticket_messages;

CREATE TABLE ticket_messages (
	id uuid NOT NULL,
	"content" text NULL,
	created_by uuid NULL,
	id_master uuid NULL,
	ticket_id uuid NULL,
	created_at timestamp NULL DEFAULT now(),
	updated_at timestamp NULL DEFAULT now(),
	CONSTRAINT ticket_messages_pk PRIMARY KEY (id)
);
CREATE INDEX ticket_messages_id_master_index ON ticket_messages USING btree (id_master);


-- ticket_messages_arhive definition

-- Drop table

-- DROP TABLE ticket_messages_arhive;

CREATE TABLE ticket_messages_arhive (
	id uuid NULL,
	"content" text NULL,
	created_by uuid NULL,
	id_master uuid NULL,
	ticket_id uuid NULL,
	subject varchar NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	id_original uuid NOT NULL
);


-- tickets definition

-- Drop table

-- DROP TABLE tickets;

CREATE TABLE tickets (
	id uuid NOT NULL,
	code varchar NOT NULL,
	subject varchar NOT NULL,
	description varchar NOT NULL,
	status varchar NULL DEFAULT 'O'::character varying,
	department_id int4 NULL,
	"content" text NULL,
	created_at timestamp NULL DEFAULT now(),
	closed_at timestamp NULL,
	created_by uuid NULL,
	updated_at timestamp NULL DEFAULT now(),
	CONSTRAINT tickets_pk PRIMARY KEY (id)
);
CREATE UNIQUE INDEX tickets_code_uindex ON tickets USING btree (code);
CREATE INDEX tickets_created_by_index ON tickets USING btree (created_by);
COMMENT ON INDEX tickets_created_by_index IS 'Created by user';
CREATE INDEX tickets_department_id_index ON tickets USING btree (department_id);


-- tickets_attachements definition

-- Drop table

-- DROP TABLE tickets_attachements;

CREATE TABLE tickets_attachements (
	id uuid NOT NULL,
	file_binary bytea NULL,
	file_mime_type varchar NOT NULL,
	file_size int8 NOT NULL,
	file_name varchar NOT NULL,
	created_at timestamp NULL DEFAULT now(),
	updated_at timestamp NULL DEFAULT now(),
	ticket_id uuid NOT NULL,
	CONSTRAINT tickets_attachements_pk PRIMARY KEY (id)
);


-- tickets_emails definition

-- Drop table

-- DROP TABLE tickets_emails;

CREATE TABLE tickets_emails (
	id int4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	ticket_id uuid NULL,
	ticket_code varchar NULL,
	subject text NULL,
	"content" text NULL,
	send_date timestamp NULL,
	status varchar NULL,
	from_address varchar NULL,
	mailbox varchar NULL,
	"domain" varchar NULL,
	email_id int4 NULL,
	"isSendByAdmin" bool NULL DEFAULT false,
	send_by uuid NULL,
	CONSTRAINT tickets_emails_pk PRIMARY KEY (id)
);


-- tickets_emails_status_code definition

-- Drop table

-- DROP TABLE tickets_emails_status_code;

CREATE TABLE tickets_emails_status_code (
	id int4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	code varchar NOT NULL,
	"label" varchar NOT NULL,
	description varchar NULL,
	CONSTRAINT tickets_emails_status_code_pk PRIMARY KEY (id)
);


-- tickets_rights definition

-- Drop table

-- DROP TABLE tickets_rights;

CREATE TABLE tickets_rights (
	id int4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	user_id uuid NOT NULL,
	code varchar NOT NULL,
	ticket_id uuid NULL,
	created_at timestamp NULL DEFAULT now(),
	updated_at timestamp NULL DEFAULT now(),
	CONSTRAINT tickets_rights_pk PRIMARY KEY (id)
);
CREATE UNIQUE INDEX tickets_rights_user_id_ticket_id_uindex ON tickets_rights USING btree (user_id, ticket_id);


-- tickets_rights_codes definition

-- Drop table

-- DROP TABLE tickets_rights_codes;

CREATE TABLE tickets_rights_codes (
	id int4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	code varchar NOT NULL,
	description varchar NULL,
	CONSTRAINT tickets_rights_codes_pk PRIMARY KEY (id)
);


-- tickets_status_codes definition

-- Drop table

-- DROP TABLE tickets_status_codes;

CREATE TABLE tickets_status_codes (
	id int4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	code varchar NULL,
	description varchar NULL,
	"label" varchar NULL,
	"order" int4 NULL
);


-- tickets_timeline definition

-- Drop table

-- DROP TABLE tickets_timeline;

CREATE TABLE tickets_timeline (
	id int4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	"content" text NULL,
	created_at timestamp NULL DEFAULT now(),
	ticket_id uuid NULL,
	ticket_code varchar NULL,
	CONSTRAINT tickets_timeline_pk PRIMARY KEY (id)
);
CREATE INDEX tickets_timeline_ticket_code_index ON tickets_timeline USING btree (ticket_code);


-- tickets_users_assigned definition

-- Drop table

-- DROP TABLE tickets_users_assigned;

CREATE TABLE tickets_users_assigned (
	id int4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	ticket_id uuid NOT NULL,
	user_id uuid NOT NULL,
	created_at timestamp NULL DEFAULT now(),
	"isActive" bool NULL DEFAULT true,
	updated_at timestamp NULL DEFAULT now(),
	CONSTRAINT tickets_users_assigned_pk PRIMARY KEY (id)
);
CREATE INDEX tickets_users_assigned_user_id_ticket_id_index ON tickets_users_assigned USING btree (user_id, ticket_id);


-- tickets.nomenclators_cities definition

-- Drop table

-- DROP TABLE nomenclators_cities;

CREATE TABLE nomenclators_cities (
	"name" varchar NULL,
	code varchar NULL,
	country_id int4 NULL,
	id int4 NOT NULL GENERATED BY DEFAULT AS IDENTITY
);
CREATE INDEX nomenclators_cities_code_idx ON tickets.nomenclators_cities USING btree (code);
CREATE INDEX nomenclators_cities_country_id_idx ON tickets.nomenclators_cities USING btree (country_id);


-- tickets.nomenclators_countries definition

-- Drop table

-- DROP TABLE nomenclators_countries;

CREATE TABLE nomenclators_countries (
	"name" varchar NULL,
	code varchar NULL,
	latitude varchar NULL,
	longitude varchar NULL,
	id int4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	CONSTRAINT nomenclators_countries_pk PRIMARY KEY (id)
);
CREATE INDEX nomenclators_countries_code_idx ON tickets.nomenclators_countries USING btree (code);

-- tickets.admin_clients definition

-- Drop table

-- DROP TABLE admin_clients;

CREATE TABLE admin_clients (
	full_name varchar NOT NULL,
	first_name varchar NULL,
	middle_name varchar NULL,
	last_name varchar NULL,
	address text NULL,
	country_id int4 NULL,
	city varchar NULL,
	region varchar NULL,
	unique_id varchar NULL,
	id int4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	email varchar NOT NULL,
	phone varchar NOT NULL,
	zipcode varchar NULL,
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	created_by uuid NOT NULL,
	updated_by uuid NOT NULL,
	uid uuid NULL DEFAULT uuid_in("overlay"("overlay"(md5((random()::text || ':'::text) || random()::text), '4'::text, 13), to_hex(floor(random() * (11 - 8 + 1)::double precision + 8::double precision)::integer), 17)::cstring),
	CONSTRAINT admin_clients_pk PRIMARY KEY (id),
	CONSTRAINT admin_clients_un UNIQUE (uid)
);


-- tickets.admin_clients_as_bussiness definition

-- Drop table

-- DROP TABLE admin_clients_as_bussiness;

CREATE TABLE admin_clients_as_bussiness (
	id int4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	full_name varchar NOT NULL,
	address text NULL,
	email varchar NOT NULL,
	registration_code varchar NOT NULL,
	code varchar NOT NULL,
	country_id int4 NULL,
	city varchar NULL,
	region varchar NULL,
	phone varchar NOT NULL,
	zipcode varchar NULL,
	created_by uuid NULL,
	updated_by uuid NULL,
	created_at timestamp NULL DEFAULT now(),
	updated_at timestamp NULL DEFAULT now(),
	uid uuid NULL DEFAULT uuid_in("overlay"("overlay"(md5((random()::text || ':'::text) || random()::text), '4'::text, 13), to_hex(floor(random() * (11 - 8 + 1)::double precision + 8::double precision)::integer), 17)::cstring),
	CONSTRAINT admin_clients_as_bussiness_pk PRIMARY KEY (id),
	CONSTRAINT admin_clients_as_bussiness_un UNIQUE (uid)
);
CREATE INDEX admin_clients_as_bussiness_code_idx ON tickets.admin_clients_as_bussiness USING btree (code);
CREATE INDEX admin_clients_as_bussiness_email_idx ON tickets.admin_clients_as_bussiness USING btree (email);


-- tickets.admin_clients_notes definition

-- Drop table

-- DROP TABLE admin_clients_notes;

CREATE TABLE admin_clients_notes (
	id int4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	note text NULL,
	created_at timestamp NULL DEFAULT now(),
	client_uid uuid NOT NULL
);