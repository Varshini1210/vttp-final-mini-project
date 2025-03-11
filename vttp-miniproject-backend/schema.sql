-- drop the database if it exists

drop database if exists miniproject;

-- create the database

create database miniproject;

-- select the database
use miniproject;

-- create one or more tables
select "creating users table..." as msg;

-- create users table
create table users (
    user_id int auto_increment,
    email unique varchar(128) not null,
    password unique varchar(128) not null,
    contact_number varchar(8) not null,
    user_type ENUM ('PATIENT', 'ADMIN', 'DOCTOR') not null,
    
    constraint pk_user_id primary key(user_id)
);

select "creating patients table..." as msg;
-- create patients table
create table patients (
    patient_id int auto_increment,
    name varchar(128) not null,
    ic_num varchar(10) unique not null,
    dob date not null,
    address varchar(128) not null,
    user_id not null,

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

-- create doctors table
select "creating doctors table..." as msg;
create table doctors (
    doctor_id int not null,
    doctor_name varchar(128) not null,
    clinic_id int not null,
    user_id int not null,

    constraint pk_doctor_id primary key(doctor_id),
    constraint fk_user_id foreign key(user_id)
        references users(user_id),
    constraint fk_clinic_id foreign key(clinic_id)
        references clinics(clinic_id)
);


-- create admins table
select "creating admins table..." as msg;
create table admins (
    admin_id int not null,
    admin_name varchar(128) not null,
    clinic_id int not null,
    user_id int not null,

    constraint pk_admin_id primary key(admin_id),
    constraint fk_user_id foreign key(user_id)
        references users(user_id),
    constraint fk_clinic_id foreign key(clinic_id)
        references clinics(clinic_id)
);


-- create clinic_patient_registrations table
select "creating clinic_patient_registrations table..." as msg;

create table clinic_patient_registrations(
    registration_id int auto_increment,
    patient_id int not null,
    clinic_id int not null,
    registation_date date not null,

    constraint pk_registration_id primary key(registration_id),
    constraint fk_patient_id foreign key(patient_id)
        references patients(patient_id),
    constraint fk_clinic_id foreign key(clinic_id)
        references clinics(clinic_id)
);

-- create payments table
select "creating payments table..." as msg;

create table payments (
    payment_id int auto_increment,
    registration_id int not null,
    amount decimal(10,2) not null,
    status ENUM('PENDING', 'COMPLETED') default 'pending',
    payment_date timestamp default current_timestamp,

    constraint pk_payment_id primary key(payment_id),
    constraint fk_registration_id foreign key(registration_id)
        references clinic_patient_registrations(registration_id)
    
);

-- create medicines table

create table medicines (
    name varchar(128) not null,
    price decimal(10,2) not null
)




