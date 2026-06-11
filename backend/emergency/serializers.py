from rest_framework import serializers
from .models import EmergencyContact
from .models import EmergencyReport
from .models import SafetyTip

class EmergencyContactSerializer(serializers.ModelSerializer):

    class Meta:
        model = EmergencyContact
        fields = "__all__"

class EmergencyReportSerializer(serializers.ModelSerializer):

    class Meta:
        model = EmergencyReport
        fields = "__all__"

class SafetyTipSerializer(serializers.ModelSerializer):

    class Meta:

        model=SafetyTip

        fields="__all__"