from django.utils import timezone
from django.db.models import Q
from dashboard.models import AuditLogEntry
from django.db.models import Count
from django.db.models.functions import TruncDate

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

def get_actions_taken_today(game_server):
    """
    Returns a dictionary of actions taken today on the given server,
    grouped by action label.
    """
    start_of_day = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = timezone.now()

    actions = (
        AuditLogEntry.objects.filter(
            game_server=game_server,
            timestamp__range=(start_of_day, end_of_day),
        )
        .values("action")
        .annotate(count=Count("id"))
        .order_by("-count")
    )

    return {
        AuditLogEntry.Action(action["action"]).label: action["count"]
        for action in actions
    }

def get_30_day_chart_data(game_server):
    """
    Returns structured data for players and bans over the last 30 days,
    grouped by date.
    """

    now = timezone.now()
    start_date = now - timezone.timedelta(days=30)

    # Players joined (unique per day)
    players = (
        AuditLogEntry.objects.filter(
            game_server=game_server,
            timestamp__range=(start_date, now),
            action=AuditLogEntry.Action.PLAYER_REQUEST_JOIN,
        )
        .annotate(day=TruncDate("timestamp"))
        .values("day")
        .annotate(count=Count("actor_object_id", distinct=True))
        .order_by("day")
    )

    # Bans per day
    bans = (
        AuditLogEntry.objects.filter(
            game_server=game_server,
            timestamp__range=(start_date, now),
            action=AuditLogEntry.Action.PLAYER_BANNED,
        )
        .annotate(day=TruncDate("timestamp"))
        .values("day")
        .annotate(count=Count("id"))
        .order_by("day")
    )

    # Build a dict of results with 0 fallback
    days = [start_date + timezone.timedelta(days=i) for i in range(31)]
    result = []
    for day in days:
        day_str = day.date().isoformat()
        result.append({
            "date": day_str,
            "players": next((p["count"] for p in players if p["day"] == day.date()), 0),
            "bans": next((b["count"] for b in bans if b["day"] == day.date()), 0),
        })

    return result