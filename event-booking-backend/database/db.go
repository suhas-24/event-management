package database

import (
	"fmt"
	"log"
	"os"

	"event-booking-backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// InitDB initializes the database connection
func InitDB() *gorm.DB {
	dbHost := os.Getenv("DB_HOST")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")

	// Create connection string
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		dbHost, dbUser, dbPassword, dbName, dbPort)

	// Open connection
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	// Drop existing tables
	db.Migrator().DropTable(&models.Booking{})

	// Create bookings table with explicit column types
	err = db.Exec(`
		CREATE TABLE bookings (
			id TEXT PRIMARY KEY,
			hall_id TEXT NOT NULL,
			customer_name TEXT NOT NULL,
			customer_email TEXT NOT NULL,
			customer_phone TEXT NOT NULL,
			guest_count INTEGER NOT NULL,
			event_date TIMESTAMP NOT NULL,
			start_time TEXT NOT NULL,
			end_time TEXT NOT NULL,
			special_requests TEXT,
			status TEXT NOT NULL DEFAULT 'pending',
			total_price DOUBLE PRECISION NOT NULL,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		)
	`).Error
	if err != nil {
		log.Fatal("Failed to create bookings table: ", err)
	}

	// Auto migrate other tables
	db.AutoMigrate(&models.Contact{})

	return db
}
