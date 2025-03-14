package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"event-booking-backend/controllers"
	"event-booking-backend/middlewares"
	"event-booking-backend/models"
	"event-booking-backend/services"
)

func initializeHalls(db *gorm.DB) error {
	var count int64
	db.Model(&models.Hall{}).Count(&count)

	if count == 0 {
		halls := []models.Hall{
			{
				ID:          "hall1",
				Name:        "Hall 1 (Small)",
				Capacity:    10,
				BasePrice:   1000,
				WeekendRate: 200,
				PeakRate:    300,
				Features:    "Cozy atmosphere, Modern audio system, Comfortable seating, Basic decorations included",
			},
			{
				ID:          "hall2",
				Name:        "Hall 2 (Large)",
				Capacity:    30,
				BasePrice:   2000,
				WeekendRate: 400,
				PeakRate:    600,
				Features:    "Spacious layout, Premium sound system, Projector setup, Custom decoration options",
			},
		}

		for _, hall := range halls {
			if err := db.Create(&hall).Error; err != nil {
				return err
			}
		}
		log.Println("Initialized halls in database")
	}
	return nil
}

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Printf("Error loading .env file: %v", err)
	}

	// Construct database connection string
	dbHost := os.Getenv("DB_HOST")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		dbHost, dbUser, dbPass, dbName, dbPort)

	// Database connection
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto migrate models
	if err := db.AutoMigrate(&models.Booking{}, &models.Hall{}); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// Initialize halls
	if err := initializeHalls(db); err != nil {
		log.Printf("Warning: Failed to initialize halls: %v", err)
	}

	// Initialize services
	emailService := services.NewEmailService()

	// Initialize controllers
	bookingController := controllers.NewBookingController(db, emailService)

	// Initialize router
	router := gin.Default()

	// CORS configuration
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5190", "http://localhost:5173"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.AllowCredentials = true
	router.Use(cors.New(config))

	// Public routes
	router.GET("/api/halls", func(c *gin.Context) {
		var halls []models.Hall
		if err := db.Find(&halls).Error; err != nil {
			c.JSON(500, gin.H{"error": "Failed to fetch halls"})
			return
		}
		c.JSON(200, halls)
	})

	router.POST("/api/bookings", bookingController.CreateBooking)

	// Admin routes (protected)
	admin := router.Group("/api/admin")
	admin.Use(middlewares.AdminAuth())
	{
		admin.GET("/bookings", bookingController.GetBookings)
		admin.PUT("/bookings/:id/status", bookingController.UpdateBookingStatus)

		// Hall management
		admin.POST("/halls", func(c *gin.Context) {
			var hall models.Hall
			if err := c.ShouldBindJSON(&hall); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}
			if err := db.Create(&hall).Error; err != nil {
				c.JSON(500, gin.H{"error": "Failed to create hall"})
				return
			}
			c.JSON(201, hall)
		})

		admin.PUT("/halls/:id", func(c *gin.Context) {
			id := c.Param("id")
			var hall models.Hall
			if err := db.First(&hall, "id = ?", id).Error; err != nil {
				c.JSON(404, gin.H{"error": "Hall not found"})
				return
			}
			if err := c.ShouldBindJSON(&hall); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}
			if err := db.Save(&hall).Error; err != nil {
				c.JSON(500, gin.H{"error": "Failed to update hall"})
				return
			}
			c.JSON(200, hall)
		})
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
