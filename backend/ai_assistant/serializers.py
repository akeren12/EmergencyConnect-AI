from rest_framework import serializers


class AIRequestSerializer(serializers.Serializer):
    description = serializers.CharField()


class AIResponseSerializer(serializers.Serializer):
    emergency_type = serializers.CharField()
    priority = serializers.CharField()
    summary = serializers.CharField()
    first_aid = serializers.ListField(
        child=serializers.CharField()
    )
    disclaimer = serializers.CharField()