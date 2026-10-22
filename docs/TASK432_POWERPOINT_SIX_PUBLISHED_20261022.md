# TASK-432 — PowerPoint konseptual savollar 3–8 yangi versiya nashri

2026-10-22. Asl manba: [MS PowerPoint testlar.pdf](https://drive.google.com/file/d/1LEZo28L9u6DQXGvHU5himMvBl8_Bi0xi/view), 9 sahifa.

Asl manba №3–8 savollari 4 tadan variantli, o‘quvchilar uchun juda oson distractorli edi; №1,2,9–15 rasmli savollar boshqa image-revision mapping bosqichini talab qiladi.

- №3: Fade slaydlararo Transition va Fly In obyekt Animation farqi
- №4: F5 vs Shift+F5 namoyishni birinchi/joriy slayddan boshlash
- №5: matn, diagramma, rasm kabi turli obyektlarning animatsiyasi
- №6: Exit/Entrance/Emphasis/Motion Path farqi
- №7: Animation Pane vs Selection Pane, Slide Sorter, Transitions
- №8: Delay (kutish) vs Duration (amal davomiyligi)

6 ta butunlay yangi, vaziyatli va tushuntirishli Y1 savol. `supabase/maintenance/task432_publish_six_powerpoint_concepts.sql` production `ROLLBACK` rehearsal PASS, durable `COMMIT` PASS; postflight **6/6 published; 24/24 options; 6/6 official-eligible; 6/6 fingerprint snapshots**. Original PDF candidate answer_key yozilmagan. `is_generated=true`, human editorial signature **false**; tarixiy testlar va exam-items o‘zgarmadi.

`scripts/task432-powerpoint-six.test.mjs` dedicated CI confirms source numbers and option integrity. Rasm talab qiladigan 9 candidate nashrga yuborilmadi; ularning local audit PNGlari review ZIP’da.
