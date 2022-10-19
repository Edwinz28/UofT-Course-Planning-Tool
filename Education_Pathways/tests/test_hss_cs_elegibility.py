import pandas as pd
import pytest

from distutils.util import strtobool
from index import app

@pytest.mark.parametrize("course_code, expected_res", [("ARC221", False), ("JRE410", True)])
def test_cs(course_code, expected_res):
    
    tester = app.test_client()
    response = tester.get(f"/check/cs?input={course_code}")
    test_res = strtobool(response.data.decode("utf-8").replace("\n", ""))
    assert expected_res == test_res

@pytest.mark.parametrize("course_code, expected_res", [("ECE367H1", False), ("TEP442H1", True)])
def test_cs(course_code, expected_res):
    
    tester = app.test_client()
    response = tester.get(f"/check/hss?input={course_code}")
    test_res = strtobool(response.data.decode("utf-8").replace("\n", ""))
    assert expected_res == test_res