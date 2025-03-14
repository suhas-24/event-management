package routes

import (
	"event-booking-backend/controllers"
	"event-booking-backend/middlewares"

	"github.com/gin-gonic/gin"
)

// SetupRoutes configures all the routes for the application
func SetupRoutes(r *gin.Engine) {
	// Initialize controllers
	bookingController := &controllers.BookingController{}
	contactController := &controllers.ContactController{}

	// API group
	api := r.Group("/api")
	{
		// Booking routes
		bookings := api.Group("/bookings", middlewares.AuthMiddleware())
		{
			bookings.POST("/", bookingController.CreateBooking)
			bookings.GET("/", bookingController.GetBookings)
			bookings.GET("/:id", bookingController.GetBooking)
			bookings.PUT("/:id/status", bookingController.UpdateBookingStatus)
		}

		// Contact routes
		contacts := api.Group("/contacts")
		{
			contacts.POST("/", contactController.CreateContact)
			contacts.GET("/", contactController.GetContacts)
			contacts.GET("/:id", contactController.GetContact)
			contacts.PUT("/:id/status", contactController.UpdateContactStatus)
		}
	}
}
