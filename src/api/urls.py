from django.urls import path
from . import views

urlpatterns = [
    path("payment/completed", view=views.payment_completed, name="payment_completed"),
]
