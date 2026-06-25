"""
Serializers for emergency application models.
"""
from rest_framework import serializers
from .models import EmergencyContact
from .models import EmergencyReport
from .models import SafetyTip

class EmergencyContactSerializer(serializers.ModelSerializer):

    class Meta:
        model = EmergencyContact
        fields = "__all__"
        read_only_fields = ["user_id"]

class EmergencyReportSerializer(serializers.ModelSerializer):

    class Meta:
        model = EmergencyReport
        fields = "__all__"
        read_only_fields = ["user_id"]

class SafetyTipSerializer(serializers.ModelSerializer):

    class Meta:

        model=SafetyTip

        fields="__all__"