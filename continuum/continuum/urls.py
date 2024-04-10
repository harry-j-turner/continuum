from django.contrib import admin
from django.http import HttpResponse, JsonResponse
from django.urls import include, path

from continuum.version import VERSION, VERSION_NOTES


def health_check(request):
    return HttpResponse("OK")


def version(request):
    """A simple API endpoint that returns the current version of the app."""
    return JsonResponse({"version": VERSION, "version_notes": VERSION_NOTES})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    path("health_check/", health_check),
    path("version/", version),
]
