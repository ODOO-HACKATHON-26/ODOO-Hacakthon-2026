import uuid
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.driver import DriverStatus


class DriverCreate(BaseModel):
    name: str = Field(..., max_length=120)
    license_number: str = Field(..., max_length=50)
    license_category: str = Field(..., max_length=30)
    license_expiry_date: date
    contact_number: str = Field(..., max_length=20)
    safety_score: int = Field(default=100, ge=0, le=100)


class DriverUpdate(BaseModel):
    name: Optional[str] = None
    license_category: Optional[str] = None
    license_expiry_date: Optional[date] = None
    contact_number: Optional[str] = None
    safety_score: Optional[int] = Field(default=None, ge=0, le=100)
    status: Optional[DriverStatus] = None


class DriverOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    license_number: str
    license_category: str
    license_expiry_date: date
    contact_number: str
    safety_score: int
    status: DriverStatus
    created_at: datetime
    updated_at: datetime