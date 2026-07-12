import enum
import uuid
from datetime import datetime

from sqlalchemy import String, DateTime, Numeric, Integer, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class VehicleStatus(str, enum.Enum):
    AVAILABLE = "available"
    ON_TRIP = "on_trip"
    IN_SHOP = "in_shop"
    RETIRED = "retired"


class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    registration_number: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False, index=True
    )
    name_model: Mapped[str] = mapped_column(String(120), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    max_load_capacity: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    odometer: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    acquisition_cost: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    region: Mapped[str] = mapped_column(String(80), nullable=True)
    status: Mapped[VehicleStatus] = mapped_column(
        String(20), nullable=False, default=VehicleStatus.AVAILABLE
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    def __repr__(self) -> str:
        return f"<Vehicle id={self.id} reg={self.registration_number} status={self.status}>"