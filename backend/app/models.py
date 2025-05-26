from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    company = Column(String)
    product_interest = Column(String)
    stage = Column(String, default="New")  # New, Contacted, Qualified, Proposal Sent, Won, Lost
    follow_up_date = Column(DateTime)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # One-to-many relationship: One lead can have many orders
    orders = relationship("Order", back_populates="lead")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"))
    status = Column(String, default="Order Received")  # Order Received, In Development, Ready to Dispatch, Dispatched
    dispatch_date = Column(DateTime)
    courier = Column(String)
    tracking_number = Column(String)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Many-to-one relationship: Order belongs to one lead
    lead = relationship("Lead", back_populates="orders")
