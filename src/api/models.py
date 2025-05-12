from django.db import models


class Payment(models.Model):
    class Meta:
        db_table = "payments"
        verbose_name = "Payment"
        verbose_name_plural = "Payments"

    class Status(models.IntegerChoices):
        COMPLETE = 1, "Completed"
        REFUND = 2, "Refund"
        CHARGEBACK = 3, "Chargeback"
        DECLINED = 4, "Declined"
        PENDING_CHECKOUT = 5, "Pending Checkout"
        REFUND_PENDING = 6, "Refund Pending"

    tebex_payment_id = models.CharField(unique=True, null=False, default="<Unknown>", max_length=128, db_index=True)
    transaction_id = models.CharField(max_length=512, unique=True)
    customer_id = models.CharField(max_length=64, null=False, default="<Unknown>")
    customer_firstname = models.CharField(max_length=64, null=False, default="<Unknown>")
    customer_lastname = models.CharField(max_length=64, null=False, default="<Unknown>")
    customer_username = models.CharField(max_length=64, null=False, default="<Unknown>")
    customer_email = models.TextField(null=False, default="<Unknown>")
    customer_country = models.CharField(max_length=16, null=False, default="<Unknown>")
    customer_postalcode = models.CharField(max_length=16, null=False, default="<Unknown>")
    customer_ip = models.CharField(max_length=49, null=False, default="<Unknown>")
    tebex_date = models.CharField(max_length=32)
    status = models.IntegerField(choices=Status, null=True)
    price = models.IntegerField()
    currency = models.CharField(max_length=16)
    payment_method = models.CharField(max_length=64)
    payment_refundable = models.BooleanField(null=True)
    tax = models.IntegerField()
    tax_currency = models.CharField(max_length=16)
    gateway_tax = models.IntegerField()
    creator_code = models.CharField(max_length=256, null=True)
    coupons = models.JSONField(blank=False, default=list)
    recurring_payment_refrence = models.TextField(null=True)
    paid_products = models.JSONField(blank=False, default=list)

    def __str__(self):
        return f"{self.customer_username} - {self.payment_method} - {self.status}"
