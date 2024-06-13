from logging import getLogger

from api.serializers import TagSerializer, ThoughtSerializer
from django.contrib.postgres.search import SearchVector
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.db.models import Q
from guardian.shortcuts import assign_perm, get_objects_for_user
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from thought.models import Tag, Thought


logger = getLogger(__name__)


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def paginate_queryset(self, queryset):
        if self.action == "list":
            return super().paginate_queryset(queryset)
        return None

    def get_queryset(self):
        return get_objects_for_user(self.request.user, "view_tag", klass=Tag)

    def perform_create(self, serializer):
        tag = serializer.save()
        assign_perm("view_tag", self.request.user, tag)


class ThoughtViewSet(viewsets.ModelViewSet):
    queryset = Thought.objects.all()
    serializer_class = ThoughtSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):

        if self.action == "list":
            queryset = get_objects_for_user(self.request.user, "view_thought", klass=Thought)

            # Filter by start and end date
            start_date = self.request.query_params.get("start_date", None)
            end_date = self.request.query_params.get("end_date", None)

            if start_date:
                try:
                    start_date = parse_date(start_date)
                    if start_date:
                        queryset = queryset.filter(created_at__gte=start_date)
                    else:
                        raise ValidationError("Invalid start date format.")
                except ValidationError:
                    pass

            if end_date:
                try:
                    end_date = parse_date(end_date)
                    if end_date:
                        queryset = queryset.filter(created_at__lte=end_date)
                    else:
                        raise ValidationError("Invalid end date format.")
                except ValidationError:
                    pass

            # Filter by tags
            tags = self.request.query_params.get("tags", None)
            if tags:
                tags = tags.split(",")
                queryset = queryset.filter(tags__id__in=tags)

        elif self.action == "update":
            queryset = get_objects_for_user(self.request.user, "change_thought", klass=Thought)
        elif self.action == "destroy":
            queryset = get_objects_for_user(self.request.user, "delete_thought", klass=Thought)
        else:
            queryset = get_objects_for_user(self.request.user, "view_thought", klass=Thought)

        queryset = queryset.order_by("-created_at")
        return queryset

    def paginate_queryset(self, queryset):
        if self.action == "list":
            return super().paginate_queryset(queryset)
        return None

    def perform_create(self, serializer):
        thought = serializer.save()
        assign_perm("view_thought", self.request.user, thought)
        assign_perm("change_thought", self.request.user, thought)
