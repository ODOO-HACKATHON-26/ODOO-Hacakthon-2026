import uuid
from typing import Optional

from pydantic import BaseModel


class DashboardKPIs(BaseModel):
    active_vehicles: int          # not Retired
    available_vehicles: int
    vehicles_in_maintenance: int
    active_trips: int             # Dispatched
    pending_trips: int            # Draft
    drivers_on_duty: int          # On Trip
    fleet_utilization_percent: float


class VehicleReport(BaseModel):
    vehicle_id: uuid.UUID
    registration_number: str
    total_distance: float
    total_fuel_liters: float
    fuel_efficiency: Optional[float]   # distance / fuel liters
    total_fuel_cost: float
    total_maintenance_cost: float
    total_other_expenses: float
    total_operational_cost: float
    total_revenue: float
    roi: Optional[float]               # (revenue - (maintenance + fuel)) / acquisition_cost