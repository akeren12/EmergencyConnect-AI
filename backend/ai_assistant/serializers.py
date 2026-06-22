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

class AIAnalysisSerializer(serializers.Serializer):

    description = serializers.CharField(
        max_length=1000,
        required=True
    )

    def validate_description(self, value):

        if len(value.strip()) < 10:
            raise serializers.ValidationError(
                "Description too short."
            )

        return value