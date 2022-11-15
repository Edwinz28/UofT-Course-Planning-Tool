import pytest
import json
from index import app

# Written by E.Zhang
@pytest.mark.parametrize("pw, result", [("not actual pw", False), ("ECE444", True)])
def test_admin_pw(pw, result):
    tester = app.test_client()
    response = tester.post(f"/admin/auth?pw={pw}")
    assert response.status_code == 200
    resp_data = json.loads(response.data.decode('utf-8'))
    assert resp_data['isAuth'] == result
    