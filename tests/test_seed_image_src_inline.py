from wisedeck.services.slide.seed_image_src_inline import extract_api_view_image_id


def test_extract_api_view_image_id_relative():
    assert extract_api_view_image_id("/api/image/view/public_abc123?width=640") == "public_abc123"


def test_extract_api_view_image_id_absolute():
    assert (
        extract_api_view_image_id("https://app.example.com/api/image/view/public_xyz#frag") == "public_xyz"
    )


def test_extract_api_view_image_id_non_api():
    assert extract_api_view_image_id("https://cdn.example.com/img.png") is None


def test_extract_api_view_image_id_empty():
    assert extract_api_view_image_id("") is None
