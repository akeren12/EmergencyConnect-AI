from django.db import models

class EmergencyContact(models.Model):
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    relationship = models.CharField(max_length=50)

    def __str__(self):
        return self.name