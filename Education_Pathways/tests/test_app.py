import pytest

from index import app
from minor import check_course_in_minor


# Jean
def test_check_course_in_minor():
    course = "MIE439H1S"
    minor = "Biomedical Engineering Minor"
    result = check_course_in_minor(course)

    assert result == minor

# Cansin


@pytest.mark.skip(reason="Test from original repo, feature never implemented")
def test_user_register_endpoint():
    tester = app.test_client()
    resp = tester.get("/user/register")

    assert resp.status_code == 200


@pytest.mark.skip(reason="Test from original repo, feature never implemented")
def test_user_login_endpoint():
    tester = app.test_client()
    resp = tester.get("/user/login")

    assert resp.status_code == 200


def test_search_endpoint():
    tester = app.test_client()
    resp = tester.get("/searchc?input=TEP444H1")

    assert resp.status_code == 200


def test_course_details_endpoint():
    tester = app.test_client()
    resp = tester.get("/course/details?code=ECE318H1")

    assert resp.status_code == 200


@pytest.mark.skip(reason="Test from original repo, feature never implemented")
def test_course_graph_endpoint():
    tester = app.test_client()
    resp = tester.get("/course/graph?code=ECE318H1")

    assert resp.status_code == 200


@pytest.mark.skip(reason="Test from original repo, feature never implemented")
def test_user_wishlist_endpoint():
    tester = app.test_client()
    resp = tester.get("/user/wishlist")

    assert resp.status_code == 200


@pytest.mark.skip(reason="Test from original repo, feature never implemented")
def test_user_wishlist_addCourse_endpoint():
    tester = app.test_client()
    resp = tester.get("/user/wishlist/addCourse")

    assert resp.status_code == 200


@pytest.mark.skip(reason="Test from original repo, feature never implemented")
def test_user_wishlist_removeCourse_endpoint():
    tester = app.test_client()
    resp = tester.get("/user/wishlist/removeCourse")

    assert resp.status_code == 200


@pytest.mark.skip(reason="Test from original repo, feature never implemented")
def test_user_wishlist_minorCheck_endpoint():
    tester = app.test_client()
    resp = tester.get("/user/wishlist/minorCheck")

    assert resp.status_code == 200
