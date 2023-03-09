CREATE TABLE IF NOT EXISTS url_details (
	original_url varchar NOT NULL,
	url_short_id varchar(7) NOT NULL,
	CONSTRAINT url_details_pk PRIMARY KEY (url_short_id)
);