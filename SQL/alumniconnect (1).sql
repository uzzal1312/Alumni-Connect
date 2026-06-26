-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 17, 2026 at 07:10 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `alumniconnect`
--

-- --------------------------------------------------------

--
-- Table structure for table `alumni_profiles`
--

CREATE TABLE `alumni_profiles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `university` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `graduation_year` int(11) DEFAULT NULL,
  `field_of_study` varchar(255) DEFAULT NULL,
  `current_job_title` varchar(255) DEFAULT NULL,
  `current_company` varchar(255) DEFAULT NULL,
  `industry` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `is_mentor` tinyint(1) DEFAULT 0,
  `expertise` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`expertise`)),
  `referral_companies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`referral_companies`)),
  `github_url` varchar(255) DEFAULT NULL,
  `portfolio_url` varchar(255) DEFAULT NULL,
  `research_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `alumni_profiles`
--

INSERT INTO `alumni_profiles` (`id`, `user_id`, `university`, `department`, `graduation_year`, `field_of_study`, `current_job_title`, `current_company`, `industry`, `bio`, `linkedin_url`, `is_mentor`, `expertise`, `referral_companies`, `github_url`, `portfolio_url`, `research_url`, `created_at`, `updated_at`) VALUES
(1, 3, NULL, NULL, 2024, 'CS', 'Web Dev', 'Google', 'Technology & Software', 'None', 'https://bd.linkedin.com/', 1, '[\"Communication\",\"C#\"]', '[\"Google\"]', '', '', '', '2026-06-16 05:57:51', '2026-06-16 18:57:43');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `slot_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `alumni_id` int(11) NOT NULL,
  `status` enum('Pending','Upcoming','Completed','Cancelled','Rejected') DEFAULT 'Pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `slot_id`, `student_id`, `alumni_id`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 3, '', 'none', '2026-06-16 06:45:47', '2026-06-16 06:45:47'),
(3, 1, 1, 3, 'Upcoming', 'Discuss about career\n', '2026-06-16 17:41:46', '2026-06-16 17:50:24'),
(4, 3, 1, 3, 'Upcoming', 'No reason', '2026-06-16 18:35:03', '2026-06-16 23:34:17'),
(5, 1, 1, 3, 'Pending', 'need to know', '2026-06-16 23:34:01', '2026-06-16 23:34:01');

-- --------------------------------------------------------

--
-- Table structure for table `connections`
--

CREATE TABLE `connections` (
  `id` int(11) NOT NULL,
  `user_id_1` int(11) NOT NULL,
  `user_id_2` int(11) NOT NULL,
  `status` enum('Pending','Accepted') DEFAULT 'Pending',
  `reason` text DEFAULT NULL,
  `initiated_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `connections`
--

INSERT INTO `connections` (`id`, `user_id_1`, `user_id_2`, `status`, `reason`, `initiated_by`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 'Accepted', NULL, 1, '2026-06-17 04:28:16', '2026-06-17 04:39:20');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int(11) NOT NULL,
  `alumni_id` int(11) NOT NULL,
  `company` varchar(255) NOT NULL,
  `company_logo` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `responsibilities` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `job_type` enum('Full-time','Internship','Contract','Part-time') NOT NULL,
  `industry` varchar(255) DEFAULT NULL,
  `experience_required` varchar(100) DEFAULT NULL,
  `total_spots` int(11) NOT NULL,
  `filled_spots` int(11) DEFAULT 0,
  `deadline` date NOT NULL,
  `status` enum('Open','Full','Closed') DEFAULT 'Open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `alumni_id`, `company`, `company_logo`, `title`, `description`, `responsibilities`, `location`, `job_type`, `industry`, `experience_required`, `total_spots`, `filled_spots`, `deadline`, `status`, `created_at`, `updated_at`) VALUES
(1, 3, 'HSBC', NULL, 'Pro', 'We are looking for a Senior Product Manager to join our Cloud Infrastructure team. You will lead the strategy for next-generation developer platforms, collaborating with cross-functional engineering teams to scale global operations.', NULL, 'CA', 'Internship', NULL, NULL, 10, 0, '2026-11-18', 'Closed', '2026-06-16 06:35:27', '2026-06-16 21:09:33'),
(2, 3, 'Amazon', NULL, 'Junior Web Dev', 'We are looking for a Senior Product Manager to join our Cloud Infrastructure team. You will lead the strategy for next-generation developer platforms, collaborating with cross-functional engineering teams to scale global operations.', NULL, 'Nowhere', 'Full-time', NULL, NULL, 10, 0, '2026-11-18', 'Open', '2026-06-16 21:58:49', '2026-06-16 21:58:49'),
(3, 3, 'Microsoft', NULL, 'Product Manager', 'We are looking for a Senior Product Manager to join our Cloud Infrastructure team. You will lead the strategy for next-generation developer platforms, collaborating with cross-functional engineering teams to scale global operations.', NULL, 'Nowhere', 'Internship', NULL, NULL, 5, 0, '2026-11-02', 'Open', '2026-06-16 23:10:33', '2026-06-16 23:10:33');

-- --------------------------------------------------------

--
-- Table structure for table `job_applications`
--

CREATE TABLE `job_applications` (
  `id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `alumni_id` int(11) NOT NULL,
  `cover_note` text DEFAULT NULL,
  `status` enum('Pending','Accepted','Rejected') DEFAULT 'Pending',
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `resume_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_applications`
--

INSERT INTO `job_applications` (`id`, `job_id`, `student_id`, `alumni_id`, `cover_note`, `status`, `note`, `created_at`, `updated_at`, `resume_url`) VALUES
(1, 1, 1, 3, 'none', 'Pending', NULL, '2026-06-16 06:36:24', '2026-06-16 06:36:24', NULL),
(2, 2, 1, 3, 'no note', 'Pending', NULL, '2026-06-16 22:06:54', '2026-06-16 22:06:54', '/uploads/1781626737679-257595922.pdf'),
(9, 3, 1, 3, 'no reason to give', 'Pending', NULL, '2026-06-16 23:10:55', '2026-06-16 23:10:55', '/uploads/1781626737679-257595922.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `mentorship_slots`
--

CREATE TABLE `mentorship_slots` (
  `id` int(11) NOT NULL,
  `alumni_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `is_booked` tinyint(1) DEFAULT 0,
  `meeting_url` varchar(255) DEFAULT NULL,
  `max_seats` int(11) DEFAULT 1,
  `booked_seats` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mentorship_slots`
--

INSERT INTO `mentorship_slots` (`id`, `alumni_id`, `title`, `date`, `start_time`, `end_time`, `is_booked`, `meeting_url`, `max_seats`, `booked_seats`, `created_at`, `updated_at`) VALUES
(1, 3, 'Resume Show', '2026-06-25', '14:00:00', '14:45:00', 0, 'https://meet.google.com/landing', 20, 1, '2026-06-16 05:59:23', '2026-06-16 17:50:24'),
(3, 3, 'Platform Building', '2026-06-27', '14:35:00', '15:20:00', 0, 'https://meet.google.com/landing', 15, 1, '2026-06-16 18:34:27', '2026-06-16 23:34:17'),
(4, 3, 'Backend Dev', '2026-06-24', '08:05:00', '08:50:00', 0, 'https://meet.google.com/landing', 10, 0, '2026-06-17 00:04:23', '2026-06-17 00:04:23');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `referral_requests`
--

CREATE TABLE `referral_requests` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `alumni_id` int(11) NOT NULL,
  `company` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `status` enum('Pending','Accepted','Rejected') DEFAULT 'Pending',
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `resume_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `referral_requests`
--

INSERT INTO `referral_requests` (`id`, `student_id`, `alumni_id`, `company`, `position`, `message`, `status`, `note`, `created_at`, `updated_at`, `resume_url`) VALUES
(1, 1, 3, 'Google', 'Software Engineer', 'Can you refer?', 'Rejected', NULL, '2026-06-16 19:43:01', '2026-06-16 20:09:12', NULL),
(2, 1, 3, 'Google', 'Web Dev', 'Please Refer', 'Accepted', NULL, '2026-06-16 20:09:39', '2026-06-16 20:11:54', '/uploads/1781626737679-257595922.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `resources`
--

CREATE TABLE `resources` (
  `id` int(11) NOT NULL,
  `alumni_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `resource_type` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `session_reviews`
--

CREATE TABLE `session_reviews` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `alumni_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_profiles`
--

CREATE TABLE `student_profiles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `university` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `current_year` enum('First Year','Second Year','Third Year','Final Year') NOT NULL,
  `bio` text DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `resume_url` varchar(255) DEFAULT NULL,
  `gpa` decimal(3,2) DEFAULT NULL,
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`skills`)),
  `career_interests` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`career_interests`)),
  `github_url` varchar(255) DEFAULT NULL,
  `academic_research_url` varchar(255) DEFAULT NULL,
  `personal_website_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_profiles`
--

INSERT INTO `student_profiles` (`id`, `user_id`, `university`, `department`, `current_year`, `bio`, `linkedin_url`, `resume_url`, `gpa`, `skills`, `career_interests`, `github_url`, `academic_research_url`, `personal_website_url`, `created_at`, `updated_at`) VALUES
(1, 1, 'X', 'Computer Science', 'Second Year', 'Hello There', 'https://www.google.com/?zx=1781592754070', '/uploads/1781626737679-257595922.pdf', 2.77, '[\"JavaScript\",\"React\"]', '[\"Product Management\",\"Data Science\"]', 'https://github.com/uzzal1312', NULL, NULL, '2026-06-16 05:51:16', '2026-06-16 16:33:51');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `role` enum('student','alumni','admin') NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `full_name`, `role`, `profile_picture`, `is_verified`, `created_at`, `updated_at`) VALUES
(1, 'u@gmail.com', '$2a$10$oU04K7QrxB2frO6ghjLCCOcDDHl9mu2WPPRLn8BAiAvaMOv91gITG', 'Uzzal', 'student', '/uploads/1781626737678-587863862.jpg', 1, '2026-06-16 05:51:16', '2026-06-16 16:18:57'),
(2, 'admin@alumniconnect.com', '$2b$12$x0KM914/4tUKiwvP/wgoJOJPOExdV4RQYKyn7cvFxlvPRv2tD3XCu', 'Admin User', 'admin', NULL, 1, '2026-06-16 05:56:45', '2026-06-16 05:56:45'),
(3, 'john@gmail.com', '$2a$10$iYuqoesIvSII8LJS/kmf.uVCerSHDVySvUEL8PZVzW/3yvRHerVO.', 'John', 'alumni', '', 1, '2026-06-16 05:57:51', '2026-06-16 05:57:51');

-- --------------------------------------------------------

--
-- Table structure for table `verification_queue`
--

CREATE TABLE `verification_queue` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `graduation_year` int(11) DEFAULT NULL,
  `field_of_study` varchar(255) DEFAULT NULL,
  `current_job_title` varchar(255) DEFAULT NULL,
  `current_company` varchar(255) DEFAULT NULL,
  `industry` varchar(255) DEFAULT NULL,
  `professional_bio` text DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `github_url` varchar(255) DEFAULT NULL,
  `portfolio_url` varchar(255) DEFAULT NULL,
  `research_url` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `work_history` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`work_history`)),
  `expertise` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`expertise`)),
  `referral_companies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`referral_companies`)),
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `verification_queue`
--

INSERT INTO `verification_queue` (`id`, `email`, `password`, `full_name`, `graduation_year`, `field_of_study`, `current_job_title`, `current_company`, `industry`, `professional_bio`, `linkedin_url`, `github_url`, `portfolio_url`, `research_url`, `profile_picture`, `work_history`, `expertise`, `referral_companies`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'john@gmail.com', '$2a$10$iYuqoesIvSII8LJS/kmf.uVCerSHDVySvUEL8PZVzW/3yvRHerVO.', 'John', 2024, 'CS', 'Web Dev', 'Google', 'Technology & Software', 'None', '', NULL, NULL, NULL, '', '[{\"jobTitle\":\"Manager\",\"company\":\"Chase\",\"startYear\":\"2022\",\"endYear\":\"2023\",\"isCurrent\":false,\"id\":1781589205128}]', NULL, NULL, 'Pending', NULL, '2026-06-16 05:52:46', '2026-06-16 05:53:28');

-- --------------------------------------------------------

--
-- Table structure for table `work_history`
--

CREATE TABLE `work_history` (
  `id` int(11) NOT NULL,
  `alumni_profile_id` int(11) NOT NULL,
  `job_title` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_current` tinyint(1) DEFAULT 0,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `work_history`
--

INSERT INTO `work_history` (`id`, `alumni_profile_id`, `job_title`, `company`, `location`, `start_date`, `end_date`, `is_current`, `description`, `created_at`, `updated_at`) VALUES
(1, 1, 'Developer', 'Meta', 'None', '2024-11-01', NULL, 1, 'no description', '2026-06-16 06:01:09', '2026-06-16 06:01:09'),
(2, 1, 'Senior Software Devloper', 'Google', 'America', '2025-01-01', '2025-02-01', 0, 'Worked as a Senior Software Dev', '2026-06-16 16:53:19', '2026-06-16 16:53:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alumni_profiles`
--
ALTER TABLE `alumni_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `alumni_id` (`alumni_id`),
  ADD KEY `bookings_ibfk_1` (`slot_id`);

--
-- Indexes for table `connections`
--
ALTER TABLE `connections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_connection` (`user_id_1`,`user_id_2`),
  ADD KEY `initiated_by` (`initiated_by`),
  ADD KEY `idx_user1` (`user_id_1`),
  ADD KEY `idx_user2` (`user_id_2`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alumni_id` (`alumni_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_deadline` (`deadline`);

--
-- Indexes for table `job_applications`
--
ALTER TABLE `job_applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_application` (`job_id`,`student_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `alumni_id` (`alumni_id`);

--
-- Indexes for table `mentorship_slots`
--
ALTER TABLE `mentorship_slots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_alumni_date` (`alumni_id`,`date`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `receiver_id` (`receiver_id`),
  ADD KEY `idx_conversation` (`sender_id`,`receiver_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `referral_requests`
--
ALTER TABLE `referral_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `alumni_id` (`alumni_id`);

--
-- Indexes for table `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alumni_id` (`alumni_id`);

--
-- Indexes for table `session_reviews`
--
ALTER TABLE `session_reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_booking_review` (`booking_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `alumni_id` (`alumni_id`);

--
-- Indexes for table `student_profiles`
--
ALTER TABLE `student_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- Indexes for table `verification_queue`
--
ALTER TABLE `verification_queue`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `work_history`
--
ALTER TABLE `work_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alumni_profile_id` (`alumni_profile_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alumni_profiles`
--
ALTER TABLE `alumni_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `connections`
--
ALTER TABLE `connections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `job_applications`
--
ALTER TABLE `job_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `mentorship_slots`
--
ALTER TABLE `mentorship_slots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `referral_requests`
--
ALTER TABLE `referral_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `resources`
--
ALTER TABLE `resources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `session_reviews`
--
ALTER TABLE `session_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_profiles`
--
ALTER TABLE `student_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `verification_queue`
--
ALTER TABLE `verification_queue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `work_history`
--
ALTER TABLE `work_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alumni_profiles`
--
ALTER TABLE `alumni_profiles`
  ADD CONSTRAINT `alumni_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`slot_id`) REFERENCES `mentorship_slots` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`alumni_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `connections`
--
ALTER TABLE `connections`
  ADD CONSTRAINT `connections_ibfk_1` FOREIGN KEY (`user_id_1`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `connections_ibfk_2` FOREIGN KEY (`user_id_2`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `connections_ibfk_3` FOREIGN KEY (`initiated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`alumni_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_applications`
--
ALTER TABLE `job_applications`
  ADD CONSTRAINT `job_applications_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `job_applications_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `job_applications_ibfk_3` FOREIGN KEY (`alumni_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mentorship_slots`
--
ALTER TABLE `mentorship_slots`
  ADD CONSTRAINT `mentorship_slots_ibfk_1` FOREIGN KEY (`alumni_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `referral_requests`
--
ALTER TABLE `referral_requests`
  ADD CONSTRAINT `referral_requests_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `referral_requests_ibfk_2` FOREIGN KEY (`alumni_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `resources`
--
ALTER TABLE `resources`
  ADD CONSTRAINT `resources_ibfk_1` FOREIGN KEY (`alumni_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `session_reviews`
--
ALTER TABLE `session_reviews`
  ADD CONSTRAINT `session_reviews_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `session_reviews_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `session_reviews_ibfk_3` FOREIGN KEY (`alumni_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_profiles`
--
ALTER TABLE `student_profiles`
  ADD CONSTRAINT `student_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `work_history`
--
ALTER TABLE `work_history`
  ADD CONSTRAINT `work_history_ibfk_1` FOREIGN KEY (`alumni_profile_id`) REFERENCES `alumni_profiles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
