from anticheat.models import HWID


all_hwids = (HWID.objects.all())

attrs = [attr for attr in dir(all_hwids[0]) if attr.endswith("_set") and not attr.startswith("_")]

hwids = 0
for hwid in all_hwids:
    for attr in attrs:
        related_objects = getattr(hwid, attr)
        if related_objects.count() > 0:
            print(f"HWID: {hwid.id}, Related {attr}: {related_objects.count()}")
            hwids += 1

print(f"Total HWIDs with related objects: {hwids}")
