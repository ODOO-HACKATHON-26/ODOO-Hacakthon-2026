import enum
import uuid
from datetime import datetime

from sqlalchemy import String, DateTime, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class TripStatus(str, enum.Enum):
    DRAFT = "draft"
    DISPATCHED = "dispatched"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    source: Mapped[str] = mapped_column(String(120), nullable=False)
    destination: Mapped[str] = mapped_column(String(120), nullable=False)

    vehicle_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("vehicles.id", ondelete="RESTRICT"), nullable=False
    )
    driver_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("drivers.id", ondelete="RESTRICT"), nullable=False
    )
    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )

    cargo_weight: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    planned_distance: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    final_odometer: Mapped[float] = mapped_column(Numeric(12, 2), nullable=True)
    fuel_consumed_liters: Mapped[float] = mapped_column(Numeric(10, 2), nullable=True)

    # NOTE: not part of the original spec's entity list — added so Vehicle ROI
    # (Revenue - (Maintenance + Fuel)) / Acquisition Cost is actually computable.
    # Flagged as an explicit assumption in the architecture doc.
    revenue: Mapped[float] = mapped_column(Numeric(12, 2), nullable=True)

    status: Mapped[TripStatus] = mapped_column(
        String(20), nullable=False, default=TripStatus.DRAFT
    )

    dispatched_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    cancelled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    def __repr__(self) -> str:
        return f"<Trip id={self.id} status={self.status}>"