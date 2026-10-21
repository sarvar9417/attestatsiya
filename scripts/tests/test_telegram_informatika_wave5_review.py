"""Original-source TASK-346 wave5 computations (no source PDF or answer key published)."""
import itertools
import unittest


def encode_base(number: int, base: int) -> str:
    alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if number < 0 or base < 2 or base > 36:
        raise ValueError("Unsupported numeral system")
    if number == 0:
        return "0"
    result = ""
    while number:
        number, digit = divmod(number, base)
        result = alphabet[digit] + result
    return result


class NumeralAndLogicReviewTests(unittest.TestCase):
    def test_original_invalid_base_digit(self):
        with self.assertRaises(ValueError):
            int("1A40", 9)

    def test_original_even_range_has_no_remaining_items(self):
        numbers = [n for n in range(int("215", 8), int("93", 16) + 1)
                   if n % 2 == 0]
        self.assertEqual(numbers, [142, 144, 146])
        self.assertEqual([n for n in numbers if "00" not in encode_base(n, 2)], [])
        self.assertNotIn(0, (63, 54, 72, 65))

    def test_original_xy_product_has_no_correct_option(self):
        decimal = int("47", 8)
        x, y = divmod(decimal, 9)
        self.assertEqual((x, y), (4, 3))
        self.assertEqual(encode_base(x * y, 2), "1100")
        self.assertNotIn("1100", ("10010", "10101", "10100", "11010"))

    def test_original_power_expression_choices_do_not_contain_result(self):
        number = 36 ** 10 + 6 ** 15 - 18
        zero_count = encode_base(number, 6).count("0")
        self.assertEqual(zero_count, 6)
        self.assertNotIn(zero_count, (15, 14, 16, 17))

    def test_logic_three_students_permutation_is_unique(self):
        results = [(a, v, s) for a, v, s in itertools.permutations((3, 4, 5))
                   if s != 3 and (int(a == 3) + int(v == 5) + int(s != 4)) == 1]
        self.assertEqual(results, [(4, 3, 5)])

    def test_four_student_positions_unique(self):
        solutions = []
        for names in itertools.permutations(("Umid", "Aziz", "Bobur", "Sherzod")):
            place = {person: i + 1 for i, person in enumerate(names)}
            if all(sum(pair) == 1 for pair in (
                (place["Umid"] == 1, place["Sherzod"] == 2),
                (place["Umid"] == 2, place["Aziz"] == 3),
                (place["Aziz"] == 4, place["Bobur"] == 2),
            )):
                solutions.append(place)
        self.assertEqual(solutions, [
            {"Umid": 1, "Bobur": 2, "Aziz": 3, "Sherzod": 4}
        ])

    def test_age_question_does_not_determine_a_unique_answer(self):
        age_of_grandfather_at_childs_tenth_birthday = lambda boy_age: 88 - boy_age + 10 - boy_age
        self.assertNotEqual(age_of_grandfather_at_childs_tenth_birthday(5),
                            age_of_grandfather_at_childs_tenth_birthday(7))

    def test_unqualified_duration_has_many_valid_reals(self):
        for duration in (9.1, 9.5, 10):
            self.assertEqual((duration > 9, duration > 10, duration > 11),
                             (True, False, False))


if __name__ == "__main__":
    unittest.main()
