package models

import (
	"time"
)

type BookingStatus string

const (
	StatusPending   BookingStatus = "pending"
	StatusConfirmed BookingStatus = "confirmed"
	StatusCancelled BookingStatus = "cancelled"
)

type Booking struct {
	ID              string        `json:"id" gorm:"column:id;type:text;primaryKey"`
	HallID          string        `json:"hallId" gorm:"column:hall_id;type:text;not null"`
	CustomerName    string        `json:"customerName" gorm:"column:customer_name;type:text;not null"`
	CustomerEmail   string        `json:"customerEmail" gorm:"column:customer_email;type:text;not null"`
	CustomerPhone   string        `json:"customerPhone" gorm:"column:customer_phone;type:text;not null"`
	GuestCount      int           `json:"guestCount" gorm:"column:guest_count;not null"`
	EventDate       time.Time     `json:"eventDate" gorm:"column:event_date;not null"`
	StartTime       string        `json:"startTime" gorm:"column:start_time;type:text;not null"`
	EndTime         string        `json:"endTime" gorm:"column:end_time;type:text;not null"`
	SpecialRequests string        `json:"specialRequests" gorm:"column:special_requests;type:text"`
	Status          BookingStatus `json:"status" gorm:"column:status;type:text;not null;default:pending"`
	TotalPrice      float64       `json:"totalPrice" gorm:"column:total_price;not null"`
	CreatedAt       time.Time     `json:"createdAt" gorm:"column:created_at;autoCreateTime"`
	UpdatedAt       time.Time     `json:"updatedAt" gorm:"column:updated_at;autoUpdateTime"`
}

type BookingRequest struct {
	HallID          string    `json:"hallId" binding:"required"`
	CustomerName    string    `json:"customerName" binding:"required"`
	CustomerEmail   string    `json:"customerEmail" binding:"required,email"`
	CustomerPhone   string    `json:"customerPhone" binding:"required"`
	GuestCount      int       `json:"guestCount" binding:"required,min=1"`
	EventDate       time.Time `json:"eventDate" binding:"required"`
	StartTime       string    `json:"startTime" binding:"required"`
	SpecialRequests string    `json:"specialRequests"`
}

type BookingResponse struct {
	ID            string        `json:"id"`
	Status        BookingStatus `json:"status"`
	BookingDetail Booking       `json:"bookingDetail"`
}
