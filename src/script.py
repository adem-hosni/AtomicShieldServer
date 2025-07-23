from anticheat.models import ClientHWID
HistHWID = ClientHWID.history.model

# find all orphan hwid_ids from detection_reports
from django.db import connection
with connection.cursor() as c:
    c.execute("""
      SELECT DISTINCT hwid_id
      FROM detection_reports
      WHERE hwid_id NOT IN (SELECT id FROM hwids)
      AND hwid_id IS NOT NULL
    """)
    missing_ids = [row[0] for row in c.fetchall()]

for hid in missing_ids:
    try:
        hist = HistHWID.objects.filter(id=hid).earliest('history_date')
    except HistHWID.DoesNotExist:
        continue
    # re-create the original HWID row
    ClientHWID.objects.create(
        id=hist.id,
        username=hist.username,
        computer_name=hist.computer_name,
        disks=hist.disks,
        cpuid=hist.cpuid,
        motherboard_serial=hist.motherboard_serial,
        bios_version=hist.bios_version,
        pnp_device=hist.pnp_device,
        fivem_license=hist.fivem_license,
        fivem_token=hist.fivem_token,
        steam=hist.steam,
        discord_id=hist.discord_id,
    )
