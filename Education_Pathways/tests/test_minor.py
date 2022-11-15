import pytest
import json
from index import app

from distutils.util import strtobool

# Written by G.Jiang
@pytest.mark.parametrize("course_code, expected_resp",
[("APS360", "Artificial Intelligence Engineering Minor"),
 ("ECE472", "Engineering Business Minor")])
def test_minor(course_code, expected_resp):
    tester = app.test_client()
    resp = tester.get(f"/searchc?input={course_code}")
    assert resp.status_code == 200
    resp_data = json.loads(resp.data.decode('utf-8'))
    assert resp_data[0]['minor'] == expected_resp