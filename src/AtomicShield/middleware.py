from django.contrib import messages
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _
import logging


logger = logging.getLogger(__name__)


class ExceptionHandlerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        logger.exception(f"Error from {request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', ''))}, {exception.__class__.__name__}: {exception}")