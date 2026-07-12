import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.dependencies.auth import get_current_user
from app.models.expense import Expense
from app.models.fuel_log import FuelLog
from app.models.vehicle import Vehicle
from app.schemas.fuel_expense import (
    ExpenseCreate,
    ExpenseOut,
    FuelLogCreate,
    FuelLogOut,
)

router = APIRouter(prefix="/expenses", tags=["expenses"])


def _ensure_vehicle_exists(db: Session, vehicle_id: uuid.UUID) -> None:
    if not db.get(Vehicle, vehicle_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")


# --- Fuel logs ---

@router.get("/fuel", response_model=list[FuelLogOut])
def list_fuel_logs(
    vehicle_id: Optional[uuid.UUID] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = select(FuelLog)
    if vehicle_id:
        query = query.where(FuelLog.vehicle_id == vehicle_id)
    return db.execute(query.order_by(FuelLog.log_date.desc())).scalars().all()


@router.post("/fuel", response_model=FuelLogOut, status_code=status.HTTP_201_CREATED)
def create_fuel_log(
    payload: FuelLogCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _ensure_vehicle_exists(db, payload.vehicle_id)
    fuel_log = FuelLog(**payload.model_dump())
    db.add(fuel_log)
    db.commit()
    db.refresh(fuel_log)
    return fuel_log


# --- Other expenses (tolls, parking, etc.) ---

@router.get("", response_model=list[ExpenseOut])
def list_expenses(
    vehicle_id: Optional[uuid.UUID] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = select(Expense)
    if vehicle_id:
        query = query.where(Expense.vehicle_id == vehicle_id)
    return db.execute(query.order_by(Expense.expense_date.desc())).scalars().all()


@router.post("", response_model=ExpenseOut, status_code=status.HTTP_201_CREATED)
def create_expense(
    payload: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _ensure_vehicle_exists(db, payload.vehicle_id)
    expense = Expense(**payload.model_dump())
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense