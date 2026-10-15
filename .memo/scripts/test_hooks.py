#!/usr/bin/env python3
"""Regression checks for the `bash` mode of hooks.py: the commands that print the session
environment, or a variable named like a secret, are blocked; reading one variable by name, using
a secret without printing it and running a command through `env` pass.

The hook runs as Claude Code runs it, a separate process with the event as JSON on stdin, so
these checks exercise the real script and its real exit code (2 blocks the command).

Author: Rocco Casadei, a.k.a. Roccobot
"""
import json
import subprocess
import sys
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name('hooks.py')


def run_hook(command):
    event = {'tool_name': 'Bash', 'tool_input': {'command': command}, 'cwd': '/tmp'}
    return subprocess.run([sys.executable, str(SCRIPT), 'bash'], input=json.dumps(event),
                          text=True, capture_output=True, timeout=60)


class EnvironmentTests(unittest.TestCase):
    BLOCKED = (
        'env',
        'env -0',
        '/usr/bin/env',
        'env FOO=1',
        'env -u LANG',
        'env | sort',
        'env | grep -i lang',
        'cd /tmp && env',
        'LC_ALL=C.UTF-8 env',
        'printenv',
        'printenv -0',
        'printenv RULES_PASSWORD',
        'printenv LANG BRIEF_PASSWORD',
        'echo $RULES_PASSWORD',
        'echo "pw: ${RULES_PASSWORD}"',
        "printf '%s' \"$GITHUB_TOKEN\"",
        'export',
        'export -p',
        'declare -x',
        'typeset -p',
        'set',
        'cat /proc/self/environ',
        'tr "\\0" "\\n" < /proc/1/environ',
    )
    ALLOWED = (
        'printenv LANG',
        'printenv LC_ALL LANG',
        'env LC_ALL=C.UTF-8 ./gradlew test',
        'env -i PATH=/usr/bin ./script.sh',
        'env -u LANG python3 tool.py',
        '/usr/bin/env python3 tool.py',
        'LC_ALL=C.UTF-8 ./gradlew test -q',
        'set -e',
        'export FOO=1',
        'declare -i n=0',
        'echo $HOME',
        'curl -s -d "{\\"password\\": \\"$RULES_PASSWORD\\"}" https://example.org',
        'git log --grep env',
        'grep -rn env .',
        'ls /proc/self',
    )

    def test_commands_that_print_the_environment_are_blocked(self):
        for command in self.BLOCKED:
            with self.subTest(command=command):
                result = run_hook(command)
                self.assertEqual(result.returncode, 2, result.stdout + result.stderr)
                self.assertIn('Comando bloccato', result.stderr)

    def test_commands_that_do_not_print_it_pass(self):
        for command in self.ALLOWED:
            with self.subTest(command=command):
                result = run_hook(command)
                self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == '__main__':
    unittest.main()
