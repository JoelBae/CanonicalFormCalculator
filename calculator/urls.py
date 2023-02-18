from django.urls import path

from . import views

urlpatterns = [
    path('calculate', views.calculate_canonical, name='calculate'),
    path('history', views.get_history, name='history'),
]