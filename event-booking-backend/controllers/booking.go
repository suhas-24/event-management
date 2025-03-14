package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"event-booking-backend/models"
	"event-booking-backend/services"
)

type BookingController struct {
	db    *gorm.DB
	email *services.EmailService
}

func NewBookingController(db *gorm.DB, email *services.EmailService) *BookingController {
	return &BookingController{
		db:    db,
		email: email,
	}
}

// CreateBooking handles new booking requests
func (c *BookingController) CreateBooking(ctx *gin.Context) {
	var request models.BookingRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate event date is in the future
	if request.EventDate.Before(time.Now()) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Event date must be in the future"})
		return
	}

	// Check hall availability
	var existingBooking models.Booking
	result := c.db.Where("hall_id = ? AND DATE(event_date) = DATE(?) AND start_time = ? AND status != ?",
		request.HallID, request.EventDate, request.StartTime, models.StatusCancelled).First(&existingBooking)

	if result.Error == nil {
		ctx.JSON(http.StatusConflict, gin.H{"error": "This time slot is already booked"})
		return
	}

	// Get hall details for pricing
	var hall models.Hall
	if err := c.db.First(&hall, "id = ?", request.HallID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Hall not found"})
		return
	}

	// Calculate total price
	totalPrice := hall.BasePrice
	if isWeekend(request.EventDate) {
		totalPrice += hall.WeekendRate
	}
	if isPeakHour(request.StartTime) {
		totalPrice += hall.PeakRate
	}

	// Create booking
	booking := &models.Booking{
		ID:              generateBookingID(),
		HallID:          request.HallID,
		CustomerName:    request.CustomerName,
		CustomerEmail:   request.CustomerEmail,
		CustomerPhone:   request.CustomerPhone,
		GuestCount:      request.GuestCount,
		EventDate:       request.EventDate,
		StartTime:       request.StartTime,
		EndTime:         calculateEndTime(request.StartTime),
		SpecialRequests: request.SpecialRequests,
		Status:          models.StatusPending,
		TotalPrice:      totalPrice,
	}

	if err := c.db.Create(booking).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
		return
	}

	// Send notifications
	go func() {
		if err := c.email.SendBookingConfirmation(booking); err != nil {
			// Log error but don't fail the request
			println("Failed to send customer confirmation:", err.Error())
		}
		if err := c.email.SendAdminNotification(booking); err != nil {
			println("Failed to send admin notification:", err.Error())
		}
	}()

	ctx.JSON(http.StatusCreated, models.BookingResponse{
		ID:            booking.ID,
		Status:        booking.Status,
		BookingDetail: *booking,
	})
}

// GetBookings returns all bookings (admin only)
func (c *BookingController) GetBookings(ctx *gin.Context) {
	var bookings []models.Booking
	if err := c.db.Find(&bookings).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings"})
		return
	}
	ctx.JSON(http.StatusOK, bookings)
}

// UpdateBookingStatus updates the status of a booking (admin only)
func (c *BookingController) UpdateBookingStatus(ctx *gin.Context) {
	bookingID := ctx.Param("id")
	var request struct {
		Status models.BookingStatus `json:"status" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var booking models.Booking
	if err := c.db.First(&booking, "id = ?", bookingID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	booking.Status = request.Status
	if err := c.db.Save(&booking).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update booking"})
		return
	}

	ctx.JSON(http.StatusOK, booking)
}

// Helper functions
func isWeekend(date time.Time) bool {
	day := date.Weekday()
	return day == time.Saturday || day == time.Sunday
}

func isPeakHour(timeStr string) bool {
	hour := timeStr[:2]
	return hour >= "18" && hour <= "22" // 6 PM to 10 PM
}

func calculateEndTime(startTime string) string {
	// Add 2 hours to start time
	t, _ := time.Parse("15:04", startTime)
	endTime := t.Add(2 * time.Hour)
	return endTime.Format("15:04")
}

func generateBookingID() string {
	return fmt.Sprintf("BK%d", time.Now().UnixNano())
}
