package models

import "time"

type Hall struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Capacity    int       `json:"capacity" gorm:"not null"`
	BasePrice   float64   `json:"basePrice" gorm:"not null"`
	WeekendRate float64   `json:"weekendRate" gorm:"not null;default:0"`
	PeakRate    float64   `json:"peakRate" gorm:"not null;default:0"`
	Features    string    `json:"features" gorm:"type:text"`
	CreatedAt   time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}
