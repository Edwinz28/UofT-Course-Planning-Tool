import pytest
import json
from index import app

from distutils.util import strtobool

@pytest.mark.parametrize("course_code, expected_resp",
[("APS360", "Artificial Intelligence Engineering Certificate"),
 ("ECE472", "Engineering Business Certificate")])
def test_certificate(course_code, expected_resp):
    tester = app.test_client()
    resp = tester.get(f"/searchc?input={course_code}")
    assert resp.status_code == 200
    resp_data = json.loads(resp.data.decode('utf-8'))
    assert resp_data[0]['certificate'] == expected_resp