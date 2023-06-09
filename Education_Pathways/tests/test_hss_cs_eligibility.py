import pandas as pd
import pytest

from distutils.util import strtobool
from index import app

# Written by R.Yang
@pytest.mark.parametrize("course_code, expected_resp", [("ARC221", False), ("JRE410", True)])
def test_cs(course_code, expected_resp):
    
    tester = app.test_client()
    response = tester.get(f"/check/cs?course_code={course_code}")
    resp = strtobool(response.data.decode("utf-8").replace("\n", ""))
    assert expected_resp == resp

# Written by R.Yang
@pytest.mark.parametrize("course_code, expected_resp", [("ECE367H1", False), ("TEP442H1", True)])
def test_hss(course_code, expected_resp):
    
    tester = app.test_client()
    response = tester.get(f"/check/hss?course_code={course_code}")
    resp = strtobool(response.data.decode("utf-8").replace("\n", ""))
    assert expected_resp == resp