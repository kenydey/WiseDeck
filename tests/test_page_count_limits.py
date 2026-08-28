import pytest

from wisedeck.schemas.page_count_limits import validate_custom_range_pages


def test_custom_range_accepts_two_to_fifty():
    validate_custom_range_pages(2, 50)
    validate_custom_range_pages(2, 2)


def test_custom_range_rejects_below_minimum():
    with pytest.raises(ValueError, match="最少页数"):
        validate_custom_range_pages(1, 10)


def test_custom_range_rejects_min_gt_max():
    with pytest.raises(ValueError, match="不能大于"):
        validate_custom_range_pages(10, 5)
