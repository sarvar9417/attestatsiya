"""Independent arithmetic checks for a private, unapproved PDF candidate set.

No source question text or answer key is stored in this public regression test.
"""
import math
import unittest


class CodingPDFNumericReviewTests(unittest.TestCase):
    def test_identity_storage(self):
        bits_per_id = math.ceil(math.log2(448))
        present = 448 // 4
        self.assertEqual(bits_per_id * present // 8, 126)

    def test_transmission_time(self):
        total_bytes = 128 * 32 * 60
        self.assertEqual(total_bytes * 8 / 512 / 60, 64)

    def test_three_part_transfer_average(self):
        first_seconds = (960 * 0.25) / 6
        second_seconds = (960 * 0.75 * 0.25) / 18
        third_seconds = first_seconds + second_seconds
        self.assertEqual(960 / (first_seconds + second_seconds + third_seconds), 9.6)

    def test_stereo_audio(self):
        bytes_per_second = 64000 * 24 * 2 / 8
        duration_minutes = 120_000_000 / bytes_per_second / 60
        self.assertLess(abs(duration_minutes - 5), abs(duration_minutes - 10))

    def test_passport_encoding(self):
        self.assertEqual(2 * math.ceil(math.log2(26)) + 7 * math.ceil(math.log2(10)), 38)

    def test_pixels_and_signal_count(self):
        self.assertEqual(40 * 1024 * 8 // (256 * 128), 10)
        self.assertEqual(math.ceil(math.log2(200)), 8)

    def test_stereo_48khz_one_minute(self):
        self.assertEqual(48000 * 16 * 2 * 60 / 8 / 1024, 11250)

    def test_disk_capacity_and_encoding(self):
        self.assertEqual(500 * 0.7 * 1024 / (10 * 256), 140)
        self.assertEqual(80 * 5 + 60 * 6, 760)

    def test_download_rate(self):
        seconds = 120 + 90 + 300 / (24 / 8)
        self.assertEqual(round(720 / seconds), 2)

    def test_dpi_image_approximation(self):
        mb = 25 / 2.54 * 300 * (30 / 2.54 * 300) * 3 / 1_000_000
        self.assertTrue(31 <= mb < 32)

    def test_6gib_at_512mib_per_second(self):
        self.assertEqual(6 * 1024 / 512, 12)


if __name__ == '__main__':
    unittest.main()
