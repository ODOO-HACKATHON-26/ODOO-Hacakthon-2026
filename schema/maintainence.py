import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.maintenance import MaintenanceStatus


class MaintenanceCreate(BaseModel):
    vehicle_id: uuid.UUID
    description: str = Field(..., max_length=255)
    cost: float = Field(default=0, ge=0)


class MaintenanceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    vehicle_id: uuid.UUID
    description: str
    cost: float
    status: MaintenanceStatus
    opened_at: datetime
    closed_at: Optional[datetime]