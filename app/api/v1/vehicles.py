import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.dependencies.auth import get_current_user, require_roles
from app.models.user import UserRole
from app.models.vehicle import Vehicle, VehicleStatus
from app.schemas.vehicle import VehicleCreate, VehicleOut, VehicleUpdate

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


@router.get("", response_model=list[VehicleOut])
def list_vehicles(
    type: Optional[str] = None,
    status_filter: Optional[VehicleStatus] = Query(default=None, alias="status"),
    region: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = select(Vehicle)
    if type:
        query = query.where(Vehicle.type == type)
    if status_filter:
        query = query.where(Vehicle.status == status_filter)
    if region:
        query = query.where(Vehicle.region == region)

    query = query.offset(skip).limit(limit)
    return db.execute(query).scalars().all()


@router.get("/available", response_model=list[VehicleOut])
def list_available_vehicles(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Excludes Retired, In Shop, and On Trip — only true dispatch-ready vehicles
    query = select(Vehicle).where(Vehicle.status == VehicleStatus.AVAILABLE)
    return db.execute(query).scalars().all()


@router.get("/{vehicle_id}", response_model=VehicleOut)
def get_vehicle(
    vehicle_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    vehicle = db.get(Vehicle, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return vehicle


@router.post("", response_model=VehicleOut, status_code=status.HTTP_201_CREATED)
def create_vehicle(
    payload: VehicleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(UserRole.FLEET_MANAGER)),
):
    existing = db.execute(
        select(Vehicle).where(Vehicle.registration_number == payload.registration_number)
    ).scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A vehicle with this registration number already exists",
        )

    vehicle = Vehicle(**payload.model_dump())
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.patch("/{vehicle_id}", response_model=VehicleOut)
def update_vehicle(
    vehicle_id: uuid.UUID,
    payload: VehicleUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(UserRole.FLEET_MANAGER)),
):
    vehicle = db.get(Vehicle, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(vehicle, field, value)

    db.commit()
    db.refresh(vehicle)
    return vehicle