/* clean database */

DROP DATABASE IF EXISTS cheapomail;
CREATE DATABASE cheapomail;
USE cheapomail;

/* user tabe */

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
	`id` int(11) PRIMARY KEY NOT NULL auto_increment,
	`firstname` varchar(20) NOT NULL,
	`lastname` varchar(20) NOT NULL,
	`username` varchar(16) NOT NULL,
	`password` varchar(32) NOT NULL,
	UNIQUE (`username`)
);

/* create admin account (id=1 represents admin) with username 'admin' and password 'admin' */
INSERT INTO `user` (`firstname`, `lastname`, `username`, `password`) values ('Ultimate', 'Admin', 'admin', '78a41fb9315f6e22a9983e141f58534d');
INSERT INTO `user` (`firstname`, `lastname`, `username`, `password`) values ('Karl', 'Goddard', 'karculations', 'db7d534955d0c25ecc94e11126bb5851'); /*password = Sceptile1*/
INSERT INTO `user` (`firstname`, `lastname`, `username`, `password`) values ('Orren', 'Joseph', 'Orren', 'ba8bb56b3313c1581f35eea79843cbcf'); /*password = Orren1*/
INSERT INTO `user` (`firstname`, `lastname`, `username`, `password`) values ('Locksley', 'Murray', 'Locks', '362219e129cf2d0cfb68833e8ad95515'); /*password = Locksley1*/



DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
	`id` int(11) PRIMARY KEY NOT NULL auto_increment,
	`recipient_ids` text NOT NULL,
	`user_id` int(11) NOT NULL,
	`subject` varchar(128) NOT NULL,
	`body` mediumtext NOT NULL,
	`date_sent` datetime NOT NULL
);

DROP TABLE IF EXISTS `message_read`;
CREATE TABLE `message_read` (
	`id` int(11) PRIMARY KEY NOT NULL auto_increment,
	`message_id` int(11) NOT NULL,
	`reader_id` int(11) NOT NULL,
	`date` datetime NOT NULL
);

