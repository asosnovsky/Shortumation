from unittest import TestCase
from src.db.connection import HassDatabase
from src.db import entities
from tests.utils import SAMPLE_DB_PATH

db = HassDatabase(f"sqlite:///{SAMPLE_DB_PATH.absolute()}")


class hass_db_tests(TestCase):
    def test_it_loads_local_db(self):
        self.assertEqual(db.execute_sql("SELECT count(*) FROM states")[0][0], 333_878)
        self.assertEqual(db.db_type, "sqlite")

    def test_search_entity_find_by_text(self):
        expected = [
            "sensor.temperature_entrance_closet",
            "sensor.temperature_office",
            "sensor.temperature_kitchen",
            "sensor.temperature_mbathroom",
            "sensor.temperature_baby_room",
            "sensor.temperature_storage_unit",
            "sensor.temperature_powder_room",
            "sensor.temperature_laundry",
            "sensor.temperature_living_room",
            "sensor.temperature_ewelink",
            "sensor.temperature_main_bedroom",
        ]
        for entity in entities.search(
            db,
            search_text="sensor.temperature",
        ):
            self.assertTrue(expected.count(entity.entity_id) > 0)
            self.assertEqual(entity.domain, "sensor")
            self.assertEqual(entity.attributes["state_class"], "measurement")

    def test_search_entity_find_by_text_and_domain(self):
        expected = [
            "automation.kitchen_island_buttom_press",
            "automation.kitchen_button_long_press",
        ]
        for entity in entities.search(
            db, search_text="kitchen", domain_filter="automation"
        ):
            self.assertTrue(expected.count(entity.entity_id) > 0)
            self.assertEqual(entity.domain, "automation")
            self.assertEqual(entity.attributes["mode"], "single")

    def test_search_entity_find_by_text_and_attr(self):
        expected = [
            "sensor.humidity_kitchen",
            "sensor.pressure_kitchen",
            "sensor.temperature_kitchen",
            "sensor.battery_kitchen_btn",
            "sensor.battery_weather_kitchen",
            "sensor.battery_wleak_kitchen",
        ]
        for entity in entities.search(
            db, search_text="kitchen", attributes_filter={"state_class": "measurement"}
        ):
            self.assertTrue(expected.count(entity.entity_id) > 0)
            self.assertEqual(entity.domain, "sensor")
            self.assertEqual(entity.attributes["state_class"], "measurement")

    def test_search_entity_find_by_text_and_partial_attr(self):
        expected = [
            "sensor.humidity_kitchen",
            "sensor.pressure_kitchen",
            "sensor.temperature_kitchen",
            "sensor.battery_kitchen_btn",
            "sensor.battery_weather_kitchen",
            "sensor.battery_wleak_kitchen",
        ]
        for entity in entities.search(
            db,
            search_text="kitchen",
            attributes_filter={"state_class": "sureme"},
        ):
            self.assertTrue(expected.count(entity.entity_id) > 0)
            self.assertEqual(entity.domain, "sensor")
            self.assertEqual(entity.attributes["state_class"], "measurement")
