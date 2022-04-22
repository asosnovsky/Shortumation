

from pathlib import Path
from tempfile import mktemp
from unittest import TestCase
from src.automations.tags import TagManager

class tag_tests(TestCase):

    def test_load_and_save(self):
        tmp_file = Path(mktemp()).with_suffix('.yml')
        tags = TagManager()
        tags[0] = {'Room': "Kitchen", "Type": 'Lights'}
        tags[1] = {}

        tags.save(tmp_file)
        loaded_tags = TagManager.load(tmp_file)
        assert loaded_tags.keys() == tags.keys()