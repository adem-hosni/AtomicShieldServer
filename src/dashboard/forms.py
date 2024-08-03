from django import forms
from typing import List, Dict, Any


servers = [
    ("1", "MTA:SA"),
]


class AddServerForm(forms.Form):
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
                            attrs={"class": "sr-only peer", "name": config["id"], "description": config["description"]}
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

            self.fields[str(config['id'])] = form_input
