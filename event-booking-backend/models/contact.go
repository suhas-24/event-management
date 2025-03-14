package models

import "time"

type Contact struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" binding:"required"`
	Email     string    `json:"email" binding:"required,email"`
	Phone     string    `json:"phone"`
	Subject   string    `json:"subject" binding:"required"`
	Message   string    `json:"message" binding:"required"`
	Status    string    `json:"status" gorm:"default:'unread'"` // unread, read, replied
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
