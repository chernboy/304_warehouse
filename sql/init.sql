CREATE TABLE ITEM (
    I_ID        NOT NULL,
    weight      DECIMAL,
    volume      DECIMAL,
    lat         DECIMAL,
    lon         DECIMAL,
    req_num     INTEGER,
    ID          INTEGER NOT NULL,
    PRIMARY KEY(I_ID),
    FOREIGN KEY(lat) REFERENCES WAREHOUSE(lat)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY(lon) REFERENCES WAREHOUSE(lon)
        ON UPDATE CASCADE,
        ON DELETE CASCADE,
    FOREIGN KEY(ID) REFERENCES COMPANY(ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE WAREHOUSE (
    lat         DECIMAL,
    lon         DECIMAL,
    capacity    INTEGER,
    PRIMARY KEY(lat,lon)
);

CREATE TABLE COMPANY (
    co_name     VARCHAR(30),
    ID          INTEGER,
    PRIMARY KEY(ID),
    FOREIGN KEY(ID) REFERENCES USER
        ON UPDATE CASCADE
        ON DELETE CASCADE 
);

