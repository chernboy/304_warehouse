CREATE TABLE SHIPPING_REQ (
    req_num     INTEGER,
    origin      VARCHAR (30),
    dest        VARCHAR (30),
    total_val   DECIMAL,
    veh_ID      VARCHAR (30) NOT NULL,
    ID          INTEGER NOT NULL,
    lat         DECIMAL NOT NULL,
    lon         DECIMAL NOT NULL,

)
