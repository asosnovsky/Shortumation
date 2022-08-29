from tests.unittests.api.util import BaseTestCase


class user_profile_tests(BaseTestCase):
    def test_read_empty_profile(self):
        resp = self.client.get("/details/profile")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["theme"], "dark")
        self.assertEqual(resp.json()["lang"], "eng")

    def test_update_profile(self):
        resp = self.client.put("/details/profile", json={"theme": "light", "lang": "fra"})
        self.assertEqual(resp.status_code, 200)

        resp = self.client.get("/details/profile")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["theme"], "light")
        self.assertEqual(resp.json()["lang"], "fra")

    def test_update_invalid_profile(self):
        resp = self.client.put("/details/profile", json={"theme": "creamy", "lang": "fra"})
        self.assertEqual(resp.status_code, 422)

        resp = self.client.get("/details/profile")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["theme"], "dark")
        self.assertEqual(resp.json()["lang"], "eng")
