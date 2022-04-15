

from pathlib import Path
from tempfile import mkdtemp
from unittest import TestCase
from src.automations.tags import TagManager

class tag_tests(TestCase):

    def test_load_and_save(self):
        tmp_file = Path(mkdtemp())
        tags = TagManager()
        tags['id#1'] = ['home things', 'barns', 'kitchen']
        tags['id#2'] = ['kitchen']

        tags.save(tmp_file)
        loaded_tags = TagManager.load(tmp_file)
        assert loaded_tags.keys() == tags.keys()