-- MySQL dump 10.13  Distrib 8.3.0, for macos14 (arm64)
--
-- Host: localhost    Database: dashboard
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `avg_packages_per_city`
--

LOCK TABLES `avg_packages_per_city` WRITE;
/*!40000 ALTER TABLE `avg_packages_per_city` DISABLE KEYS */;
INSERT INTO `avg_packages_per_city` VALUES ('Austin',238.74),('Boston',230.40),('Chicago',252.89),('General',238.12),('Los Angeles',238.45),('Seattle',229.42);
/*!40000 ALTER TABLE `avg_packages_per_city` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `chart`
--

LOCK TABLES `chart` WRITE;
/*!40000 ALTER TABLE `chart` DISABLE KEYS */;
INSERT INTO `chart` VALUES (3,'{\"size\": \"1x1\", \"type\": \"block\", \"title\": \"Número medio de paquetes por ruta\", \"dataFetcher\": \"avgPackagePerRoute\", \"colorPalette\": \"#F72585\"}',1,2),(4,'{\"size\": \"1x1\", \"type\": \"lines\", \"title\": \"Número de salidas por hora\", \"dataFetcher\": \"routesByDepartureHour\", \"colorPalette\": \"#F72585\", \"layoutConfig\": {\"xaxis\": {\"type\": \"category\"}}}',3,2),(5,'{\"size\": \"1x1\", \"type\": \"bar\", \"title\": \"Número de rutas por capacidad\", \"dataFetcher\": \"numberOfRoutesByCapacity\", \"colorPalette\": \"#F72585\", \"layoutConfig\": {\"xaxis\": {\"type\": \"category\"}}}',6,2),(6,'{\"size\": \"1x1\", \"type\": \"pie\", \"title\": \"Estados de los paquetes\", \"dataConfig\": {\"hole\": 0.5}, \"dataFetcher\": \"numberOfPackagesByStatus\", \"colorPalette\": [\"#F72585\", \"#480CA8\", \"#7209B7\", \"#E9E9E9\"]}',4,2),(7,'{\"size\": \"2x1\", \"type\": \"pie\", \"title\": \"Puntuación de las rutas\", \"dataFetcher\": \"numberOfRoutesByScore\", \"colorPalette\": [\"#F72585\", \"#480CA8\", \"#7209B7\", \"#E9E9E9\"]}',2,2),(8,'{\"size\": \"2x1\", \"type\": \"bar\", \"title\": \"Número de rutas por mes\", \"dataFetcher\": \"numberOfRoutesByMonth\", \"colorPalette\": \"#F72585\"}',7,2),(9,'{\"size\": \"3x1\", \"type\": \"bar\", \"title\": \"Número de rutas por día\", \"dataFetcher\": \"numberOfRoutesByDay\", \"colorPalette\": \"#F72585\"}',8,2),(10,'{\"size\": \"3x1\", \"type\": \"bar\", \"title\": \"Número de rutas por ciudad\", \"dataFetcher\": \"numberOfRoutesByCity\", \"colorPalette\": \"#F72585\", \"layoutConfig\": {\"xaxis\": {\"type\": \"category\"}}}',9,1),(11,'{\"size\": \"1x1\", \"type\": \"block\", \"title\": \"Día con mayor número de rutas\", \"dataFetcher\": \"busiestDay\", \"colorPalette\": \"#F72585\"}',5,2);
/*!40000 ALTER TABLE `chart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `chart_type`
--

LOCK TABLES `chart_type` WRITE;
/*!40000 ALTER TABLE `chart_type` DISABLE KEYS */;
INSERT INTO `chart_type` VALUES (2,'City'),(1,'General');
/*!40000 ALTER TABLE `chart_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `input_type`
--

LOCK TABLES `input_type` WRITE;
/*!40000 ALTER TABLE `input_type` DISABLE KEYS */;
INSERT INTO `input_type` VALUES (2,'Package'),(1,'Route'),(3,'Stop');
/*!40000 ALTER TABLE `input_type` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-06 20:29:12
