import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.dependencies.auth import get_current_user, require_roles
from app.models.maintenance import MaintenanceLog, MaintenanceStatus
from app.models.user import UserRole
from app.schemas.maintenance import MaintenanceCreate, MaintenanceOut
from app.services import maintenance_service

router = APIRouter(prefix="/maintenance", tags=["maintenance"])


@router.get("", response_model=list[MaintenanceOut])
def list_maintenance(
    vehicle_id: Optional[uuid.UUID] = None,
    status_filter: Optional[MaintenanceStatus] = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = select(MaintenanceLog)
    if vehicle_id:
        query = query.where(MaintenanceLog.vehicle_id == vehicle_id)
    if status_filter:
        query = query.where(MaintenanceLog.status == status_filter)
    return db.execute(query.order_by(MaintenanceLog.opened_at.desc())).scalars().all()


@router.post("", response_model=MaintenanceOut, status_code=status.HTTP_201_CREATED)
def open_maintenance(
    payload: MaintenanceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(UserRole.FLEET_MANAGER)),
):
    return maintenance_service.open_maintenance(db, payload)


@router.post("/{maintenance_id}/close", response_model=MaintenanceOut)
def close_maintenance(
    maintenance_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(UserRole.FLEET_MANAGER)),
):
    return maintenance_service.close_maintenance(db, maintenance_id)