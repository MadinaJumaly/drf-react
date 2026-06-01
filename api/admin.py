from django.contrib import admin
from .models import Client


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'email', 'phone']
    search_fields = ['user__username', 'name', 'email']