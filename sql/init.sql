DROP TABLE ITEM;
DROP TABLE CUSTOMER;
DROP TABLE COMPANY;
DROP TABLE WAREHOUSE;
DROP TABLE "USER";
DROP TABLE AIR;
DROP TABLE SEA;
DROP TABLE LAND;
DROP TABLE SHIPPING_METHOD;

CREATE TABLE WAREHOUSE (
    lat         DOUBLE PRECISION NOT NULL,
    lon         DOUBLE PRECISION NOT NULL,
    capacity    INTEGER,
    PRIMARY KEY(lat,lon)
);

CREATE TABLE "USER"
(
    ID INTEGER,        
    PRIMARY KEY (ID)
);

CREATE TABLE SHIPPING_METHOD
(
    veh_ID      varchar(30),
    PRIMARY KEY(veh_ID)
);

CREATE TABLE AIR
(
    air_dist_mult   DOUBLE PRECISION,
    veh_ID          VARCHAR(30),
    air_base_cost   DOUBLE PRECISION,
    FOREIGN KEY (veh_ID)
        REFERENCES SHIPPING_METHOD(veh_ID)
        ON DELETE CASCADE
);

CREATE TABLE LAND
(
    land_dis_mult   DOUBLE PRECISION,
    veh_ID          VARCHAR(30),
    land_base_cost  DOUBLE PRECISION,
    FOREIGN KEY (veh_ID)
        REFERENCES SHIPPING_METHOD(veh_ID)
        ON DELETE CASCADE
);

CREATE TABLE SEA
(
    sea_dist_mult   DOUBLE PRECISION,
    veh_ID          VARCHAR(30),
    sea_base_cost   DOUBLE PRECISION,
    FOREIGN KEY (veh_ID)
        REFERENCES SHIPPING_METHOD(veh_ID)
        ON DELETE CASCADE
);

CREATE TABLE COMPANY (
    co_name     VARCHAR(30),
    ID          INTEGER,
    PRIMARY KEY(ID),
    FOREIGN KEY(ID) REFERENCES "USER"
        ON DELETE CASCADE 
);

CREATE TABLE CUSTOMER 
(
    cu_name VARCHAR(30),
    ID      INTEGER,      
    PRIMARY KEY (ID), 
    FOREIGN KEY (ID)
        REFERENCES "USER"
        ON DELETE CASCADE
);

CREATE TABLE ITEM (
    I_ID        INTEGER NOT NULL,
    weight      DECIMAL,
    volume      DECIMAL,
    lat         DECIMAL,
    lon         DECIMAL,
    req_num     INTEGER,
    ID          INTEGER NOT NULL,
    PRIMARY KEY(I_ID),
    FOREIGN KEY(lat, lon) REFERENCES WAREHOUSE
        ON DELETE CASCADE,
    FOREIGN KEY(ID) REFERENCES COMPANY
        ON DELETE CASCADE
);

CREATE TABLE SHIPPING_REQUEST (
    req_num     INTEGER NOT NULL,
    origin      VARCHAR(30),
    dest        VARCHAR(30),
    total_val   DOUBLE PRECISION,
    veh_ID      VARCHAR(30) DEFAULT '0' NOT NULL,
    ID          INTEGER DEFAULT 0 NOT NULL,
    lat         DOUBLE PRECISION DEFAULT 0 NOT NULL,
    lon         DOUBLE PRECISION DEFAULT 0 NOT NULL,
    I_ID        INTEGER DEFAULT 0 NOT NULL,
    PRIMARY KEY (req_num),
    FOREIGN KEY (veh_ID) REFERENCES SHIPPING_METHOD
        ON DELETE SET DEFAULT,
    FOREIGN KEY (ID) REFERENCES USER
        ON DELETE SET DEFAULT,
    FOREIGN KEY (lat,lon) REFERENCES WAREHOUSE
        ON DELETE SET DEFAULT,
    FOREIGN KEY (I_ID) REFERENCES ITEM   
        ON DELETE SET DEFAULT 
);

INSERT INTO "USER"
    VALUES ('1');

INSERT INTO "USER"
    VALUES ('2');

INSERT INTO "USER"
    VALUES ('3');

INSERT INTO "USER"
    VALUES ('4');

INSERT INTO "USER"
    VALUES ('5');

INSERT INTO "USER"
    VALUES ('6');

INSERT INTO "USER"
    VALUES ('7');

INSERT INTO "USER"
    VALUES ('8');

INSERT INTO "USER"
    VALUES ('9');
    
INSERT INTO "USER"
    VALUES ('10');

INSERT INTO COMPANY
    VALUES('Amazon', '2');

INSERT INTO COMPANY
    VALUES('Telus', '3');

INSERT INTO COMPANY
    VALUES('Best Buy', '5');

INSERT INTO COMPANY
    VALUES('Daiso', '9');
    
INSERT INTO COMPANY
    VALUES('London Drugs', '10');

INSERT INTO CUSTOMER 
    VALUES('Jon', '1');

INSERT INTO CUSTOMER 
    VALUES('Dante', '4');

INSERT INTO CUSTOMER 
    VALUES('Daphne', '6');

INSERT INTO CUSTOMER 
    VALUES('Michael', '7');

INSERT INTO CUSTOMER 
    VALUES('Tiger', '8');

INSERT INTO WAREHOUSE
    VALUES(49.25968, -123.173345, 512);

INSERT INTO WAREHOUSE
    VALUES(49.264088, -123.133762, 125);

INSERT INTO WAREHOUSE
    VALUES(49.283081, -123.127369, 168);

INSERT INTO WAREHOUSE
    VALUES(49.267664, -123.034715, 135);

INSERT INTO WAREHOUSE
    VALUES(49.256294, -122.854243, 121);

INSERT INTO SHIPPING_METHOD(veh_ID)
    VALUES('A0001');

INSERT INTO SHIPPING_METHOD(veh_ID)
    VALUES('A0002');

INSERT INTO SHIPPING_METHOD(veh_ID)
    VALUES('A0003');

INSERT INTO SHIPPING_METHOD(veh_ID)
    VALUES('A0004');

INSERT INTO SHIPPING_METHOD(veh_ID)
    VALUES('A0005');

INSERT INTO SHIPPING_METHOD(veh_ID)
    VALUES('L0001');

INSERT INTO SHIPPING_METHOD(veh_ID)
    VALUES('L0002');

INSERT INTO SHIPPING_METHOD(veh_ID)
    VALUES('L0003');

INSERT INTO SHIPPING_METHOD(veh_ID)
    VALUES('L0004');

INSERT INTO SHIPPING_METHOD(veh_ID)
    VALUES('L0005');

INSERT INTO SHIPPING_METHOD(veh_ID)
    VALUES('S3275');

INSERT INTO SHIPPING_METHOD(veh_ID)
    VALUES('S3265');

INSERT INTO SHIPPING_METHOD(veh_ID)
    VALUES('S3255');

INSERT INTO SHIPPING_METHOD(veh_ID)
    VALUES('S3245');

INSERT INTO SHIPPING_METHOD(veh_ID)
    VALUES('S3235');

INSERT INTO AIR
    VALUES(63.2, 'A0001', 650.0);

INSERT INTO AIR
    VALUES(63.2, 'A0002', 650.0);

INSERT INTO AIR
    VALUES(63.2, 'A0003', 650.0);

INSERT INTO AIR
    VALUES(63.2, 'A0004', 650.0);

INSERT INTO AIR
    VALUES(63.2, 'A0005', 650.0);

INSERT INTO LAND
    VALUES(1.6, 'L0001', 50.0);

INSERT INTO LAND
    VALUES(1.6, 'L0002', 50.0);

INSERT INTO LAND
    VALUES(1.6, 'L0003', 50.0);

INSERT INTO LAND
    VALUES(1.6, 'L0004', 50.0);

INSERT INTO LAND
    VALUES(1.6, 'L0005', 50.0);

INSERT INTO SEA
    VALUES(4.3, 'S3275', 300.0);

INSERT INTO SEA
    VALUES(4.3, 'S3265', 300.0);

INSERT INTO SEA
    VALUES(4.3, 'S3265', 300.0);

INSERT INTO SEA
    VALUES(4.3, 'S3255', 300.0);

INSERT INTO SEA
    VALUES(4.3, 'S3245', 300.0);

INSERT INTO SEA
    VALUES(4.3, 'S3235', 300.0);