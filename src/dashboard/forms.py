from django import forms
from typing import List, Dict, Any
from .models import ServerSubscription, GameServers


servers = [
    ("1", "MTA:SA"),
]


class AddServerForm(forms.Form):
    def __init__(self, *args, **kwargs):
        if not "user" in kwargs.keys():
            raise ValueError("the parameter 'user' not found")

        user = kwargs.pop("user", None)
        super(AddServerForm, self).__init__(*args, **kwargs)

        valid_choices = []

        # Put all the user active subscriptions on the list box
        for subscription in ServerSubscription.objects.filter(owner=user, status=0):
            # Check if the subscription is not expired
            if subscription.is_valid_for_now():
                # Check if the subscription isn't used by any server
                if not subscription.game_servers.exists():
                    valid_choices.append((subscription.id, f"{subscription} - Active"))

        # Add a message for 0 subscriptions
        if not len(valid_choices):
            self.fields["subscription"].choices = [
                -1,
                "There is no Active Subscription found on your account",
            ]

        # Set the view subscriptions to the valid subscriptions
        self.fields["subscription"].choices = valid_choices

    ip = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "placeholder": "IP Address",
                "id": "server-ip",
                "class": "peer h-full w-full rounded-lg border border-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-gray-300 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gray-300 placeholder-shown:border-t-gray-200 focus:border-gray-300 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-gray-300 placeholder:opacity-0 focus:placeholder:opacity-100 focus:placeholder-transparent selection:bg-purple-600 selection:text-black",
            }
        ),
    )
    port = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "placeholder": "Port",
                "type": "number",
                "id": "server-port",
                "class": "peer h-full w-full rounded-lg border border-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-gray-300 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gray-300 placeholder-shown:border-t-gray-200 focus:border-gray-300 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-gray-300 placeholder:opacity-0 focus:placeholder:opacity-100 focus:placeholder-transparent selection:bg-purple-600 selection:text-black",
            }
        ),
    )

    server_type = forms.ChoiceField(
        required=True,
        label="Server Type",
        help_text="Set Eagle Server Type",
        choices=servers,
        widget=forms.Select(
            attrs={
                "class": "cursor-pointer text-center rounded-lg text-gray-300 font-medium w-full h-full bg-[#0d0d0d] border py-2",
                "id": "server-type",
            }
        ),
    )

    subscription = forms.ChoiceField(
        required=True,
        label="Subscription",
        help_text="Set your Eagle subscription",
        choices=[],
        widget=forms.Select(
            attrs={
                "class": "cursor-pointer text-center rounded-lg text-gray-300 font-medium w-full h-full bg-[#0d0d0d] border py-2",
                "id": "server-type",
            }
        ),
    )


class ConfigurationsForm(forms.Form):
    def set_configurations(self, configurations: List[Dict[str, Any]]) -> None:
        for config in configurations:
            match config["data"]["type"]:
                case 1:
                    form_input = forms.BooleanField(
                        required=False,
                        initial=config["data"]["value"] == "on",
                        label=config["name"],
                        widget=forms.CheckboxInput(
                            attrs={
                                "class": "sr-only peer",
                                "name": config["id"],
                                "description": config["description"],
                            }
                        ),
                    )
                case 2:
                    form_input = forms.CharField(
                        required=False,
                        initial=config["data"]["value"],
                        widget=forms.TextInput(
                            attrs={
                                "name": config["id"],
                                "class": "peer h-full w-full rounded-lg border border-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-gray-300 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gray-300 placeholder-shown:border-t-gray-200 focus:border-gray-300 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-gray-300 placeholder:opacity-0 focus:placeholder:opacity-100 focus:placeholder-transparent selection:bg-purple-600 selection:text-black",
                            }
                        ),
                    )
                case _:
                    form_input = forms.IntegerField(
                        initial=config["data"]["value"],
                        widget=forms.NumberInput(
                            attrs={
                                "name": config["id"],
                                "class": "peer h-full w-full rounded-lg border border-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-gray-300 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gray-300 placeholder-shown:border-t-gray-200 focus:border-gray-300 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-gray-300 placeholder:opacity-0 focus:placeholder:opacity-100 focus:placeholder-transparent selection:bg-purple-600 selection:text-black",
                            }
                        ),
                    )

            self.fields[str(config["id"])] = form_input
