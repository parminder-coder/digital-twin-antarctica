-- ============================================================================
-- Database: antarctic_station_db
-- Description: Optimized MySQL 8.4 DDL schema for remote IoT monitoring of 
--              Indian Antarctic research stations (Bharati, Maitri, Dakshin Gangotri).
-- MySQL Version: 8.4+
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `antarctic_station_db`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE `antarctic_station_db`;

-- ----------------------------------------------------------------------------
-- 1. Table: stations
-- Represents Indian research stations operating in Antarctica.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `stations` (
    `station_id`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `station_name` VARCHAR(100) NOT NULL,
    `station_code` CHAR(3) NOT NULL,
    `latitude`     DECIMAL(9,6) NOT NULL,
    `longitude`    DECIMAL(9,6) NOT NULL,
    `elevation_m`  DECIMAL(6,2) NOT NULL,
    `capacity`     SMALLINT UNSIGNED NOT NULL,
    `status`       ENUM('operational', 'maintenance', 'decommissioned', 'seasonal_unmanned') NOT NULL,

    -- Constraints
    CONSTRAINT `pk_stations` PRIMARY KEY (`station_id`),
    CONSTRAINT `uq_stations_station_name` UNIQUE (`station_name`),
    CONSTRAINT `uq_stations_station_code` UNIQUE (`station_code`),
    CONSTRAINT `chk_stations_latitude` CHECK (`latitude` BETWEEN -90.000000 AND 90.000000),
    CONSTRAINT `chk_stations_longitude` CHECK (`longitude` BETWEEN -180.000000 AND 180.000000),
    CONSTRAINT `chk_stations_elevation` CHECK (`elevation_m` BETWEEN -500.00 AND 9000.00),
    CONSTRAINT `chk_stations_capacity` CHECK (`capacity` >= 0)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci
  COMMENT = 'Master registry of Antarctic research stations';

-- ----------------------------------------------------------------------------
-- 2. Table: infrastructure
-- Station hardware, life support systems, communications, generators, labs.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `infrastructure` (
    `infrastructure_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `station_id`        INT UNSIGNED NOT NULL,
    `component_name`    VARCHAR(150) NOT NULL,
    `component_type`    VARCHAR(50) NOT NULL,
    `description`       TEXT NULL,
    `status`            ENUM('online', 'degraded', 'offline', 'maintenance') NOT NULL,

    -- Constraints
    CONSTRAINT `pk_infrastructure` PRIMARY KEY (`infrastructure_id`),
    CONSTRAINT `fk_infrastructure_station` 
        FOREIGN KEY (`station_id`) REFERENCES `stations` (`station_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,

    -- Dashboard filtering index (station + component health status)
    INDEX `idx_infrastructure_station_status` (`station_id`, `status`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci
  COMMENT = 'Station infrastructure components and active health status';

-- ----------------------------------------------------------------------------
-- 3. Table: weather_data
-- Time-series telemetry stream for meteorological observations.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `weather_data` (
    `weather_id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `station_id`            INT UNSIGNED NOT NULL,
    `recorded_at`           DATETIME(3) NOT NULL,
    `temperature_c`         DECIMAL(4,1) NOT NULL,
    `relative_humidity_pct` DECIMAL(4,1) NOT NULL,
    `air_pressure_hpa`      DECIMAL(6,1) NOT NULL,
    `wind_speed_mps`        DECIMAL(4,1) NOT NULL,
    `wind_direction_deg`    DECIMAL(4,1) NOT NULL,

    -- Constraints
    CONSTRAINT `pk_weather_data` PRIMARY KEY (`weather_id`),
    CONSTRAINT `fk_weather_data_station` 
        FOREIGN KEY (`station_id`) REFERENCES `stations` (`station_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `chk_weather_temperature` CHECK (`temperature_c` BETWEEN -90.0 AND 90.0),
    CONSTRAINT `chk_weather_humidity` CHECK (`relative_humidity_pct` BETWEEN 0.0 AND 100.0),
    CONSTRAINT `chk_weather_pressure` CHECK (`air_pressure_hpa` > 0.0),
    CONSTRAINT `chk_weather_wind_speed` CHECK (`wind_speed_mps` >= 0.0),
    CONSTRAINT `chk_weather_wind_direction` CHECK (`wind_direction_deg` BETWEEN 0.0 AND 360.0),

    -- Primary time-series range scan index (Station + Timestamp)
    INDEX `idx_weather_station_recorded_at` (`station_id`, `recorded_at`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci
  COMMENT = 'High-frequency meteorological IoT sensor observations';

-- ----------------------------------------------------------------------------
-- 4. Table: energy_data
-- Time-series telemetry for power generation and storage (Diesel, Solar, Wind, Batteries).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `energy_data` (
    `energy_id`     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `station_id`    INT UNSIGNED NOT NULL,
    `recorded_at`   DATETIME(3) NOT NULL,
    `energy_source` ENUM('diesel', 'solar', 'wind', 'battery_bank') NOT NULL,
    `parameter`     VARCHAR(50) NOT NULL,
    `value`         DECIMAL(10,2) NOT NULL,
    `unit`          VARCHAR(20) NOT NULL,

    -- Constraints
    CONSTRAINT `pk_energy_data` PRIMARY KEY (`energy_id`),
    CONSTRAINT `fk_energy_data_station` 
        FOREIGN KEY (`station_id`) REFERENCES `stations` (`station_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,

    -- Primary time-series range scan index
    INDEX `idx_energy_station_recorded_at` (`station_id`, `recorded_at`),
    -- Composite index for targeting specific power metrics per source (e.g. Solar Voltage over time)
    INDEX `idx_energy_station_source_param_recorded` (`station_id`, `energy_source`, `parameter`, `recorded_at`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci
  COMMENT = 'Power generation, microgrid status, and storage metrics';

-- ----------------------------------------------------------------------------
-- 5. Table: fuel_data
-- Telemetry tracking fuel levels, reserves, and consumption rates (e.g. Jet A-1 / LDO).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `fuel_data` (
    `fuel_id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `station_id`           INT UNSIGNED NOT NULL,
    `recorded_at`          DATETIME(3) NOT NULL,
    `fuel_type`            VARCHAR(50) NOT NULL,
    `quantity`             DECIMAL(10,2) NOT NULL,
    `unit`                 VARCHAR(20) NOT NULL,
    `consumption_rate_lph` DECIMAL(8,2) NULL,
    `storage_capacity`     DECIMAL(10,2) NOT NULL,

    -- Constraints
    CONSTRAINT `pk_fuel_data` PRIMARY KEY (`fuel_id`),
    CONSTRAINT `fk_fuel_data_station` 
        FOREIGN KEY (`station_id`) REFERENCES `stations` (`station_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `chk_fuel_quantity_nonnegative` CHECK (`quantity` >= 0.00),
    CONSTRAINT `chk_fuel_storage_capacity_nonnegative` CHECK (`storage_capacity` >= 0.00),
    CONSTRAINT `chk_fuel_quantity_within_capacity` CHECK (`quantity` <= `storage_capacity`),
    CONSTRAINT `chk_fuel_consumption_rate_nonnegative` CHECK (`consumption_rate_lph` IS NULL OR `consumption_rate_lph` >= 0.00),

    -- Primary time-series range scan index
    INDEX `idx_fuel_station_recorded_at` (`station_id`, `recorded_at`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci
  COMMENT = 'Fuel storage levels and active burn rates';

-- ----------------------------------------------------------------------------
-- 6. Table: inventory
-- Current state of station supplies, food, medical, spare parts, and equipment.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory` (
    `inventory_id`     INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `station_id`        INT UNSIGNED NOT NULL,
    `item_name`         VARCHAR(150) NOT NULL,
    `category`          VARCHAR(50) NOT NULL,
    `quantity`          DECIMAL(10,2) NOT NULL,
    `unit`              VARCHAR(20) NOT NULL,
    `minimum_quantity`  DECIMAL(10,2) NOT NULL,
    `last_updated`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    
    -- Stored generated column for rapid low-stock indexing & querying
    `low_stock`         BOOLEAN GENERATED ALWAYS AS (`quantity` <= `minimum_quantity`) STORED NOT NULL,

    -- Constraints
    CONSTRAINT `pk_inventory` PRIMARY KEY (`inventory_id`),
    CONSTRAINT `fk_inventory_station` 
        FOREIGN KEY (`station_id`) REFERENCES `stations` (`station_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `uq_inventory_station_item` UNIQUE (`station_id`, `item_name`),
    CONSTRAINT `chk_inventory_quantity_nonnegative` CHECK (`quantity` >= 0.00),
    CONSTRAINT `chk_inventory_min_quantity_nonnegative` CHECK (`minimum_quantity` >= 0.00),

    -- Index optimized for dashboard low-stock alerts
    INDEX `idx_inventory_station_low_stock` (`station_id`, `low_stock`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci
  COMMENT = 'Station supply inventory and stock threshold tracking';

-- ----------------------------------------------------------------------------
-- 7. Table: alerts
-- System and automated threshold alerts triggered by IoT anomaly detection.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `alerts` (
    `alert_id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `station_id`        INT UNSIGNED NOT NULL,
    `infrastructure_id` INT UNSIGNED NULL,
    `alert_type`        VARCHAR(50) NOT NULL,
    `severity`          ENUM('info', 'warning', 'critical', 'emergency') NOT NULL,
    `parameter`         VARCHAR(50) NULL,
    `current_value`     VARCHAR(100) NULL,
    `threshold`         VARCHAR(100) NULL,
    `message`           TEXT NOT NULL,
    `created_at`        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status`            ENUM('active', 'acknowledged', 'resolved') NOT NULL,

    -- Constraints
    CONSTRAINT `pk_alerts` PRIMARY KEY (`alert_id`),
    CONSTRAINT `fk_alerts_station` 
        FOREIGN KEY (`station_id`) REFERENCES `stations` (`station_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_alerts_infrastructure` 
        FOREIGN KEY (`infrastructure_id`) REFERENCES `infrastructure` (`infrastructure_id`)
        ON DELETE SET NULL ON UPDATE CASCADE,

    -- Dashboard alert feed composite index
    INDEX `idx_alerts_station_status_created_at` (`station_id`, `status`, `created_at`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci
  COMMENT = 'IoT anomaly events and system incident log';
