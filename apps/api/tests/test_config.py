import unittest

from pydantic import ValidationError

from app.config import Settings


class SettingsTests(unittest.TestCase):
    def test_safe_infrastructure_names_are_accepted(self):
        settings = Settings(
            _env_file=None,
            redis_key_prefix="flowgraph:test",
            temporal_namespace="flowgraph-ai",
            temporal_task_queue="platform-workflows",
        )
        self.assertEqual("flowgraph:test", settings.redis_key_prefix)

    def test_unsafe_cache_prefix_is_rejected(self):
        with self.assertRaises(ValidationError):
            Settings(_env_file=None, redis_key_prefix="flowgraph test")
