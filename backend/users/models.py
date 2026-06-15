from django.db import models

class User(models.Model):

    name = models.CharField(max_length=100)

    email = models.EmailField(unique=True)

    phone_number = models.CharField(max_length=15)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class EmergencyContact(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="contacts"
    )

    contact_name = models.CharField(max_length=100)

    phone_number = models.CharField(max_length=15)

    relationship = models.CharField(max_length=50)

    def __str__(self):
        return self.contact_name