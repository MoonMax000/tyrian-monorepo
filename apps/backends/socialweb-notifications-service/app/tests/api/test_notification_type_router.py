from app.models import NotificationType

def test_create_notification_type(client):
    """Тест создания нового типа уведомлений."""
    client.delete("/notifications/types/", params={"code": "NEW_TYPE"})

    payload = {
        "code": "NEW_TYPE",
        "name": "New Notification",
        "default_text": "New notification template",
        "is_active": True
    }

    response = client.post("/notifications/types/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == payload["code"]
    assert data["name"] == payload["name"]
    assert data["default_text"] == payload["default_text"]
    assert data["is_active"] == payload["is_active"]

    # Проверяем, что тип уведомлений присутствует в списке
    response = client.get("/notifications/types/")
    assert response.status_code == 200
    assert any(item["code"] == "NEW_TYPE" for item in response.json())

def test_get_all_notification_types(client, db):
    """Тест получения всех типов уведомлений."""
    response = client.get("/notifications/types/")
    assert response.status_code == 200
    data = response.json()
    assert any(item["code"] == "LIKE_RECEIVED" for item in data)

def test_get_notification_type_by_code(client, db):
    """Тест получения типа уведомлений по коду."""
    response = client.get("/notifications/types/single", params={"code": "LIKE_RECEIVED"})
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == "LIKE_RECEIVED"
    assert data["name"] == "Like Received"

def test_update_notification_type(client, db):
    """Тест обновления типа уведомлений."""
    update_payload = {
        "name": "Updated Notification",
        "default_text": "Updated template"
    }
    response = client.put(
        "/notifications/types/",
        params={"code": "LIKE_RECEIVED"},
        json=update_payload
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_payload["name"]
    assert data["default_text"] == update_payload["default_text"]
    # Проверяем, что флаг is_active не изменился
    assert data["is_active"] is True

def test_delete_notification_type(client, db):
    """Тест удаления типа уведомлений по коду."""
    response = client.delete("/notifications/types/", params={"code": "LIKE_RECEIVED"})
    assert response.status_code == 200
    assert response.json() is True

    # Проверяем, что тип уведомлений удален
    response = client.get("/notifications/types/single", params={"code": "LIKE_RECEIVED"})
    assert response.status_code == 404

    # Проверяем, что тип уведомлений отсутствует в списке
    response = client.get("/notifications/types/")
    assert response.status_code == 200
    assert not any(item["code"] == "LIKE_RECEIVED" for item in response.json())
