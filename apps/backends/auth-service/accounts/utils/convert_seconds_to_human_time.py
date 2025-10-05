def seconds_to_human_readable(seconds: int) -> str:
    """
    Конвертирует количество секунд в читаемую строку времени.
    
    Примеры:
    300 -> "5 minutes"
    3660 -> "1 hour and 1 minute"
    7320 -> "2 hours and 2 minutes"
    """
    if seconds < 60:
        return f"{seconds} second{'s' if seconds != 1 else ''}"
    
    minutes = seconds // 60
    hours = minutes // 60
    days = hours // 24
    
    if days > 0:
        hours = hours % 24
        if hours > 0:
            return f"{days} day{'s' if days != 1 else ''} and {hours} hour{'s' if hours != 1 else ''}"
        return f"{days} day{'s' if days != 1 else ''}"
    
    if hours > 0:
        minutes = minutes % 60
        if minutes > 0:
            return f"{hours} hour{'s' if hours != 1 else ''} and {minutes} minute{'s' if minutes != 1 else ''}"
        return f"{hours} hour{'s' if hours != 1 else ''}"
    
    return f"{minutes} minute{'s' if minutes != 1 else ''}"
