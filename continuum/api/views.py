from logging import getLogger

from api.serializers import EntrySerializer, TagSerializer, ThoughtSerializer, TaskSerializer
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
from rest_framework.response import Response
from thought.models import Entry, Tag, Thought, Task
from thought.tasks import extract_mood, extract_actions

logger = getLogger(__name__)


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 100


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


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """This method should return the list of tasks for the currently authenticated user."""
        queryset = get_objects_for_user(self.request.user, "view_task", klass=Task)

        if self.action == "list":

            today = timezone.now().date()
            queryset = queryset.filter(Q(snooze__isnull=True) | Q(snooze__lte=today))
            queryset = queryset.order_by("updated_at")[:10]

        return queryset

    def perform_create(self, serializer):
        task = serializer.save()
        assign_perm("view_task", self.request.user, task)


class EntryViewSet(viewsets.ModelViewSet):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset = get_objects_for_user(self.request.user, "view_entry", klass=Entry)
        queryset = queryset.order_by("-date")
        search_query = self.request.query_params.get("search", None)
        if search_query:
            queryset = queryset.annotate(
                search=SearchVector("thought__content"),
            ).filter(search=search_query)

        # Filter by start and end date
        start_date = self.request.query_params.get("start_date", None)
        end_date = self.request.query_params.get("end_date", None)

        if start_date:
            try:
                start_date = parse_date(start_date)
                if start_date:
                    queryset = queryset.filter(date__gte=start_date)
                else:
                    raise ValidationError("Invalid start date format.")
            except ValidationError:
                pass

        if end_date:
            try:
                end_date = parse_date(end_date)
                if end_date:
                    queryset = queryset.filter(date__lte=end_date)
                else:
                    raise ValidationError("Invalid end date format.")
            except ValidationError:
                pass

        return queryset

    def paginate_queryset(self, queryset):
        if self.action == "list":
            return super().paginate_queryset(queryset)
        return None

    def perform_create(self, serializer):
        entry = serializer.save()
        assign_perm("view_entry", self.request.user, entry)

    @action(detail=True, methods=["post"], url_path="add-thought")
    def add_thought(self, request, pk=None):
        entry = self.get_object()

        if not request.user.has_perm("view_entry", entry):
            return Response(status=status.HTTP_403_FORBIDDEN)

        mutable_data = request.data.copy()
        mutable_data["entry"] = entry.id
        serializer = ThoughtSerializer(data=mutable_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["put"], url_path="edit-thought/(?P<thought_id>[^/.]+)")
    def edit_thought(self, request, pk=None, thought_id=None):
        entry = self.get_object()

        if not request.user.has_perm("view_entry", entry):
            return Response(status=status.HTTP_403_FORBIDDEN)

        thought = get_object_or_404(Thought, id=thought_id, entry=entry)
        mutable_data = request.data.copy()
        mutable_data["entry"] = entry.id
        serializer = ThoughtSerializer(thought, data=mutable_data)

        if serializer.is_valid():
            serializer.save()

            content_words = serializer.validated_data.get("content", "").split()
            if len(content_words) >= 10:
                extract_mood.delay(thought.id)
                extract_actions.delay(thought.id)

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["delete"], url_path="delete-thought/(?P<thought_id>[^/.]+)")
    def delete_thought(self, request, pk=None, thought_id=None):
        entry = self.get_object()

        if not request.user.has_perm("view_entry", entry):
            return Response(status=status.HTTP_403_FORBIDDEN)

        thought = get_object_or_404(Thought, id=thought_id, entry=entry)
        thought.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
