import logging
import json
from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from utils import validate_tebex_request
from .models import Payment
from django.contrib.auth.models import User

logger = logging.getLogger(__name__)


@csrf_exempt
def payment_completed(request: HttpRequest) -> HttpResponse:
    if not validate_tebex_request(request):
        return HttpResponse(status=204)

    request_body = json.loads(request.body.decode())

    if not "type" in request_body:
        logger.warning(f"paymentAPI: 'type' was not found in the request body (given request {request_body})")
        return HttpResponse()
    
    match request_body["type"]:
        case "payment.completed":
            payment_subject = request_body.get("subject", {})
            try:
                payment = Payment(
                    tebex_payment_id=request_body.get("id"),
                    customer_id=payment_subject.get("customer")["username"]["id"],
                    customer_firstname=payment_subject.get("customer")["first_name"],
                    customer_lastname=payment_subject.get("customer")["last_name"],
                    customer_username=payment_subject.get("customer")["username"]["username"],
                    customer_email=payment_subject.get("customer")["email"],
                    customer_country=payment_subject.get("customer")["country"],
                    customer_postalcode=payment_subject.get("customer")["postal_code"],
                    customer_ip=payment_subject.get("customer")["ip"],
                    tebex_date=request_body.get("date"),
                    transaction_id=payment_subject["transaction_id"],
                    status=payment_subject["status"]["id"],
                    price=payment_subject["price"]["amount"],
                    currency=payment_subject["price"]["currency"],
                    payment_method=payment_subject["payment_method"]["name"],
                    payment_refundable=payment_subject["payment_method"]["refundable"],
                    tax=payment_subject["fees"]["tax"]["amount"],
                    tax_currency=payment_subject["fees"]["tax"]["currency"],
                    gateway_tax=payment_subject["fees"]["gateway"]["amount"],
                    creator_code=payment_subject["creator_code"],
                    coupons=payment_subject["coupons"],
                    recurring_payment_refrence=payment_subject["recurring_payment_reference"],
                    paid_products=[
                        {
                            "id": product["id"],
                            "name": product["name"],
                            "quantity": product["quantity"],
                            "paid_price": product["paid_price"]["amount"],
                        }
                        for product in payment_subject["products"]
                    ],
                )
            except Exception as err:
                logger.error(f"Failed to save payment! {err}", exc_info=True)
                return JsonResponse({"success": "error", "message": "Failed to validate your transaction"}, status=200)
            else:
                try:
                    payment.save()
                except Exception as save_err:
                    logger.error(f"An error occured while saving a payment to the database! {save_err}", exc_info=True)
                    return JsonResponse({"success": "error", "message": "Failed to validate your payment"}, status=500)
                else:
                    paidproducts_verbose = ", ".join(list(product['name'] for product in payment.paid_products))
                    logger.info(f"{payment.customer_username} ({payment.customer_firstname} {payment.customer_lastname}) "
                                f"payment Accepted Successfuly: {payment.price}$ ({paidproducts_verbose})")
                    return HttpResponse(status=200)
        case "validation.webhook":
            logger.info(f"payment completed endpoint validated {request_body}")
            return HttpResponse(json.dumps({"id": request_body.get("id")}), status=200)
    
    return HttpResponse(status=204)
