from django import forms
from django_recaptcha.fields import ReCaptchaField
from django_recaptcha.widgets import ReCaptchaV3


class SignInForm(forms.Form):
    username_or_email = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "placeholder": "Username or Email",
                "class": "peer h-full w-full rounded-lg border border-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-gray-300 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gray-300 placeholder-shown:border-t-gray-200 focus:border-gray-300 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-gray-300 placeholder:opacity-0 focus:placeholder:opacity-100 focus:placeholder-transparent selection:bg-[#01e4f4] selection:text-black",
            }
        )
    )

    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "placeholder": "Password",
                "class": "peer h-full w-full rounded-lg border border-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-gray-300 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gray-300 placeholder-shown:border-t-gray-200 focus:border-gray-300 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-gray-300 placeholder:opacity-0 focus:placeholder:opacity-100 focus:placeholder-transparent selection:bg-[#01e4f4] selection:text-black",
            }
        )
    )

    recaptcha = ReCaptchaField(widget=ReCaptchaV3)


class SignUpForm(forms.Form):
    email = forms.CharField(
        widget=forms.EmailInput(
            attrs={
                "placeholder": "Email",
                "class": "peer h-full w-full rounded-lg border border-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-gray-300 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gray-300 placeholder-shown:border-t-gray-200 focus:border-gray-300 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-gray-300 placeholder:opacity-0 focus:placeholder:opacity-100 focus:placeholder-transparent selection:bg-[#01e4f4] selection:text-black",
            }
        )
    )

    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "placeholder": "Username",
                "class": "peer h-full w-full rounded-lg border border-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-gray-300 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gray-300 placeholder-shown:border-t-gray-200 focus:border-gray-300 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-gray-300 placeholder:opacity-0 focus:placeholder:opacity-100 focus:placeholder-transparent selection:bg-[#01e4f4] selection:text-black",
            }
        )
    )

    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "placeholder": "Password",
                "class": "peer h-full w-full rounded-lg border border-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-gray-300 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gray-300 placeholder-shown:border-t-gray-200 focus:border-gray-300 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-gray-300 placeholder:opacity-0 focus:placeholder:opacity-100 focus:placeholder-transparent selection:bg-[#01e4f4] selection:text-black",
            }
        )
    )

    recaptcha = ReCaptchaField(widget=ReCaptchaV3)
