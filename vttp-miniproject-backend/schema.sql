-- drop the database if it exists

drop database if exists healthcare;

-- create the database

create database healthcare;

-- select the database
use healthcare;

-- create one or more tables
select "creating users table..." as msg;

-- create users table
create table users (
    user_id varchar(128) not null,
    username varchar(128) not null,
    email varchar(128) not null unique,
    user_type ENUM ('PATIENT', 'ADMIN') not null,
    
    constraint pk_user_id primary key(user_id)
);

select "creating patients table..." as msg;
-- create patients table
create table patients (
    patient_id int auto_increment,
    name varchar(128) not null,
    ic_num varchar(10) not null unique,
    dob date not null,
    email varchar(128) not null,
    contact_num varchar(8) not null,
    address varchar(128) not null,
    user_id varchar(128) not null,

    constraint pk_patient_id primary key(patient_id),
    constraint fk_user_id foreign key(user_id)
        references users(user_id)
);

select "creating clinics table..." as msg;

-- create clinics table
create table clinics (
    clinic_id int not null,
    clinic_name varchar(128) not null,

    constraint pk_clinic_id primary key(clinic_id)
);



-- create admins table
select "creating admins table..." as msg;
create table admins (
    admin_id int not null,
    admin_name varchar(128) not null,
    clinic_id int not null,
    user_id varchar(128) not null,

    constraint pk_admin_id primary key(admin_id),
    constraint fk_user_id_2 foreign key(user_id)
        references users(user_id),
    constraint fk_clinic_id foreign key(clinic_id)
        references clinics(clinic_id)
);


-- create clinic_patient_registrations table
-- select "creating clinic_patient_registrations table..." as msg;

-- create table clinic_patient_registrations(
--     registration_id int auto_increment,
--     patient_id int not null,
--     clinic_id int not null,
--     registation_date date not null,

--     constraint pk_registration_id primary key(registration_id),
--     constraint fk_patient_id foreign key(patient_id)
--         references patients(patient_id),
--     constraint fk_clinic_id_2 foreign key(clinic_id)
--         references clinics(clinic_id)
-- );
select "creating appointments table..." as msg;
-- create appointments table
create table appointments(
    appointment_id int auto_increment,
    patient_id int not null,
    clinic_id int not null,
    appointment_date date not null,

    constraint pk_appointment_id primary key(appointment_id),
    constraint fk_patient_id foreign key(patient_id)
            references patients(patient_id)
);

select "creating postal_districts table..." as msg;
-- create postal_districts table
CREATE TABLE postal_districts (
    sector CHAR(2) PRIMARY KEY,
    location VARCHAR(255) NOT NULL
);





