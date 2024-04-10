from django.contrib import admin
from django.http import HttpResponse
from django.urls import include, path


def health_check(request):
    return HttpResponse("OK")


urlpatterns = [path("admin/", admin.site.urls), path("api/", include("api.urls")), path("health_check/", health_check)]
