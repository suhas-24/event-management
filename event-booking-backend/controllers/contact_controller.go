package controllers

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"event-booking-backend/models"
	"event-booking-backend/utils"
)

// ContactController handles all contact form related operations
type ContactController struct {
	DB *gorm.DB
}

// CreateContact handles new contact form submissions
func (cc *ContactController) CreateContact(c *gin.Context) {
	var contact models.Contact
	if err := c.ShouldBindJSON(&contact); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create the contact entry
	if err := cc.DB.Create(&contact).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create contact entry"})
		return
	}

	// Send acknowledgment email
	emailConfig := utils.EmailConfig{
		SMTPHost:     os.Getenv("SMTP_HOST"),
		SMTPPort:     os.Getenv("SMTP_PORT"),
		SMTPUsername: os.Getenv("SMTP_USERNAME"),
		SMTPPassword: os.Getenv("SMTP_PASSWORD"),
		FromEmail:    os.Getenv("FROM_EMAIL"),
	}

	if err := utils.SendContactFormAcknowledgment(contact.Email, contact.Name, emailConfig); err != nil {
		// Log the error but don't return it to the client
		log.Printf("Failed to send acknowledgment email: %v", err)
	}

	c.JSON(http.StatusCreated, contact)
}

// GetContacts retrieves all contact form submissions
func (cc *ContactController) GetContacts(c *gin.Context) {
	var contacts []models.Contact
	if err := cc.DB.Find(&contacts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch contacts"})
		return
	}
	c.JSON(http.StatusOK, contacts)
}

// GetContact retrieves a specific contact by ID
func (cc *ContactController) GetContact(c *gin.Context) {
	id := c.Param("id")
	var contact models.Contact
	if err := cc.DB.First(&contact, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contact not found"})
		return
	}
	c.JSON(http.StatusOK, contact)
}

// UpdateContactStatus updates the status of a contact form submission
func (cc *ContactController) UpdateContactStatus(c *gin.Context) {
	id := c.Param("id")
	var status struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&status); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate status value
	if status.Status != "unread" && status.Status != "read" && status.Status != "replied" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status value"})
		return
	}

	// Update contact status
	var contact models.Contact
	if err := cc.DB.First(&contact, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contact not found"})
		return
	}

	if err := cc.DB.Model(&contact).Update("status", status.Status).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update contact status"})
		return
	}

	c.JSON(http.StatusOK, contact)

	if err := c.ShouldBindJSON(&status); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Add database update

	c.JSON(http.StatusOK, gin.H{"message": "Status updated", "id": id, "status": status.Status})
}
