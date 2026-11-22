"""Tests for check-dependencies.py: the mark of each line, without reading any source.

Run: python3 .memo/scripts/test_check_dependencies.py
"""
import importlib.util
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

SPEC = importlib.util.spec_from_file_location(
    'check_dependencies', Path(__file__).resolve().parent / 'check-dependencies.py')
check = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(check)

NOW = datetime(2026, 11, 4, tzinfo=timezone.utc)


def days_ago(days):
    return NOW - timedelta(days=days)


class PatchTests(unittest.TestCase):
    def test_only_the_third_number_is_a_patch(self):
        self.assertTrue(check.is_patch('15.0.2', '15.0.3'))
        self.assertTrue(check.is_patch('v0.19.0', '0.19.1'))
        self.assertTrue(check.is_patch('1.2.3.4', '1.2.4.0'))
        self.assertFalse(check.is_patch('15.0.3', '15.1.0'))
        self.assertFalse(check.is_patch('14.9.9', '15.0.0'))
        self.assertFalse(check.is_patch('15.0.3', '15.0.3'))
        # what has no third number, or no numbers, is never a patch
        self.assertFalse(check.is_patch('4.17', '4.18'))
        self.assertFalse(check.is_patch('v47', 'v50'))
        self.assertFalse(check.is_patch('ab5abb9', 'c0ffee1'))
        self.assertFalse(check.is_patch('1.0.0-dev06', '1.0.0-dev07'))

    def test_a_recent_patch_waits(self):
        # Soglia-01, 2026-11-04: KaTeX 0.19.0 to 0.19.1 had cost a whole session.
        self.assertEqual(check.mark('0.19.0', '0.19.1', days_ago(12), days_ago(40), False, False, NOW), 'PATCH')

    def test_a_patch_with_a_security_fix_is_read_at_once(self):
        self.assertEqual(check.mark('15.0.2', '15.0.3', days_ago(19), days_ago(40), True, False, NOW), 'NEW')

    def test_a_patch_waits_three_months_at_most(self):
        self.assertEqual(check.mark('15.0.2', '15.0.3', days_ago(19), days_ago(91), False, False, NOW), 'NEW')
        self.assertEqual(check.mark('15.0.2', '15.0.3', days_ago(19), days_ago(90), False, False, NOW), 'PATCH')

    def test_without_the_date_in_use_the_patch_is_timed_from_the_newer_one(self):
        self.assertEqual(check.mark('3.2.4', '3.2.5', days_ago(2), None, False, False, NOW), 'PATCH')
        self.assertEqual(check.mark('3.2.4', '3.2.5', days_ago(120), None, False, False, NOW), 'NEW')

    def test_a_newer_second_number_is_read_at_once(self):
        self.assertEqual(check.mark('1.13.0', '1.14.0', days_ago(5), days_ago(30), False, False, NOW), 'NEW')
        self.assertEqual(check.mark('v47', 'v50', None, None, False, False, NOW), 'NEW')


class StaleTests(unittest.TestCase):
    def test_a_year_without_a_release_is_stale_until_accepted(self):
        self.assertEqual(check.mark('4.0.0', '4.0.0', days_ago(400), None, False, False, NOW), 'STALE')
        self.assertEqual(check.mark('4.0.0', '4.0.0', days_ago(400), None, False, True, NOW), 'ok')
        self.assertEqual(check.mark('4.0.0', '4.0.0', days_ago(30), None, False, False, NOW), 'ok')
        self.assertEqual(check.mark('v50', 'v50', None, None, False, False, NOW), 'ok')


class SwiftTests(unittest.TestCase):
    """The 'swift' source (Vedetta-Swift, 2026-11-08): swift.org's list of releases, whose `name`
    is the bare number the register keeps (the GitHub tag reads swift-6.4.2-RELEASE)."""

    def test_the_newest_release_by_date_with_its_bare_number(self):
        releases = [{'name': '6.4.2', 'tag': 'swift-6.4.2-RELEASE', 'date': '2026-10-29'},
                    {'name': '2.2', 'tag': 'swift-2.2-RELEASE', 'date': '2016-03-21'},
                    {'name': '6.4.1', 'tag': 'swift-6.4.1-RELEASE', 'date': '2026-09-15'}]
        version, when = check.swift_latest(releases)
        self.assertEqual(version, '6.4.2')
        self.assertEqual(when, datetime(2026, 10, 29, tzinfo=timezone.utc))


CATALOGUE = """<sdk:sdk-repository>
<remotePackage path="ndk;29.0.14206865"><channelRef ref="channel-0"/>
<archives><archive><complete><url>android-ndk-r29-linux.zip</url></complete></archive></archives></remotePackage>
<remotePackage path="ndk;31.0.17000000-beta1"><channelRef ref="channel-1"/>
<archives><archive><complete><url>android-ndk-r31-beta1-linux.zip</url></complete></archive></archives></remotePackage>
<remotePackage path="ndk;30.0.16248370"><channelRef ref="channel-0"/>
<archives><archive><complete><url>android-ndk-r30-darwin.dmg</url></complete></archive>
<archive><complete><url>android-ndk-r30-linux.zip</url></complete></archive></archives></remotePackage>
<remotePackage path="cmake;3.6.4111459"><channelRef ref="channel-0"/>
<archives><archive><complete><url>cmake-3.6.4111459-linux-x86_64.zip</url></complete></archive></archives></remotePackage>
<remotePackage path="cmake;3.31.6"><channelRef ref="channel-0"/>
<archives><archive><complete><url>cmake-3.31.6-linux.zip</url></complete></archive></archives></remotePackage>
</sdk:sdk-repository>"""


class AndroidSdkTests(unittest.TestCase):
    """The 'android-sdk' source (Scandaglio, 2026-11-18): Google's catalogue of the SDK packages,
    for the NDK and CMake that build AIV's native code, which no other source lists."""

    def test_the_newest_stable_version_and_its_linux_archive(self):
        asked = []
        version, _ = check.android_sdk_latest('ndk', CATALOGUE, dated=asked.append)
        self.assertEqual(version, '30.0.16248370')
        self.assertEqual(asked, [check.ANDROID_REPOSITORY + 'android-ndk-r30-linux.zip'])

    def test_versions_compare_number_by_number(self):
        # 3.6.4111459 is older than 3.31.6, though as text it comes after it.
        version, _ = check.android_sdk_latest('cmake', CATALOGUE, dated=lambda url: None)
        self.assertEqual(version, '3.31.6')

    def test_an_unknown_package(self):
        self.assertEqual(check.android_sdk_latest('emulator', CATALOGUE, dated=lambda url: None), ('?', None))


class GitHubChannelTests(unittest.TestCase):
    def test_the_any_channel_takes_a_prerelease_but_not_a_nightly(self):
        releases = [
            {'tag_name': 'v0.46.2-nightly.20261122.155.1', 'prerelease': True, 'draft': False},
            {'tag_name': 'v0.47.0', 'prerelease': False, 'draft': True},
            {'tag_name': 'v0.46.2', 'prerelease': True, 'draft': False},
            {'tag_name': 'v0.45.0', 'prerelease': False, 'draft': False},
        ]
        self.assertEqual(check.newest_release(releases)['tag_name'], 'v0.46.2')


if __name__ == '__main__':
    unittest.main()
