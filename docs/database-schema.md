# TransitOps Database Schema

## Users
| Field | Type |
|-------|------|
| id | UUID |
| name | VARCHAR |
| email | VARCHAR (Unique) |
| password | VARCHAR |
| role | ENUM(admin, operator) |
| created_at | TIMESTAMP |

---

## Vehicles
| Field | Type |
|-------|------|
| id | UUID |
| vehicle_number | VARCHAR |
| type | VARCHAR |
| capacity | INTEGER |
| status | ENUM(Available, On Trip, Maintenance) |
| created_at | TIMESTAMP |

---

## Drivers
| Field | Type |
|-------|------|
| id | UUID |
| name | VARCHAR |
| phone | VARCHAR |
| license_number | VARCHAR |
| status | ENUM(Available, Driving, Leave) |
| created_at | TIMESTAMP |

---

## Trips
| Field | Type |
|-------|------|
| id | UUID |
| vehicle_id | UUID |
| driver_id | UUID |
| source | VARCHAR |
| destination | VARCHAR |
| departure_time | TIMESTAMP |
| arrival_time | TIMESTAMP |
| status | ENUM(Scheduled, Active, Completed) |
| created_at | TIMESTAMP |