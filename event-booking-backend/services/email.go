package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"event-booking-backend/models"
)

type EmailService struct {
	apiKey     string
	apiBaseURL string
}

func NewEmailService() *EmailService {
	return &EmailService{
		apiKey:     os.Getenv("BREVO_API_KEY"),
		apiBaseURL: "https://api.brevo.com/v3",
	}
}

func (s *EmailService) SendBookingConfirmation(booking *models.Booking) error {
	templateData := map[string]interface{}{
		"customerName": booking.CustomerName,
		"eventDate":    booking.EventDate.Format("January 2, 2006"),
		"startTime":    booking.StartTime,
		"hallId":       booking.HallID,
		"guestCount":   booking.GuestCount,
		"totalPrice":   booking.TotalPrice,
	}

	emailData := map[string]interface{}{
		"sender": map[string]string{
			"name":  "Event Booking System",
			"email": "bookings@yourdomain.com",
		},
		"to": []map[string]string{
			{
				"email": booking.CustomerEmail,
				"name":  booking.CustomerName,
			},
		},
		"templateId": 1, // Replace with your Brevo template ID
		"params":     templateData,
	}

	return s.sendEmail(emailData)
}

func (s *EmailService) SendAdminNotification(booking *models.Booking) error {
	adminEmail := os.Getenv("ADMIN_EMAIL")
	if adminEmail == "" {
		return fmt.Errorf("admin email not configured")
	}

	emailData := map[string]interface{}{
		"sender": map[string]string{
			"name":  "Event Booking System",
			"email": "bookings@yourdomain.com",
		},
		"to": []map[string]string{
			{
				"email": adminEmail,
				"name":  "Admin",
			},
		},
		"templateId": 2, // Replace with your admin notification template ID
		"params": map[string]interface{}{
			"customerName":    booking.CustomerName,
			"customerEmail":   booking.CustomerEmail,
			"customerPhone":   booking.CustomerPhone,
			"eventDate":       booking.EventDate.Format("January 2, 2006"),
			"startTime":       booking.StartTime,
			"hallId":          booking.HallID,
			"guestCount":      booking.GuestCount,
			"totalPrice":      booking.TotalPrice,
			"specialRequests": booking.SpecialRequests,
		},
	}

	return s.sendEmail(emailData)
}

func (s *EmailService) sendEmail(data map[string]interface{}) error {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("error marshaling email data: %v", err)
	}

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/smtp/email", s.apiBaseURL), bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("error creating request: %v", err)
	}

	req.Header.Set("api-key", s.apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("error sending email: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return fmt.Errorf("email API returned status code: %d", resp.StatusCode)
	}

	return nil
}
