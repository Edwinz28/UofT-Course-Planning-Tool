import pytest
from index import app
import json

# Written by E.Zhang
@pytest.mark.parametrize("code, name, desc, prereq, excl, coreq, department, div",
    [("TESTCOURSE1", "Software Engineering", "Sample desc", "FOO444H1", "BAR444H1", "COREQ444H1", "Engineering", "Division")])
def test_update_info(code, name, desc, prereq, excl, coreq, department, div):
    tester = app.test_client()
    resp = tester.post(f"/course/updateInfo?course_code={code}&course_name={name}&description={desc}&prereq={prereq}&exclusions={excl}&coreq={coreq}&department={department}&division={div}&idCode={code}")   
    assert resp.status_code == 200
    resp_data = json.loads(resp.data.decode('utf-8'))
    # No error message
    assert('error' not in resp_data)

# Written by E.Zhang
@pytest.mark.parametrize("code, name, desc, prereq, excl, coreq, department, div, idCode",
    [("bad course code", "Software Engineering", "Sample desc", "FOO444H1", "BAR444H1", "COREQ444H1", "Engineering", "Division", "bad course code"),
    ("TESTCOURSE1", "Software Engineering", "Sample desc", "FOO444H1", "BAR444H1", "COREQ444H1", "Engineering", "Division", "TESTCOURSE2")])
# Test 1: Try writing to a bad course code
# Test 2: Change a course code to a existing course code
def test_update_bad_info(code, name, desc, prereq, excl, coreq, department, div, idCode):
    tester = app.test_client()
    resp = tester.post(f"/course/updateInfo?course_code={code}&course_name={name}&description={desc}&prereq={prereq}&exclusions={excl}&coreq={coreq}&department={department}&division={div}&idCode={idCode}")   
    assert resp.status_code == 200
    resp_data = json.loads(resp.data.decode('utf-8'))
    # Expect an error msg
    assert('error' in resp_data)
