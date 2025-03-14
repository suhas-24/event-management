package models

import "time"

type Booking struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" binding:"required"`
	Email       string    `json:"email" binding:"required,email"`
	Phone       string    `json:"phone" binding:"required"`
	EventDate   time.Time `json:"event_date" binding:"required"`
	StartTime   time.Time `json:"start_time" binding:"required"`
	EndTime     time.Time `json:"end_time" binding:"required"`
	EventType   string    `json:"event_type" binding:"required"`
	Guests      int       `json:"guests" binding:"required"`
	Notes       string    `json:"notes"`
	Status      string    `json:"status" gorm:"default:'pending'"` // pending, confirmed, cancelled
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}