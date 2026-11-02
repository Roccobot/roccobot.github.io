"""WCAG contrast ratios for the colour pairs of the design system.
Author: Rocco Casadei, a.k.a. Roccobot"""
import sys


def lum(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    c = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


if __name__ == '__main__':
    for pair in sys.argv[1:]:
        a, b = pair.split('/')
        print(f'{a} su {b}: {ratio(a, b):.2f}')
