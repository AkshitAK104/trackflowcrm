from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LeadBase(BaseModel):
    name: str
    contact: str
    company: Optional[str] = None
    product_interest: Optional[str] = None
    stage: str = "New"
    follow_up_date: Optional[datetime] = None
    notes: Optional[str] = None

class LeadCreate(LeadBase):
    pass

class LeadUpdate(BaseModel):
    name: Optional[str] = None
    contact: Optional[str] = None
    company: Optional[str] = None
    product_interest: Optional[str] = None
    stage: Optional[str] = None
    follow_up_date: Optional[datetime] = None
    notes: Optional[str] = None

class Lead(LeadBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    lead_id: int
    status: str = "Order Received"
    dispatch_date: Optional[datetime] = None
    courier: Optional[str] = None
    tracking_number: Optional[str] = None
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    dispatch_date: Optional[datetime] = None
    courier: Optional[str] = None
    tracking_number: Optional[str] = None
    notes: Optional[str] = None

class Order(OrderBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
