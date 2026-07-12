import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.vehicle import VehicleStatus


class VehicleCreate(BaseModel):
    registration_number: str = Field(..., max_length=50)
    name_model: str = Field(..., max_length=120)
    type: str = Field(..., max_length=50)
    max_load_capacity: float = Field(..., gt=0)
    odometer: float = Field(default=0, ge=0)
    acquisition_cost: float = Field(..., ge=0)
    region: Optional[str] = None


class VehicleUpdate(BaseModel):
    name_model: Optional[str] = None
    type: Optional[str] = None
    max_load_capacity: Optional[float] = Field(default=None, gt=0)
    odometer: Optional[float] = Field(default=None, ge=0)
    acquisition_cost: Optional[float] = Field(default=None, ge=0)
    region: Optional[str] = None
    status: Optional[VehicleStatus] = None


class VehicleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    registration_number: str
    name_model: str
    type: str
    max_load_capacity: float
    odometer: float
    acquisition_cost: float
    region: Optional[str]
    status: VehicleStatus
    created_at: datetime
    updated_at: datetime