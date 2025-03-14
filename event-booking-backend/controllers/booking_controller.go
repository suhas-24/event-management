package controllers

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/yourusername/event-booking-backend/models"
	"github.com/yourusername/event-booking-backend/utils"
	"gorm.io/gorm"
)

// BookingController handles all booking related operations
type BookingController struct {
	DB *gorm.DB
}

// CreateBooking handles the creation of new event bookings
func (bc *BookingController) CreateBooking(c *gin.Context) {
	var booking models.Booking
	if err := c.ShouldBindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check for time slot availability
	var conflictingBooking models.Booking
	if err := bc.DB.Where("event_date = ? AND ((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?))",
		booking.EventDate, booking.StartTime, booking.StartTime, booking.EndTime, booking.EndTime).First(&conflictingBooking).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Time slot is already booked"})
		return
	}

	// Create the booking
	if err := bc.DB.Create(&booking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
		return
	}

	// Send confirmation email
	emailConfig := utils.EmailConfig{
		SMTPHost:     os.Getenv("SMTP_HOST"),
		SMTPPort:     os.Getenv("SMTP_PORT"),
		SMTPUsername: os.Getenv("SMTP_USERNAME"),
		SMTPPassword: os.Getenv("SMTP_PASSWORD"),
		FromEmail:    os.Getenv("FROM_EMAIL"),
	}

	if err := utils.SendBookingConfirmation(booking.Email, booking.Name, emailConfig); err != nil {
		log.Printf("Failed to send booking confirmation email: %v", err)
	}

	c.JSON(http.StatusCreated, booking)
}

// GetBookings retrieves all bookings
func (bc *BookingController) GetBookings(c *gin.Context) {
	var bookings []models.Booking
	if err := bc.DB.Find(&bookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings"})
		return
	}
	c.JSON(http.StatusOK, bookings)
}

// GetBooking retrieves a specific booking by ID
func (bc *BookingController) GetBooking(c *gin.Context) {
	id := c.Param("id")
	var booking models.Booking
	if err := bc.DB.First(&booking, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}
	c.JSON(http.StatusOK, booking)
}

// UpdateBookingStatus updates the status of a booking
func (bc *BookingController) UpdateBookingStatus(c *gin.Context) {
	id := c.Param("id")
	var status struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&status); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate status value
	if status.Status != "pending" && status.Status != "confirmed" && status.Status != "cancelled" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status value"})
		return
	}

	// Update booking status
	var booking models.Booking
	if err := bc.DB.First(&booking, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	if err := bc.DB.Model(&booking).Update("status", status.Status).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update booking status"})
		return
	}

	c.JSON(http.StatusOK, booking)
}
