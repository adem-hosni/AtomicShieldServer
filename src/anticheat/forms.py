from django import forms
from unfold.widgets import UnfoldAdminTextareaWidget
from .models import HWID


class ClientHWIDForm(forms.ModelForm):
    debug_logs = forms.CharField(
        required=False, widget=UnfoldAdminTextareaWidget(), label="Debug Logs"
    )

    class Meta:
        model = HWID
        fields = "__all__"

    def set_logs(self, logs: str) -> None:
        """
        Set the debug logs for the form.

        Args:
            logs (str): The debug logs to set.
        """
        self.cleaned_data["debug_logs"] = logs
