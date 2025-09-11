--
-- PostgreSQL database dump
--

\restrict mD0QXhmcmQaJhMd5LnxFba2jh02mwphbGnFl9Gr81TLSqpWEjmjsD9sKdW6Ja3Y

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: event_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.event_type AS ENUM (
    'Workshop',
    'Seminar',
    'Conference',
    'Other'
);


ALTER TYPE public.event_type OWNER TO postgres;

--
-- Name: publication_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.publication_type AS ENUM (
    'publication',
    'patent',
    'research_project'
);


ALTER TYPE public.publication_type OWNER TO postgres;

--
-- Name: role_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role_type AS ENUM (
    'Speaker',
    'Attendee',
    'Organizer'
);


ALTER TYPE public.role_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: awards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.awards (
    awardid integer NOT NULL,
    facultyid integer NOT NULL,
    awardname character varying(255) NOT NULL,
    awardingbody character varying(255),
    location character varying(100),
    yearawarded integer NOT NULL
);


ALTER TABLE public.awards OWNER TO postgres;

--
-- Name: awards_awardid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.awards_awardid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.awards_awardid_seq OWNER TO postgres;

--
-- Name: awards_awardid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.awards_awardid_seq OWNED BY public.awards.awardid;


--
-- Name: bookpublicationdetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookpublicationdetails (
    publicationid integer NOT NULL,
    publisher character varying(255),
    edition character varying(50),
    volumenumber character varying(50),
    isbn_number text
);


ALTER TABLE public.bookpublicationdetails OWNER TO postgres;

--
-- Name: citationmetrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.citationmetrics (
    metricsid integer NOT NULL,
    facultyid integer NOT NULL,
    yearrecorded integer NOT NULL,
    source character varying(100) NOT NULL,
    hindex integer,
    i10index integer,
    totalcitations integer,
    impactfactor numeric(4,3)
);


ALTER TABLE public.citationmetrics OWNER TO postgres;

--
-- Name: citationmetrics_metricsid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.citationmetrics_metricsid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.citationmetrics_metricsid_seq OWNER TO postgres;

--
-- Name: citationmetrics_metricsid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.citationmetrics_metricsid_seq OWNED BY public.citationmetrics.metricsid;


--
-- Name: conferencepaperdetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conferencepaperdetails (
    publicationid integer NOT NULL,
    publisher character varying(255),
    location character varying(255),
    pagenumbers character varying(50)
);


ALTER TABLE public.conferencepaperdetails OWNER TO postgres;

--
-- Name: department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.department (
    departmentid integer NOT NULL,
    departmentname text NOT NULL
);


ALTER TABLE public.department OWNER TO postgres;

--
-- Name: department_departmentid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.department_departmentid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.department_departmentid_seq OWNER TO postgres;

--
-- Name: department_departmentid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.department_departmentid_seq OWNED BY public.department.departmentid;


--
-- Name: eventsorganised; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eventsorganised (
    facultyid integer NOT NULL,
    event_id integer NOT NULL,
    title character varying(500) NOT NULL,
    organizer character varying(255),
    location character varying(255),
    startdate date,
    enddate date,
    description text,
    role public.role_type,
    fundingagency character varying(255)
);


ALTER TABLE public.eventsorganised OWNER TO postgres;

--
-- Name: eventtype; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eventtype (
    eventid integer NOT NULL,
    eventtype public.event_type NOT NULL
);


ALTER TABLE public.eventtype OWNER TO postgres;

--
-- Name: faculty; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faculty (
    facultyid integer NOT NULL,
    firstname character varying(100) NOT NULL,
    lastname character varying(100) NOT NULL,
    gender character varying(10),
    dob date NOT NULL,
    role character varying(50) NOT NULL,
    phone_no character varying(20) NOT NULL,
    email character varying(120) NOT NULL,
    departmentid integer NOT NULL,
    CONSTRAINT faculty_gender_check CHECK (((gender)::text = ANY ((ARRAY['Male'::character varying, 'Female'::character varying, 'Other'::character varying])::text[])))
);


ALTER TABLE public.faculty OWNER TO postgres;

--
-- Name: faculty_facultyid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.faculty_facultyid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faculty_facultyid_seq OWNER TO postgres;

--
-- Name: faculty_facultyid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.faculty_facultyid_seq OWNED BY public.faculty.facultyid;


--
-- Name: facultypublicationlink; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facultypublicationlink (
    publicationid integer NOT NULL,
    facultyid integer NOT NULL,
    typeofindexing character varying(255)
);


ALTER TABLE public.facultypublicationlink OWNER TO postgres;

--
-- Name: facultyqualification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facultyqualification (
    qualificationid integer NOT NULL,
    facultyid integer NOT NULL,
    degree character varying(255) NOT NULL,
    institution character varying(255) NOT NULL,
    yearofcompletion date NOT NULL
);


ALTER TABLE public.facultyqualification OWNER TO postgres;

--
-- Name: facultyqualification_qualificationid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.facultyqualification_qualificationid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.facultyqualification_qualificationid_seq OWNER TO postgres;

--
-- Name: facultyqualification_qualificationid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.facultyqualification_qualificationid_seq OWNED BY public.facultyqualification.qualificationid;


--
-- Name: journalpublicationdetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.journalpublicationdetails (
    publicationid integer NOT NULL,
    name character varying(255),
    volumenumber character varying(50),
    issuenumber character varying(50),
    issn_number integer
);


ALTER TABLE public.journalpublicationdetails OWNER TO postgres;

--
-- Name: outreachactivities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.outreachactivities (
    activityid integer NOT NULL,
    facultyid integer NOT NULL,
    activitytype character varying(100) NOT NULL,
    activitytitle character varying(255) NOT NULL,
    institutionname character varying(150),
    activitydate date NOT NULL,
    description text
);


ALTER TABLE public.outreachactivities OWNER TO postgres;

--
-- Name: outreachactivities_activityid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.outreachactivities_activityid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.outreachactivities_activityid_seq OWNER TO postgres;

--
-- Name: outreachactivities_activityid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.outreachactivities_activityid_seq OWNED BY public.outreachactivities.activityid;


--
-- Name: patents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patents (
    typeid character varying(255) NOT NULL,
    facultyid integer NOT NULL,
    title character varying(255) NOT NULL,
    filingdate date NOT NULL,
    publicationdate date,
    patentnumber character varying(100) NOT NULL,
    authority character varying(100),
    collaborationinstitute character varying(150)
);


ALTER TABLE public.patents OWNER TO postgres;

--
-- Name: publications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publications (
    publicationid integer NOT NULL,
    typeid character varying(255) NOT NULL,
    authors text NOT NULL,
    title character varying(500) NOT NULL,
    publicationyear date NOT NULL,
    fundingagency character varying(255)
);


ALTER TABLE public.publications OWNER TO postgres;

--
-- Name: publications_publicationid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.publications_publicationid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publications_publicationid_seq OWNER TO postgres;

--
-- Name: publications_publicationid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.publications_publicationid_seq OWNED BY public.publications.publicationid;


--
-- Name: researchprojects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.researchprojects (
    typeid character varying(255) NOT NULL,
    facultyid integer NOT NULL,
    title character varying(255) NOT NULL,
    fundingagency character varying(255),
    startdate date NOT NULL,
    enddate date,
    budget numeric(12,2)
);


ALTER TABLE public.researchprojects OWNER TO postgres;

--
-- Name: subjecttaught; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subjecttaught (
    facultyid integer NOT NULL,
    level character varying(10) NOT NULL,
    subjectname character varying(255) NOT NULL,
    coursecode character varying(20),
    programname character varying(255),
    note text,
    CONSTRAINT subjecttaught_level_check CHECK (((level)::text = ANY ((ARRAY['UG'::character varying, 'PG'::character varying])::text[])))
);


ALTER TABLE public.subjecttaught OWNER TO postgres;

--
-- Name: teachingexperience; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teachingexperience (
    experienceid integer NOT NULL,
    facultyid integer NOT NULL,
    organizationname character varying(255) NOT NULL,
    designation character varying(255) NOT NULL,
    startdate date NOT NULL,
    enddate character varying(20),
    natureofwork text
);


ALTER TABLE public.teachingexperience OWNER TO postgres;

--
-- Name: teachingexperience_experienceid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teachingexperience_experienceid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teachingexperience_experienceid_seq OWNER TO postgres;

--
-- Name: teachingexperience_experienceid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teachingexperience_experienceid_seq OWNED BY public.teachingexperience.experienceid;


--
-- Name: types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.types (
    typeid character varying(255) NOT NULL,
    type public.publication_type NOT NULL,
    status character varying(50)
);


ALTER TABLE public.types OWNER TO postgres;

--
-- Name: awards awardid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.awards ALTER COLUMN awardid SET DEFAULT nextval('public.awards_awardid_seq'::regclass);


--
-- Name: citationmetrics metricsid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citationmetrics ALTER COLUMN metricsid SET DEFAULT nextval('public.citationmetrics_metricsid_seq'::regclass);


--
-- Name: department departmentid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department ALTER COLUMN departmentid SET DEFAULT nextval('public.department_departmentid_seq'::regclass);


--
-- Name: faculty facultyid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty ALTER COLUMN facultyid SET DEFAULT nextval('public.faculty_facultyid_seq'::regclass);


--
-- Name: facultyqualification qualificationid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facultyqualification ALTER COLUMN qualificationid SET DEFAULT nextval('public.facultyqualification_qualificationid_seq'::regclass);


--
-- Name: outreachactivities activityid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outreachactivities ALTER COLUMN activityid SET DEFAULT nextval('public.outreachactivities_activityid_seq'::regclass);


--
-- Name: publications publicationid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publications ALTER COLUMN publicationid SET DEFAULT nextval('public.publications_publicationid_seq'::regclass);


--
-- Name: teachingexperience experienceid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachingexperience ALTER COLUMN experienceid SET DEFAULT nextval('public.teachingexperience_experienceid_seq'::regclass);


--
-- Data for Name: awards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.awards (awardid, facultyid, awardname, awardingbody, location, yearawarded) FROM stdin;
\.


--
-- Data for Name: bookpublicationdetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookpublicationdetails (publicationid, publisher, edition, volumenumber, isbn_number) FROM stdin;
\.


--
-- Data for Name: citationmetrics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.citationmetrics (metricsid, facultyid, yearrecorded, source, hindex, i10index, totalcitations, impactfactor) FROM stdin;
\.


--
-- Data for Name: conferencepaperdetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conferencepaperdetails (publicationid, publisher, location, pagenumbers) FROM stdin;
\.


--
-- Data for Name: department; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.department (departmentid, departmentname) FROM stdin;
\.


--
-- Data for Name: eventsorganised; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eventsorganised (facultyid, event_id, title, organizer, location, startdate, enddate, description, role, fundingagency) FROM stdin;
\.


--
-- Data for Name: eventtype; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eventtype (eventid, eventtype) FROM stdin;
\.


--
-- Data for Name: faculty; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faculty (facultyid, firstname, lastname, gender, dob, role, phone_no, email, departmentid) FROM stdin;
\.


--
-- Data for Name: facultypublicationlink; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.facultypublicationlink (publicationid, facultyid, typeofindexing) FROM stdin;
\.


--
-- Data for Name: facultyqualification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.facultyqualification (qualificationid, facultyid, degree, institution, yearofcompletion) FROM stdin;
\.


--
-- Data for Name: journalpublicationdetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.journalpublicationdetails (publicationid, name, volumenumber, issuenumber, issn_number) FROM stdin;
\.


--
-- Data for Name: outreachactivities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.outreachactivities (activityid, facultyid, activitytype, activitytitle, institutionname, activitydate, description) FROM stdin;
\.


--
-- Data for Name: patents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patents (typeid, facultyid, title, filingdate, publicationdate, patentnumber, authority, collaborationinstitute) FROM stdin;
\.


--
-- Data for Name: publications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.publications (publicationid, typeid, authors, title, publicationyear, fundingagency) FROM stdin;
\.


--
-- Data for Name: researchprojects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.researchprojects (typeid, facultyid, title, fundingagency, startdate, enddate, budget) FROM stdin;
\.


--
-- Data for Name: subjecttaught; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subjecttaught (facultyid, level, subjectname, coursecode, programname, note) FROM stdin;
\.


--
-- Data for Name: teachingexperience; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teachingexperience (experienceid, facultyid, organizationname, designation, startdate, enddate, natureofwork) FROM stdin;
\.


--
-- Data for Name: types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.types (typeid, type, status) FROM stdin;
\.


--
-- Name: awards_awardid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.awards_awardid_seq', 1, false);


--
-- Name: citationmetrics_metricsid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.citationmetrics_metricsid_seq', 1, false);


--
-- Name: department_departmentid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.department_departmentid_seq', 1, false);


--
-- Name: faculty_facultyid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.faculty_facultyid_seq', 1, false);


--
-- Name: facultyqualification_qualificationid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.facultyqualification_qualificationid_seq', 1, false);


--
-- Name: outreachactivities_activityid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.outreachactivities_activityid_seq', 1, false);


--
-- Name: publications_publicationid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.publications_publicationid_seq', 1, false);


--
-- Name: teachingexperience_experienceid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teachingexperience_experienceid_seq', 1, false);


--
-- Name: awards awards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.awards
    ADD CONSTRAINT awards_pkey PRIMARY KEY (awardid);


--
-- Name: bookpublicationdetails bookpublicationdetails_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookpublicationdetails
    ADD CONSTRAINT bookpublicationdetails_pkey PRIMARY KEY (publicationid);


--
-- Name: citationmetrics citationmetrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citationmetrics
    ADD CONSTRAINT citationmetrics_pkey PRIMARY KEY (metricsid);


--
-- Name: conferencepaperdetails conferencepaperdetails_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conferencepaperdetails
    ADD CONSTRAINT conferencepaperdetails_pkey PRIMARY KEY (publicationid);


--
-- Name: department department_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (departmentid);


--
-- Name: eventsorganised eventsorganised_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventsorganised
    ADD CONSTRAINT eventsorganised_pkey PRIMARY KEY (facultyid, event_id);


--
-- Name: eventtype eventtype_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventtype
    ADD CONSTRAINT eventtype_pkey PRIMARY KEY (eventid);


--
-- Name: faculty faculty_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_pkey PRIMARY KEY (facultyid);


--
-- Name: facultypublicationlink facultypublicationlink_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facultypublicationlink
    ADD CONSTRAINT facultypublicationlink_pkey PRIMARY KEY (publicationid, facultyid);


--
-- Name: facultyqualification facultyqualification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facultyqualification
    ADD CONSTRAINT facultyqualification_pkey PRIMARY KEY (qualificationid);


--
-- Name: journalpublicationdetails journalpublicationdetails_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journalpublicationdetails
    ADD CONSTRAINT journalpublicationdetails_pkey PRIMARY KEY (publicationid);


--
-- Name: outreachactivities outreachactivities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outreachactivities
    ADD CONSTRAINT outreachactivities_pkey PRIMARY KEY (activityid);


--
-- Name: patents patents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patents
    ADD CONSTRAINT patents_pkey PRIMARY KEY (typeid, facultyid);


--
-- Name: publications publications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_pkey PRIMARY KEY (publicationid);


--
-- Name: researchprojects researchprojects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.researchprojects
    ADD CONSTRAINT researchprojects_pkey PRIMARY KEY (typeid, facultyid);


--
-- Name: subjecttaught subjecttaught_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjecttaught
    ADD CONSTRAINT subjecttaught_pkey PRIMARY KEY (facultyid, level, subjectname);


--
-- Name: teachingexperience teachingexperience_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachingexperience
    ADD CONSTRAINT teachingexperience_pkey PRIMARY KEY (experienceid);


--
-- Name: types types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.types
    ADD CONSTRAINT types_pkey PRIMARY KEY (typeid);


--
-- Name: awards awards_facultyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.awards
    ADD CONSTRAINT awards_facultyid_fkey FOREIGN KEY (facultyid) REFERENCES public.faculty(facultyid) ON DELETE CASCADE;


--
-- Name: bookpublicationdetails bookpublicationdetails_publicationid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookpublicationdetails
    ADD CONSTRAINT bookpublicationdetails_publicationid_fkey FOREIGN KEY (publicationid) REFERENCES public.publications(publicationid) ON DELETE CASCADE;


--
-- Name: citationmetrics citationmetrics_facultyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citationmetrics
    ADD CONSTRAINT citationmetrics_facultyid_fkey FOREIGN KEY (facultyid) REFERENCES public.faculty(facultyid) ON DELETE CASCADE;


--
-- Name: conferencepaperdetails conferencepaperdetails_publicationid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conferencepaperdetails
    ADD CONSTRAINT conferencepaperdetails_publicationid_fkey FOREIGN KEY (publicationid) REFERENCES public.publications(publicationid) ON DELETE CASCADE;


--
-- Name: eventsorganised eventsorganised_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventsorganised
    ADD CONSTRAINT eventsorganised_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.eventtype(eventid) ON DELETE CASCADE;


--
-- Name: eventsorganised eventsorganised_facultyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventsorganised
    ADD CONSTRAINT eventsorganised_facultyid_fkey FOREIGN KEY (facultyid) REFERENCES public.faculty(facultyid) ON DELETE CASCADE;


--
-- Name: faculty faculty_departmentid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_departmentid_fkey FOREIGN KEY (departmentid) REFERENCES public.department(departmentid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: facultypublicationlink facultypublicationlink_facultyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facultypublicationlink
    ADD CONSTRAINT facultypublicationlink_facultyid_fkey FOREIGN KEY (facultyid) REFERENCES public.faculty(facultyid) ON DELETE CASCADE;


--
-- Name: facultypublicationlink facultypublicationlink_publicationid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facultypublicationlink
    ADD CONSTRAINT facultypublicationlink_publicationid_fkey FOREIGN KEY (publicationid) REFERENCES public.publications(publicationid) ON DELETE CASCADE;


--
-- Name: facultyqualification facultyqualification_facultyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facultyqualification
    ADD CONSTRAINT facultyqualification_facultyid_fkey FOREIGN KEY (facultyid) REFERENCES public.faculty(facultyid) ON DELETE CASCADE;


--
-- Name: journalpublicationdetails journalpublicationdetails_publicationid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journalpublicationdetails
    ADD CONSTRAINT journalpublicationdetails_publicationid_fkey FOREIGN KEY (publicationid) REFERENCES public.publications(publicationid) ON DELETE CASCADE;


--
-- Name: outreachactivities outreachactivities_facultyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outreachactivities
    ADD CONSTRAINT outreachactivities_facultyid_fkey FOREIGN KEY (facultyid) REFERENCES public.faculty(facultyid) ON DELETE CASCADE;


--
-- Name: patents patents_facultyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patents
    ADD CONSTRAINT patents_facultyid_fkey FOREIGN KEY (facultyid) REFERENCES public.faculty(facultyid) ON DELETE CASCADE;


--
-- Name: patents patents_typeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patents
    ADD CONSTRAINT patents_typeid_fkey FOREIGN KEY (typeid) REFERENCES public.types(typeid) ON DELETE CASCADE;


--
-- Name: publications publications_typeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_typeid_fkey FOREIGN KEY (typeid) REFERENCES public.types(typeid) ON DELETE CASCADE;


--
-- Name: researchprojects researchprojects_facultyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.researchprojects
    ADD CONSTRAINT researchprojects_facultyid_fkey FOREIGN KEY (facultyid) REFERENCES public.faculty(facultyid) ON DELETE CASCADE;


--
-- Name: researchprojects researchprojects_typeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.researchprojects
    ADD CONSTRAINT researchprojects_typeid_fkey FOREIGN KEY (typeid) REFERENCES public.types(typeid) ON DELETE CASCADE;


--
-- Name: subjecttaught subjecttaught_facultyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjecttaught
    ADD CONSTRAINT subjecttaught_facultyid_fkey FOREIGN KEY (facultyid) REFERENCES public.faculty(facultyid) ON DELETE CASCADE;


--
-- Name: teachingexperience teachingexperience_facultyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachingexperience
    ADD CONSTRAINT teachingexperience_facultyid_fkey FOREIGN KEY (facultyid) REFERENCES public.faculty(facultyid) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict mD0QXhmcmQaJhMd5LnxFba2jh02mwphbGnFl9Gr81TLSqpWEjmjsD9sKdW6Ja3Y

