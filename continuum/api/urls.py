from api import views
from django.urls import include, path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"tags", views.TagViewSet)
router.register(r"entries", views.EntryViewSet, basename="entry")

urlpatterns = [
    path("", include(router.urls)),
    path("report/", views.generate_report, name="report"),
]
