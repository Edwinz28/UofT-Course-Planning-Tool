import pytest

from index import app

# Written by R.Yang


@pytest.mark.parametrize("course_code, user_name, review, expected_code", [("TESTCOURSE", "BOT", "I Love this course", 200),
                                                                           ("TESTCOURSE", None, None, 400)])
def test_add_review(course_code, user_name, review, expected_code):
    tester = app.test_client()
    if user_name is None and review is None:
        resp = tester.post(f"/course/reviews?course_code={course_code}")
    else:
        resp = tester.post(
            f"/course/reviews?course_code={course_code}&user_name={user_name}&review={review}")
    assert resp.status_code == expected_code

# Written by R.Yang


@pytest.mark.parametrize("course_code", ["TESTCOURSE"])
def test_get_review(course_code):
    tester = app.test_client()
    resp = tester.get(f"/course/reviews?course_code={course_code}")
    assert resp.status_code == 200
