from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Order, Lead
from ..schemas import Order as OrderSchema, OrderCreate, OrderUpdate

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=OrderSchema)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    try:
        lead = db.query(Lead).filter(Lead.id == order.lead_id).first()
        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        db_order = Order(**order.dict())
        db.add(db_order)
        db.commit()
        db.refresh(db_order)
        return db_order
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating order: {str(e)}")

@router.get("/", response_model=List[OrderSchema])
def get_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        orders = db.query(Order).offset(skip).limit(limit).all()
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching orders: {str(e)}")

@router.get("/{order_id}", response_model=OrderSchema)
def get_order(order_id: int, db: Session = Depends(get_db)):
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if order is None:
            raise HTTPException(status_code=404, detail="Order not found")
        return order
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching order: {str(e)}")

@router.put("/{order_id}", response_model=OrderSchema)
def update_order(order_id: int, order_update: OrderUpdate, db: Session = Depends(get_db)):
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if order is None:
            raise HTTPException(status_code=404, detail="Order not found")
        
        for field, value in order_update.dict(exclude_unset=True).items():
            setattr(order, field, value)
        
        db.commit()
        db.refresh(order)
        return order
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating order: {str(e)}")

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if order is None:
            raise HTTPException(status_code=404, detail="Order not found")
        
        db.delete(order)
        db.commit()
        return {"message": "Order deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting order: {str(e)}")
