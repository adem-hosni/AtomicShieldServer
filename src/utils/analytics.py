from django.utils import timezone
from django.db.models import Q
from dashboard.models import AuditLogEntry

def get_peak_players_today(game_server):
    """
    Returns the peak concurrent players that joined the given server today.
    """

    # Define start of day
    start_of_day = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = timezone.now()

    # Fetch all join/quit events for today
    events = (
        AuditLogEntry.objects.filter(
            game_server=game_server,
            timestamp__range=(start_of_day, end_of_day),
            action__in=[
                AuditLogEntry.Action.PLAYER_REQUEST_JOIN,
                AuditLogEntry.Action.PLAYER_QUIT,
            ]
        )
        .order_by("timestamp")
    )

    current_online = 0
    peak_online = 0

    for event in events:
        if event.action == AuditLogEntry.Action.PLAYER_REQUEST_JOIN:
            current_online += 1
        elif event.action == AuditLogEntry.Action.PLAYER_QUIT and current_online > 0:
            current_online -= 1

        peak_online = max(peak_online, current_online)

    return peak_online



def get_new_joins_today(game_server):
    """
    Returns the number of unique players that joined a given server today.
    """
    start_of_day = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = timezone.now()

    return (
        AuditLogEntry.objects.filter(
            game_server=game_server,
            timestamp__range=(start_of_day, end_of_day),
            action=AuditLogEntry.Action.PLAYER_REQUEST_JOIN,
        )
        .values_list("actor_object_id", flat=True)
        .distinct()
        .count()
    )

