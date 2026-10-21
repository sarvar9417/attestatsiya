"""QA20 Scratch source block reconstruction, Test 13 page 11.

Verified against original source image; no original binary media in Git.
"""
import unittest

MOVEMENT={0:(0,10),90:(10,0),180:(0,-10),270:(-10,0)}


def source_scratch_program():
    direction=0
    x_pos=y_pos=x_variable=y_variable=0
    history=[]
    for _ in range(5):
        direction=(direction-90)%360  # original anticlockwise turn icon
        dx,dy=MOVEMENT[direction]
        x_pos+=dx
        y_pos+=dy
        x_variable+=x_pos
        y_variable+=y_pos
        history.append((x_pos,y_pos,x_variable,y_variable))
    return history


class TestSourceScratchQA20(unittest.TestCase):
    def test_five_original_sprite_positions(self):
        self.assertEqual([entry[:2] for entry in source_scratch_program()],
                         [(-10,0),(-10,-10),(0,-10),(0,0),(-10,0)])

    def test_final_custom_variables_option_D(self):
        choices=[(0,-10),(-10,-10),(-20,-30),(-30,-20)]
        self.assertEqual(source_scratch_program()[-1][2:],(-30,-20))
        self.assertEqual(choices.index(source_scratch_program()[-1][2:]),3)

    def test_not_to_confuse_sprite_position_and_custom_var(self):
        last=source_scratch_program()[-1]
        self.assertEqual(last[:2],(-10,0))
        self.assertEqual(last[2:],(-30,-20))
        self.assertNotEqual(last[:2],last[2:])


if __name__=="__main__":
    unittest.main()
