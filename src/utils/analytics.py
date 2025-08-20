from django.utils import timezone
from collections import defaultdict
from datetime import timedelta
from django.db.models import Count, Q, F
from django.db.models.functions import TruncHour, TruncDay
from django.db.models import Q
from dashboard.models import AuditLogEntry
from anticheat.models import Ban
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

def _fill_buckets_active_bans(start, end, step, fmt, players_qs, game_server):
    players_map = {row["bucket"]: row["players"] for row in players_qs}

    # prefetch all bans relevant to this range
    bans = list(
        Ban.objects.filter(game_server=game_server, active=True, banned_at__lte=end)
    )

    buckets = []
    current = start
    while current <= end:
        bucket_start = current
        bucket_end = current + step

        # count how many bans overlap with this bucket
        active_count = 0
        for ban in bans:
            ban_end = None
            if ban.duration:
                ban_end = ban.banned_at + ban.duration

            if ban.banned_at <= bucket_end and (ban_end is None or ban_end > bucket_start):
                active_count += 1

        buckets.append({
            "time": current.strftime(fmt),
            "players": players_map.get(current, 0),
            "bans": active_count,
        })

        current = bucket_end

    return buckets


def _player_queryset(start, trunc, game_server):
    return (
        AuditLogEntry.objects.filter(timestamp__gte=start, game_server=game_server)
        .annotate(bucket=trunc("timestamp"))
        .values("bucket")
        .annotate(
            players=Count("id", filter=Q(action__in=[
                AuditLogEntry.Action.PLAYER_REQUEST_JOIN,
                AuditLogEntry.Action.PLAYER_QUIT,
            ])),
        )
        .order_by("bucket")
    )


def get_30_day_chart_data(game_server):
    now = timezone.now()

    start_today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    start_week = now - timedelta(days=7)
    start_month = now - timedelta(days=30)

    # players
    qs_today_players = _player_queryset(start_today, TruncHour, game_server)
    qs_week_players = _player_queryset(start_week, TruncDay, game_server)
    qs_month_players = _player_queryset(start_month, TruncDay, game_server)

    results = {
        "today": _fill_buckets_active_bans(start_today, now, timedelta(hours=1), "%H:%M", qs_today_players, game_server),
        "week": _fill_buckets_active_bans(start_week, now, timedelta(days=1), "%Y-%m-%d", qs_week_players, game_server),
        "month": _fill_buckets_active_bans(start_month, now, timedelta(days=1), "%Y-%m-%d", qs_month_players, game_server),
    }

    return results
