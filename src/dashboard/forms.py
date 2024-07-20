from django import forms


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
