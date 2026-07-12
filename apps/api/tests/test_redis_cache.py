import json
import unittest

from app.infrastructure.redis import RedisCache


class FakeRedis:
    def __init__(self):
        self.values: dict[str, str] = {}
        self.expirations: dict[str, int] = {}
        self.closed = False

    async def ping(self):
        return True

    async def get(self, key):
        return self.values.get(key)

    async def set(self, key, value, ex):
        self.values[key] = value
        self.expirations[key] = ex

    async def delete(self, key):
        self.values.pop(key, None)

    async def aclose(self):
        self.closed = True


class RedisCacheTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.client = FakeRedis()
        self.cache = RedisCache(
            client=self.client,
            key_prefix="flowgraph:test",
            default_ttl_seconds=60,
        )

    async def test_json_roundtrip_is_namespaced_and_expires(self):
        key = self.cache.key(
            tenant_id="tenant-1",
            namespace="catalog",
            identifier="v1",
        )
        await self.cache.set_json(key, {"version": 1})

        self.assertEqual("flowgraph:test:tenant-1:catalog:v1", key)
        self.assertEqual({"version": 1}, await self.cache.get_json(key))
        self.assertEqual(60, self.client.expirations[key])
        self.assertEqual(
            {"version": 1},
            json.loads(self.client.values[key]),
        )

    async def test_unsafe_key_segment_is_rejected(self):
        with self.assertRaises(ValueError):
            self.cache.key(
                tenant_id="tenant:other",
                namespace="catalog",
                identifier="v1",
            )

    async def test_non_positive_ttl_is_rejected(self):
        with self.assertRaises(ValueError):
            await self.cache.set_json("flowgraph:test:key", {"value": 1}, ttl_seconds=0)

    async def test_cache_client_is_closed(self):
        await self.cache.close()
        self.assertTrue(self.client.closed)
