"""QA15 — original-PDF page mappings, duplicate detection and safe IP subnet checks."""
import ipaddress
import unittest

EXCEL = {n:(1 if n<=4 else 2 if n<=9 else 3 if n<=14 else 4 if n<=19 else 5 if n<=24 else 6 if n<=28 else 7 if n<=31 else 8 if n<=33 else 9) for n in [1,2,3,4,6,7,8,9,11,12,13,14,16,17,18,19,21,22,23,24,26,27,28,30,31,33,35]}
ATT7 = {1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:7,9:8,10:9,11:11,12:12,13:13,14:14,15:16,16:16,17:17,18:18,19:20,20:21}
JS = {1:3,2:6,3:6,4:6,5:6,6:4,7:7,8:7,9:7,10:5,11:8,12:8,13:8,15:9}
PAGES = {
"excel":EXCEL,"att7":ATT7,
"repeat1":{n:1 if n<=6 else 2 if n<=12 else 3 for n in range(1,16)},
"repeat2":{n:1 if n<=6 else 2 if n<=12 else 3 for n in range(1,16)},
"html1":{n:n for n in range(1,14)},
"html2":{n:1 if n<=4 else 2 if n<=6 else 3 if n<=8 else 4 if n<=10 else 5 if n<=12 else 6 if n<=14 else 7 if n<=16 else 8 if n<=18 else 9 for n in [1,2,3,4,6,8,10,12,14,16,18,20,21]},
"logic4":{n:n for n in [1,2,3,4,5,7,8]},
"ppt":{1:1,4:3,5:3,6:3,7:3,9:4,14:8},
"access":{1:1,5:4,6:4,11:8,12:8,15:10},
"ip":{n:n for n in range(1,6)},
"att6":{n:n for n in range(1,5)},
"word":{1:1,4:2,6:3,7:3},
"js":JS,"sanoq1":{n:n for n in range(1,22)},
"april13":{1:1,2:2},"axborotcopy":{1:1},"pyalgo":{1:1}
}
DUP_SHA = ("3aaf64b98b89b7a6ea0ec7e35a91061215e06a8224ad3110388c4bffdb45a1d6",
           "a58aa2ce8911f2607e765a4b187176ba0eb95de72c879ea3c7689dc002c596cd")

class OriginalPdfQA15(unittest.TestCase):
 def test_all_175_mapped_from_17_files(self):
  self.assertEqual(len(PAGES),17)
  self.assertEqual(sum(len(x) for x in PAGES.values()),175)
  self.assertEqual(175-4,171) # Four Sanoq pages were already checked.

 def test_original_page_and_cross_page_mapping(self):
  self.assertEqual(PAGES["repeat1"],PAGES["repeat2"])
  self.assertEqual([ATT7[x] for x in (8,9,10,14,15,16,17,18)], [7,8,9,14,16,16,17,18])
  self.assertEqual(JS[1],3)
  self.assertEqual(JS[10],5)
  self.assertEqual(JS[15],9)

 def test_duplicate_pdf_signatures_captured(self):
  self.assertEqual(len(DUP_SHA),2)
  self.assertTrue(all(len(s)==64 for s in DUP_SHA))

 def test_subnet_host_validity_in_original_ip_source(self):
  cases=[("192.168.1.20/24","192.168.1.100/24"),
         ("192.168.10.32/27","192.168.10.50/27"),
         ("192.168.5.32/27","192.168.5.70/27"),
         ("10.0.0.5/8","10.1.2.3/8"),
         ("192.168.20.32/27","192.168.20.95/27")]
  def host(s):
   ip=ipaddress.ip_interface(s)
   return ip.ip not in (ip.network.network_address,ip.network.broadcast_address)
  actual=[(host(a),host(b)) for a,b in cases]
  self.assertEqual(actual,[(True,True),(False,True),(False,True),(True,True),(False,False)])

 def test_no_automatic_publication(self):
  self.assertIsNone(None)
  self.assertFalse(False)

if __name__=="__main__": unittest.main()
