import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.trip import TripStatus


class TripCreate(BaseModel):
    source: str = Field(..., max_length=120)
    destination: str = Field(..., max_length=120)
    vehicle_id: uuid.UUID
    driver_id: uuid.UUID
    cargo_weight: float = Field(..., gt=0)
    planned_distance: float = Field(..., gt=0)
    revenue: Optional[float] = Field(default=None, ge=0)


class TripCompleteRequest(BaseModel):
    final_odometer: float = Field(..., gt=0)
    fuel_consumed_liters: float = Field(..., ge=0)


class TripOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    source: str
    destination: str
    vehicle_id: uuid.UUID
    driver_id: uuid.UUID
    created_by: uuid.UUID
    cargo_weight: float
    planned_distance: float
    final_odometer: Optional[float]
    fuel_consumed_liters: Optional[float]
    revenue: Optional[float]
    status: TripStatus
    dispatched_at: Optional[datetime]
    completed_at: Optional[datetime]
    cancelled_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime