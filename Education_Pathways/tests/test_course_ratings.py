import pytest
from index import app
import json

# Written by R.Yang


@pytest.mark.parametrize("course_code, rating, reset_rating, expected_avg_rating", [
    ("TESTCOURSE", None, True, None),
    ("TESTCOURSE", 1, False, 1),
    ("TESTCOURSE", 5, False, 3),
    ("TESTCOURSE", 2, False, 2.67),
    ("TESTCOURSE", None, True, None)
])
def test_add_review(course_code, rating, reset_rating, expected_avg_rating):
    tester = app.test_client()
    if reset_rating:
        with open('resources/user_ratings.json') as json_file:
            course_ratings_dict = json.load(json_file)
        course_ratings_dict[course_code] = {}
        with open("resources/user_ratings.json", "w") as write_file:
            json.dump(course_ratings_dict, write_file, indent=4)
        assert True
    else:
        resp = tester.post(
            f"/course/ratings?course_code={course_code}&rating={rating}")
        resp_data = json.loads(resp.data.decode('utf-8'))
        avg_rating = float(resp_data['avg_rating'])
        assert expected_avg_rating == avg_rating
