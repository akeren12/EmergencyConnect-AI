from django.db import models

from emergency.models import EmergencyReport


class AIResponse(models.Model):

    report = models.OneToOneField(

        EmergencyReport,

        on_delete=models.CASCADE

    )

    guidance = models.TextField()

    generated_message = models.TextField()

    translated_message = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):

        return f"AI Response {self.id}"