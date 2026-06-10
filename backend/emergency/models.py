from django.db import models

class EmergencyContact(models.Model):
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    relationship = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class EmergencyReport(models.Model):

    title = models.CharField(max_length=100)

    description = models.TextField()

    emergency_type = models.CharField(max_length=50)

    severity = models.CharField(max_length=20)

    location = models.CharField(max_length=150)

    image_url = models.URLField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):

        return self.title