use kalahari;

--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.12
-- Dumped by pg_dump version 9.5.12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: air; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.air (
    air_dist_mult double precision,
    veh_id character varying(30),
    air_base_cost double precision
);


ALTER TABLE public.air OWNER TO postgres;

--
-- Name: company; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company (
    co_name character varying(30),
    id integer NOT NULL
);


ALTER TABLE public.company OWNER TO postgres;

--
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer (
    cu_name character varying(30),
    id integer NOT NULL
);


ALTER TABLE public.customer OWNER TO postgres;

--
-- Name: item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item (
    i_id integer NOT NULL,
    weight numeric,
    quantity integer NOT NULL,
    cost numeric,
    volume numeric,
    lat numeric,
    lon numeric,
    id integer NOT NULL
);


ALTER TABLE public.item OWNER TO postgres;

--
-- Name: land; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.land (
    land_dis_mult double precision,
    veh_id character varying(30),
    land_base_cost double precision
);


ALTER TABLE public.land OWNER TO postgres;

--
-- Name: sea; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sea (
    sea_dist_mult double precision,
    veh_id character varying(30),
    sea_base_cost double precision
);


ALTER TABLE public.sea OWNER TO postgres;

--
-- Name: shipping_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_method (
    veh_id character varying(30) NOT NULL
);


ALTER TABLE public.shipping_method OWNER TO postgres;

--
-- Name: shipping_request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_request (
    req_num integer NOT NULL,
    qty integer NOT NULL,
    origin character varying(30),
    dest character varying(30),
    total_val double precision,
    shipped integer NOT NULL,
    veh_id character varying(30) NOT NULL,
    id integer NOT NULL,
    lat double precision NOT NULL,
    lon double precision NOT NULL,
    i_id integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.shipping_request OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: warehouse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouse (
    lat double precision NOT NULL,
    lon double precision NOT NULL,
    capacity integer,
    active integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.warehouse OWNER TO postgres;

--
-- Data for Name: air; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.air (air_dist_mult, veh_id, air_base_cost) FROM stdin;
63.200000000000003	A0001	650
63.200000000000003	A0002	650
63.200000000000003	A0003	650
63.200000000000003	A0004	650
63.200000000000003	A0005	650
\.


--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company (co_name, id) FROM stdin;
Amazon	2
Telus	3
Best Buy	5
Daiso	9
London Drugs	10
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer (cu_name, id) FROM stdin;
Jon	1
Dante	4
Daphne	6
Michael	7
Tiger	8
\.


--
-- Data for Name: item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item (i_id, weight, quantity, cost, volume, lat, lon, id) FROM stdin;
\.


--
-- Data for Name: land; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.land (land_dis_mult, veh_id, land_base_cost) FROM stdin;
1.6000000000000001	L0001	50
1.6000000000000001	L0002	50
1.6000000000000001	L0003	50
1.6000000000000001	L0004	50
1.6000000000000001	L0005	50
\.


--
-- Data for Name: sea; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sea (sea_dist_mult, veh_id, sea_base_cost) FROM stdin;
4.2999999999999998	S3275	300
4.2999999999999998	S3265	300
4.2999999999999998	S3265	300
4.2999999999999998	S3255	300
4.2999999999999998	S3245	300
4.2999999999999998	S3235	300
\.


--
-- Data for Name: shipping_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_method (veh_id) FROM stdin;
A0001
A0002
A0003
A0004
A0005
L0001
L0002
L0003
L0004
L0005
S3275
S3265
S3255
S3245
S3235
\.


--
-- Data for Name: shipping_request; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_request (req_num, qty, origin, dest, total_val, shipped, veh_id, id, lat, lon, i_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id) FROM stdin;
1
2
3
4
5
6
7
8
9
10
\.


--
-- Data for Name: warehouse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouse (lat, lon, capacity, active) FROM stdin;
49.259680000000003	-123.173345	512	1
49.264088000000001	-123.133762	125	1
49.283081000000003	-123.127369	168	1
49.267664000000003	-123.03471500000001	135	1
49.256293999999997	-122.854243	121	1
\.


--
-- Name: company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id);


--
-- Name: customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- Name: item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_pkey PRIMARY KEY (i_id);


--
-- Name: shipping_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_method
    ADD CONSTRAINT shipping_method_pkey PRIMARY KEY (veh_id);


--
-- Name: shipping_request_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_request
    ADD CONSTRAINT shipping_request_pkey PRIMARY KEY (req_num);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: warehouse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse
    ADD CONSTRAINT warehouse_pkey PRIMARY KEY (lat, lon);


--
-- Name: air_veh_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.air
    ADD CONSTRAINT air_veh_id_fkey FOREIGN KEY (veh_id) REFERENCES public.shipping_method(veh_id) ON DELETE CASCADE;


--
-- Name: company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_id_fkey FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_id_fkey FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_id_fkey FOREIGN KEY (id) REFERENCES public.company(id) ON DELETE CASCADE;


--
-- Name: item_lat_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_lat_fkey FOREIGN KEY (lat, lon) REFERENCES public.warehouse(lat, lon) ON DELETE CASCADE;


--
-- Name: land_veh_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.land
    ADD CONSTRAINT land_veh_id_fkey FOREIGN KEY (veh_id) REFERENCES public.shipping_method(veh_id) ON DELETE CASCADE;


--
-- Name: sea_veh_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sea
    ADD CONSTRAINT sea_veh_id_fkey FOREIGN KEY (veh_id) REFERENCES public.shipping_method(veh_id) ON DELETE CASCADE;


--
-- Name: shipping_request_i_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_request
    ADD CONSTRAINT shipping_request_i_id_fkey FOREIGN KEY (i_id) REFERENCES public.item(i_id) ON DELETE CASCADE;


--
-- Name: shipping_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_request
    ADD CONSTRAINT shipping_request_id_fkey FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: shipping_request_lat_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_request
    ADD CONSTRAINT shipping_request_lat_fkey FOREIGN KEY (lat, lon) REFERENCES public.warehouse(lat, lon) ON DELETE CASCADE;


--
-- Name: shipping_request_veh_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_request
    ADD CONSTRAINT shipping_request_veh_id_fkey FOREIGN KEY (veh_id) REFERENCES public.shipping_method(veh_id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

