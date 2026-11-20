-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 04, 2025 at 09:24 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `library`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `FullName` varchar(100) DEFAULT NULL,
  `AdminEmail` varchar(120) DEFAULT NULL,
  `UserName` varchar(100) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `updationDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `FullName`, `AdminEmail`, `UserName`, `Password`, `updationDate`) VALUES
(2, 'Sai Kham Hsai', 'Saikhamhsai@yahoo.com', 'admin', 'f925916e2754e5e03f75dd58a5733251', '2025-05-24 08:09:12');

-- --------------------------------------------------------

--
-- Table structure for table `tblauthors`
--

CREATE TABLE `tblauthors` (
  `id` int(11) NOT NULL,
  `AuthorName` varchar(159) DEFAULT NULL,
  `creationDate` timestamp NULL DEFAULT current_timestamp(),
  `UpdationDate` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tblauthors`
--

INSERT INTO `tblauthors` (`id`, `AuthorName`, `creationDate`, `UpdationDate`) VALUES
(10, 'George Orwell', '2025-05-25 06:37:23', '2025-05-29 07:54:34'),
(11, 'F. Scott Fitsgerald', '2025-05-25 06:38:05', NULL),
(12, 'Harper Lee', '2025-05-25 06:38:27', NULL),
(13, 'J.R.R. Tolkien', '2025-05-25 06:39:01', NULL),
(14, 'Anne Frank', '2025-05-25 06:39:18', NULL),
(15, 'J.K Rowling', '2025-05-29 07:47:37', '2025-05-29 07:54:51'),
(16, 'Stephen King', '2025-05-29 07:47:48', NULL),
(17, 'Markus Zusak', '2025-05-29 07:48:01', NULL),
(18, 'Dan Brown', '2025-05-29 07:48:14', NULL),
(19, 'Charlotte Bronte', '2025-05-30 11:57:54', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tblbooks`
--

CREATE TABLE `tblbooks` (
  `id` int(11) NOT NULL,
  `BookName` varchar(255) DEFAULT NULL,
  `CatId` int(11) DEFAULT NULL,
  `AuthorId` int(11) DEFAULT NULL,
  `ISBNNumber` int(11) DEFAULT NULL,
  `BookPrice` int(11) DEFAULT NULL,
  `RegDate` timestamp NULL DEFAULT current_timestamp(),
  `UpdationDate` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tblbooks`
--

INSERT INTO `tblbooks` (`id`, `BookName`, `CatId`, `AuthorId`, `ISBNNumber`, `BookPrice`, `RegDate`, `UpdationDate`) VALUES
(12, '1984', 16, 10, 123, 350, '2025-05-31 04:28:12', NULL),
(13, 'The Great Gatsby', 15, 11, 1234, 300, '2025-05-31 04:28:52', NULL),
(14, 'To Kill a Mockingbird', 16, 12, 2345, 400, '2025-05-31 04:29:25', NULL),
(15, 'The Lord Of Rings', 17, 13, 3456, 150, '2025-05-31 04:29:55', NULL),
(16, 'The Diary of a Young Girl', 15, 14, 4567, 145, '2025-05-31 04:30:27', NULL),
(17, 'Pride and Prejudice', 18, 17, 5678, 465, '2025-05-31 04:31:06', '2025-05-31 04:31:50'),
(18, 'Jane Eyre', 18, 19, 7890, 466, '2025-05-31 04:31:40', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tblcategory`
--

CREATE TABLE `tblcategory` (
  `id` int(11) NOT NULL,
  `CategoryName` varchar(150) DEFAULT NULL,
  `Status` int(1) DEFAULT NULL,
  `CreationDate` timestamp NULL DEFAULT current_timestamp(),
  `UpdationDate` timestamp NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tblcategory`
--

INSERT INTO `tblcategory` (`id`, `CategoryName`, `Status`, `CreationDate`, `UpdationDate`) VALUES
(15, 'Classic American Literature', 1, '2025-05-31 04:18:02', '2025-05-31 04:27:40'),
(16, 'Fiction', 1, '2025-05-31 04:20:26', '0000-00-00 00:00:00'),
(17, 'Adventure', 1, '2025-05-31 04:20:37', '2025-06-03 03:39:53'),
(18, 'Romantic', 1, '2025-05-31 04:20:45', '0000-00-00 00:00:00'),
(19, 'Technology', 1, '2025-05-31 04:20:53', '0000-00-00 00:00:00'),
(20, 'Science', 1, '2025-05-31 04:21:01', '0000-00-00 00:00:00'),
(21, 'Management', 1, '2025-05-31 04:21:10', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tblissuedbookdetails`
--

CREATE TABLE `tblissuedbookdetails` (
  `id` int(11) NOT NULL,
  `BookId` int(11) DEFAULT NULL,
  `StudentID` varchar(150) DEFAULT NULL,
  `IssuesDate` timestamp NULL DEFAULT current_timestamp(),
  `ReturnDate` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `RetrunStatus` int(1) DEFAULT NULL,
  `fine` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tblissuedbookdetails`
--

INSERT INTO `tblissuedbookdetails` (`id`, `BookId`, `StudentID`, `IssuesDate`, `ReturnDate`, `RetrunStatus`, `fine`) VALUES
(12, 15, 'SID015', '2025-05-31 04:33:54', '2025-06-03 03:40:17', 1, 50),
(13, 18, 'SID014', '2025-05-31 04:34:10', NULL, NULL, NULL),
(14, 13, 'SID013', '2025-05-31 04:35:19', '2025-05-31 04:36:28', 1, 0),
(15, 16, 'SID013', '2025-05-31 04:37:03', '2025-05-31 04:52:15', 1, 0),
(16, 16, 'SID013', '2025-06-04 06:44:06', '2025-06-04 06:45:47', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tblstudents`
--

CREATE TABLE `tblstudents` (
  `id` int(11) NOT NULL,
  `StudentId` varchar(100) DEFAULT NULL,
  `FullName` varchar(120) DEFAULT NULL,
  `EmailId` varchar(120) DEFAULT NULL,
  `MobileNumber` char(11) DEFAULT NULL,
  `Password` varchar(120) DEFAULT NULL,
  `Status` int(1) DEFAULT NULL,
  `RegDate` timestamp NULL DEFAULT current_timestamp(),
  `UpdationDate` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tblstudents`
--

INSERT INTO `tblstudents` (`id`, `StudentId`, `FullName`, `EmailId`, `MobileNumber`, `Password`, `Status`, `RegDate`, `UpdationDate`) VALUES
(12, 'SID013', 'Han su Yin', '2306090004@students.stamford.edu', '0989414780', '81dc9bdb52d04dc20036dbd8313ed055', 1, '2025-05-24 07:57:40', NULL),
(13, 'SID014', 'Alex', 'hsu7971@gmail.com', '9797112247', '827ccb0eea8a706c4c34a16891f84e7b', 1, '2025-05-25 16:06:32', '2025-05-25 16:12:45'),
(14, 'SID016', 'Sai Kham Hsai', 'benz@2004.gmail', '09114562', 'benz@04', 1, '2025-05-28 08:58:48', NULL),
(15, 'SID015', 'Ei Ei', 'eiei123@gmail.com', '+668754124', 'cf1a44eb4893e6b8322f59155fa4a118', 1, '2025-05-29 08:46:06', NULL),
(17, 'SID017', 'fams', 'fams@gmail.com', '091234567', '4436b15a7a1f1cefc944880b048be08e', 1, '2025-05-31 04:48:49', NULL),
(19, 'SID019', 'sai', 'sai@gmail.com', '03124567', 'e10adc3949ba59abbe56e057f20f883e', 1, '2025-06-04 06:55:29', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblauthors`
--
ALTER TABLE `tblauthors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblbooks`
--
ALTER TABLE `tblbooks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblcategory`
--
ALTER TABLE `tblcategory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblissuedbookdetails`
--
ALTER TABLE `tblissuedbookdetails`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblstudents`
--
ALTER TABLE `tblstudents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `StudentId` (`StudentId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tblauthors`
--
ALTER TABLE `tblauthors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `tblbooks`
--
ALTER TABLE `tblbooks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `tblcategory`
--
ALTER TABLE `tblcategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `tblissuedbookdetails`
--
ALTER TABLE `tblissuedbookdetails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `tblstudents`
--
ALTER TABLE `tblstudents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
