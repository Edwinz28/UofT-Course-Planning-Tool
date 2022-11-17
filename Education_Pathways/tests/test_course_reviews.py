import pytest

from index import app

# Written by Y.Tian
@pytest.mark.parametrize("course_code, user_name, review, expected_code", [("ECE444", "BOT", "The best course.", 400),
                                                                           ("ECE444H1", "BOT", "The best course ever!", 200),
                                                                           ("ECE444H1", None, None, 400),
                                                                           ("ECE444H1", "BOT", None, 400),
                                                                           ("ECE444H1", None, "The project 1 is very in-depth.", 400)])
def test_add_review_v2(course_code, user_name, review, expected_code):
    tester = app.test_client()
    if user_name is None and review is None:
        resp = tester.post(f"/course/reviews?course_code={course_code}")
    elif user_name is None:
        resp = tester.post(f"/course/reviews?course_code={course_code}&review={review}")
    elif review is None:
        resp = tester.post(f"/course/reviews?course_code={course_code}&user_name={review}")
    else:
        resp = tester.post(f"/course/reviews?course_code={course_code}&user_name={user_name}&review={review}")
    assert resp.status_code == expected_code

# Written by R.Yang
@pytest.mark.parametrize("course_code", ["TESTCOURSE"])
def test_get_review(course_code):
    tester = app.test_client()
    resp = tester.get(f"/course/reviews?course_code={course_code}")
    assert resp.status_code == 200
