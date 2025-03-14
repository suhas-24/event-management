package utils

import (
	"fmt"
	"net/smtp"
)

// EmailConfig holds the configuration for sending emails
type EmailConfig struct {
	SMTPHost     string
	SMTPPort     string
	SMTPUsername string
	SMTPPassword string
	FromEmail    string
}

// SendEmail sends an email using the provided configuration
func SendEmail(to []string, subject, body string, config EmailConfig) error {
	// Create authentication
	auth := smtp.PlainAuth("", config.SMTPUsername, config.SMTPPassword, config.SMTPHost)

	// Create email headers
	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	subject = fmt.Sprintf("Subject: %s\n", subject)
	msg := []byte(subject + mime + body)

	// Send email
	addr := fmt.Sprintf("%s:%s", config.SMTPHost, config.SMTPPort)
	return smtp.SendMail(addr, auth, config.FromEmail, to, msg)
}

// SendBookingConfirmation sends a confirmation email for a new booking
func SendBookingConfirmation(toEmail, name string, config EmailConfig) error {
	subject := "Booking Confirmation"
	body := fmt.Sprintf("<h2>Booking Confirmation</h2><p>Dear %s,</p><p>Your booking has been received and is pending confirmation.</p>", name)

	return SendEmail([]string{toEmail}, subject, body, config)
}

// SendContactFormAcknowledgment sends an acknowledgment email for contact form submission
func SendContactFormAcknowledgment(toEmail, name string, config EmailConfig) error {
	subject := "We've Received Your Message"
	body := fmt.Sprintf("<h2>Thank You for Contacting Us</h2><p>Dear %s,</p><p>We've received your message and will get back to you soon.</p>", name)

	return SendEmail([]string{toEmail}, subject, body, config)
}
