from django.core.management.base import BaseCommand
from emergency.models import SafetyTip

class Command(BaseCommand):
    help = 'Seeds default safety tips and guides into the database.'

    def handle(self, *args, **options):
        tips_data = [
            {
                "title": "Cardiopulmonary Resuscitation (CPR)",
                "tip": "1. Call emergency services immediately.\n2. Push hard and fast in the center of the chest (100 to 120 compressions per minute).\n3. Allow the chest to rise completely between pushes.\n4. If trained, deliver rescue breaths at a ratio of 30 compressions to 2 breaths. Keep going until medical help arrives."
            },
            {
                "title": "Choking Assistance (Heimlich)",
                "tip": "1. Ask if the person is choking.\n2. Stand behind them, wrap your arms around their waist.\n3. Make a fist with one hand and place it slightly above the navel.\n4. Grasp your fist with the other hand and press into the abdomen with quick, upward thrusts.\n5. Repeat until the object is expelled."
            },
            {
                "title": "Severe Bleeding Control",
                "tip": "1. Call emergency services.\n2. Put on sterile gloves if available.\n3. Apply direct pressure to the wound using a clean cloth or sterile dressing.\n4. Maintain firm, steady pressure until bleeding stops. Elevate the injured limb above heart level if possible."
            },
            {
                "title": "Heat Stroke Treatment",
                "tip": "1. Move the person out of the heat and into shade or air conditioning.\n2. Cool the person rapidly using wet sheets, cool baths, or ice packs under the armpits and groin.\n3. Do NOT give them fluids to drink if they are semi-conscious or unconscious.\n4. Call local emergency services immediately."
            },
            {
                "title": "Stroke Detection (F.A.S.T.)",
                "tip": "1. Face Drooping: Ask the person to smile. Does one side droop?\n2. Arm Weakness: Ask them to raise both arms. Does one drift downward?\n3. Speech Difficulty: Ask them to repeat a simple sentence. Is speech slurred?\n4. Time to call emergency numbers immediately if they show any of these signs."
            },
            {
                "title": "Burns Care (Minor)",
                "tip": "1. Cool the burn immediately under cool running tap water for 10-20 minutes. Do NOT use ice.\n2. Apply a clean, damp cloth.\n3. Wrap loosely with sterile gauze.\n4. Do NOT pop any blisters. Apply aloe vera gel once cool."
            }
        ]

        created_count = 0
        for data in tips_data:
            tip, created = SafetyTip.objects.get_or_create(
                title=data["title"],
                defaults={"tip": data["tip"]}
            )
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {created_count} new safety tips (Total tips: {SafetyTip.objects.count()}).'))
