import uuid
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class FuelLogCreate(BaseModel):
    vehicle_id: uuid.UUID
    trip_id: Optional[uuid.UUID] = None
    liters: float = Field(..., gt=0)
    cost: float = Field(..., ge=0)
    log_date: date


class FuelLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    vehicle_id: uuid.UUID
    trip_id: Optional[uuid.UUID]
    liters: float
    cost: float
    log_date: date
    created_at: datetime


class ExpenseCreate(BaseModel):
    vehicle_id: uuid.UUID
    category: str = Field(..., max_length=50)
    amount: float = Field(..., ge=0)
    expense_date: date


class ExpenseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    vehicle_id: uuid.UUID
    category: str
    amount: float
    expense_date: date
    created_at: datetime