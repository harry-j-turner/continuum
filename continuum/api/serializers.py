import logging

from rest_framework import serializers
from thought.models import Tag, Thought

logger = logging.getLogger(__name__)


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"


class ThoughtSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thought
        fields = "__all__"
