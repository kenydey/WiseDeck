"""User-facing bounds for custom-range PPT page counts (TODO board / file outline API)."""

CUSTOM_RANGE_MIN_PAGES = 2
CUSTOM_RANGE_MAX_PAGES = 50


def validate_custom_range_pages(min_pages: int, max_pages: int) -> None:
    if min_pages > max_pages:
        raise ValueError("最少页数不能大于最多页数")
    if min_pages < CUSTOM_RANGE_MIN_PAGES or min_pages > CUSTOM_RANGE_MAX_PAGES:
        raise ValueError(f"最少页数须在{CUSTOM_RANGE_MIN_PAGES}-{CUSTOM_RANGE_MAX_PAGES}之间")
    if max_pages < CUSTOM_RANGE_MIN_PAGES or max_pages > CUSTOM_RANGE_MAX_PAGES:
        raise ValueError(f"最多页数须在{CUSTOM_RANGE_MIN_PAGES}-{CUSTOM_RANGE_MAX_PAGES}之间")
