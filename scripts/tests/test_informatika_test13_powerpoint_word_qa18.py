"""QA18: PowerPoint and Word source-screenshot semantics, no publication."""
import unittest


class OriginalUIOptionsQA18(unittest.TestCase):
    def test_q12_powerpoint_audio_and_transitions(self):
        # Source screenshot rows A,B,C,D: (sound,duration,advance_after,click)
        choices=[
            ("Bomb",2,4,False),
            ("Bomb",4,2,False),
            ("Bomb",3,4,False),
            ("Bomb",3,4,True),
        ]
        expected=("Bomb",4,2,False)
        self.assertEqual([i for i,row in enumerate(choices) if row==expected],[1])

    def test_q13_word_six_source_icons(self):
        # Source visual: bullet, numbered list, undo, increase indent,
        # paragraph marks, line spacing.
        source_functions=("d","e","b","a","c","f")
        original_options=[
            ("d","e","b","a","c","f"),
            ("d","a","b","e","c","f"),
            ("f","e","b","a","c","d"),
            ("a","f","b","d","c","e"),
        ]
        self.assertEqual([i for i,row in enumerate(original_options)
                          if row==source_functions],[0])

    def test_original_source_media_release_gate(self):
        records={
            12:{"format":"text_only","human_approved":False,"publish_ready":False},
            13:{"format":"text_only","human_approved":False,"publish_ready":False},
        }
        self.assertTrue(all(row["format"]=="text_only" for row in records.values()))
        self.assertFalse(any(row["human_approved"] or row["publish_ready"]
                             for row in records.values()))


if __name__=="__main__":
    unittest.main()
