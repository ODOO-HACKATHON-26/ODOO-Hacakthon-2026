import uuid

from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.models.driver import Driver, DriverStatus
from app.models.fuel_log import FuelLog
from app.models.trip import Trip, TripStatus
from app.models.vehicle import Vehicle, VehicleStatus
from app.schemas.report import DashboardKPIs, VehicleReport
from app.services import cost_service


def get_dashboard_kpis(db: Session) -> DashboardKPIs:
    total_active = db.execute(
        select(func.count()).select_from(Vehicle).where(Vehicle.status != VehicleStatus.RETIRED)
    ).scalar_one()

    available = db.execute(
        select(func.count()).select_from(Vehicle).where(Vehicle.status == VehicleStatus.AVAILABLE)
    ).scalar_one()

    in_maintenance = db.execute(
        select(func.count()).select_from(Vehicle).where(Vehicle.status == VehicleStatus.IN_SHOP)
    ).scalar_one()

    on_trip_vehicles = db.execute(
        select(func.count()).select_from(Vehicle).where(Vehicle.status == VehicleStatus.ON_TRIP)
    ).scalar_one()

    active_trips = db.execute(
        select(func.count()).select_from(Trip).where(Trip.status == TripStatus.DISPATCHED)
    ).scalar_one()

    pending_trips = db.execute(
        select(func.count()).select_from(Trip).where(Trip.status == TripStatus.DRAFT)
    ).scalar_one()

    drivers_on_duty = db.execute(
        select(func.count()).select_from(Driver).where(Driver.status == DriverStatus.ON_TRIP)
    ).scalar_one()

    utilization = (on_trip_vehicles / total_active * 100) if total_active > 0 else 0.0

    return DashboardKPIs(
        active_vehicles=total_active,
        available_vehicles=available,
        vehicles_in_maintenance=in_maintenance,
        active_trips=active_trips,
        pending_trips=pending_trips,
        drivers_on_duty=drivers_on_duty,
        fleet_utilization_percent=round(utilization, 2),
    )


def get_vehicle_report(db: Session, vehicle_id: uuid.UUID) -> VehicleReport | None:
    vehicle = db.get(Vehicle, vehicle_id)
    if not vehicle:
        return None

    total_distance = db.execute(
        select(func.coalesce(func.sum(Trip.planned_distance), 0)).where(
            Trip.vehicle_id == vehicle_id, Trip.status == TripStatus.COMPLETED
        )
    ).scalar_one()

    total_fuel_liters = db.execute(
        select(func.coalesce(func.sum(FuelLog.liters), 0)).where(FuelLog.vehicle_id == vehicle_id)
    ).scalar_one()

    total_revenue = db.execute(
        select(func.coalesce(func.sum(Trip.revenue), 0)).where(
            Trip.vehicle_id == vehicle_id, Trip.status == TripStatus.COMPLETED
        )
    ).scalar_one()

    total_fuel_cost = cost_service.get_total_fuel_cost(db, vehicle_id)
    total_maintenance_cost = cost_service.get_total_maintenance_cost(db, vehicle_id)
    total_other_expenses = cost_service.get_total_other_expenses(db, vehicle_id)
    total_operational_cost = total_fuel_cost + total_maintenance_cost + total_other_expenses

    fuel_efficiency = (
        float(total_distance) / float(total_fuel_liters) if total_fuel_liters else None
    )

    acquisition_cost = float(vehicle.acquisition_cost)
    roi = (
        (float(total_revenue) - (total_maintenance_cost + total_fuel_cost)) / acquisition_cost
        if acquisition_cost > 0
        else None
    )

    return VehicleReport(
        vehicle_id=vehicle.id,
        registration_number=vehicle.registration_number,
        total_distance=float(total_distance),
        total_fuel_liters=float(total_fuel_liters),
        fuel_efficiency=fuel_efficiency,
        total_fuel_cost=total_fuel_cost,
        total_maintenance_cost=total_maintenance_cost,
        total_other_expenses=total_other_expenses,
        total_operational_cost=total_operational_cost,
        total_revenue=float(total_revenue),
        roi=roi,
    )


def get_all_vehicle_reports(db: Session) -> list[VehicleReport]:
    vehicle_ids = db.execute(select(Vehicle.id)).scalars().all()
    reports = [get_vehicle_report(db, vid) for vid in vehicle_ids]
    return [r for r in reports if r is not None]