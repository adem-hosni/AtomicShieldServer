from django.contrib import admin
from .models import Payment
from unfold.admin import ModelAdmin
from datetime import datetime


class PaymentAdminModel(ModelAdmin):
    list_display = (
        "display_payment_id",
        "display_transaction_id",
        "username",
        "email",
        "country",
        "display_price",
        "payment_method",
        "date",
        "currency",
        "refundable",
        "status",
    )

    list_display_links = list_display

    search_fields = (
        "tebex_payment_id",
        "transaction_id",
        "customer_username",
        "customer_firstname",
        "customer_lastname",
        "customer_email",
        "customer_ip",
    )

    list_filter = [
        "currency",
        "payment_method",
        "payment_refundable",
        "status",
        "customer_country",
        "price",
    ]

    def get_readonly_fields(self, request, obj=None):
        return [field.name for field in self.model._meta.fields]

    def has_add_permission(self, request):
        return False

    @admin.display(description="Payment ID")
    def display_payment_id(self, obj: Payment):
        return (
            obj.tebex_payment_id[:9] + "..."
            if len(obj.tebex_payment_id) > 9
            else obj.tebex_payment_id
        )

    @admin.display(description="Transaction ID")
    def display_transaction_id(self, obj: Payment):
        return (
            obj.transaction_id[:9] + "..."
            if len(obj.transaction_id) > 9
            else obj.transaction_id
        )

    @admin.display(description="Country")
    def country(self, obj: Payment):
        return obj.customer_country

    @admin.display(description="Email")
    def email(self, obj: Payment):
        return obj.customer_email

    @admin.display(description="Username")
    def username(self, obj: Payment):
        return f"{obj.customer_username} ({obj.customer_firstname} {obj.customer_lastname})"

    @admin.display(description="Refundable", boolean=True)
    def refundable(self, obj: Payment):
        return obj.payment_refundable

    @admin.display(description="Date")
    def date(self, obj: Payment):
        date_obj = datetime.fromisoformat("2025-03-16T01:49:07+00:00")
        return date_obj.strftime("%Y-%m-%d %H:%M:%S")

    @admin.display(description="Price")
    def display_price(self, obj: Payment):
        return f"{obj.price}$"


admin.site.register(Payment, PaymentAdminModel)
