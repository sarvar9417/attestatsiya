"""Safe, literal-only independent Excel worked-answer proposals.

No eval/exec, workbook access, formulas containing references, or learner publication.
"""
from __future__ import annotations
from decimal import Decimal, ROUND_FLOOR, ROUND_HALF_UP
import re

FORMULA = re.compile(r"^=([A-Z]+)\(([^()]*)\)$")
NUMBER = re.compile(r"^-?\d{1,12}(?:\.\d{1,8})?(?:/[1-9]\d{0,6})?$")


class SourceNeedsReview(ValueError):
    pass


def _number(source: str) -> Decimal:
    if not NUMBER.fullmatch(source.strip()):
        raise SourceNeedsReview("Only bounded numeric literals are permitted")
    parts = source.strip().split("/")
    return Decimal(parts[0]) if len(parts) == 1 else Decimal(parts[0]) / Decimal(parts[1])


def _out(value: Decimal) -> str:
    return str(int(value)) if value == value.to_integral_value() else format(value.normalize(), "f")


def review_formula(source: str) -> tuple[str | None, str, str]:
    """Return (proposed result, original explanation, state), never a source key."""
    source = source.strip()
    if len(source) > 120:
        raise SourceNeedsReview("Unexpected source formula length")
    if re.fullmatch(r"-?=?FLOOR\(-?\d+(?:\.\d+)?\)", source):
        return (None,
                "Asl formulada FLOOR(number; significance) ikkinchi majburiy argumenti yo‘q. "
                "FLOOR.MATH boshqa funksiya; berilgan manba formulasi tuzatilmaguncha ishlatilmaydi.",
                "invalid_source_formula")
    parsed = FORMULA.fullmatch(source)
    if not parsed:
        raise SourceNeedsReview("Non-literal or unsupported formula")
    function, arg_string = parsed.groups()
    tokens = [x.strip() for x in arg_string.split(";")]
    values = [_number(x) for x in tokens]
    if function in ("ABS", "SIGN", "SQRT") and len(values) == 1:
        value = values[0]
        if function == "ABS":
            result = abs(value)
            why = f"|{_out(value)}| = {_out(result)}: modul manfiy belgini olib tashlaydi."
        elif function == "SIGN":
            result = Decimal((value > 0) - (value < 0))
            why = f"{_out(value)} sonning ishorasi {_out(result)} (manfiy −1, musbat 1, nol 0)."
        else:
            if value < 0:
                raise SourceNeedsReview("Negative square root")
            result = value.sqrt()
            why = f"√{_out(value)} = {_out(result)}: kvadrat ildiz topildi."
    elif function == "MOD" and len(values) == 2:
        a, divisor = values
        if divisor == 0:
            raise SourceNeedsReview("Division by zero")
        factor = (a / divisor).to_integral_value(rounding=ROUND_FLOOR)
        result = a - divisor * factor
        why = (f"{_out(a)} − ({_out(divisor)})×({_out(factor)}) = {_out(result)}. "
               "Excel MOD qoldig‘i bo‘luvchining ishorasini oladi.")
    elif function == "POWER" and len(values) == 2:
        number, power = values
        if abs(number) > 1000000000:
            raise SourceNeedsReview("Unbounded exponent base")
        if number >= 0 and power in (Decimal("0.25"), Decimal("0.5")):
            result = number.sqrt().sqrt() if power == Decimal("0.25") else number.sqrt()
        elif power == power.to_integral_value() and -16 <= power <= 16:
            result = number ** int(power)
        else:
            raise SourceNeedsReview("Unsupported exponent")
        why = f"{_out(number)} ning {_out(power)}-darajasi = {_out(result)}."
    elif function == "ROUND" and len(values) == 2:
        number, digits = values
        if digits != digits.to_integral_value() or not -8 <= digits <= 8:
            raise SourceNeedsReview("Unsupported rounding precision")
        unit = Decimal(10) ** -int(digits)
        result = (number / unit).quantize(Decimal(1), rounding=ROUND_HALF_UP) * unit
        why = f"{_out(number)} ni aniqligi {_out(digits)} bo‘yicha yaxlitlaymiz: {_out(result)}."
    elif function == "PRODUCT" and 2 <= len(values) <= 5:
        result = Decimal(1)
        for value in values:
            result *= value
        why = f"Argumentlar ko‘paytmasi {_out(result)}."
    else:
        raise SourceNeedsReview("Unsupported function or argument count")
    return _out(result), why, "computed_review_only"
