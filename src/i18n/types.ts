export type Locale = 'uz' | 'en' | 'ru'

export const LOCALES: { code: Locale; label: string; native: string }[] = [
  { code: 'uz', label: "O'zbek",  native: "O'zbekcha" },
  { code: 'en', label: 'English', native: 'English'   },
  { code: 'ru', label: 'Русский', native: 'Русский'   },
]

/**
 * Flat key-value translation dictionary.
 * Add new keys here as the app grows.
 */
export interface TranslationStrings {
  /* ── Sidebar navigation ── */
  'nav.dashboard': string
  'nav.lessons': string
  'nav.speakingPath': string
  'nav.vocabulary': string
  'nav.personalVocabulary': string
  'nav.mockTest': string
  'nav.aiTutor': string
  'nav.profile': string
  'nav.resources': string
  'nav.tandem': string
  'nav.skills': string
  'nav.phrasalVerbs': string
  'nav.idioms': string
  'nav.confusablePairs': string
  'nav.films': string
  'nav.thirtyDayChallenge': string
  'nav.weeklyPlan': string

  /* ── Personal Vocabulary ── */
  'personalVocab.title': string
  'personalVocab.subtitle': string
  'personalVocab.export': string
  'personalVocab.import': string
  'personalVocab.totalWords': string
  'personalVocab.learned': string
  'personalVocab.due': string
  'personalVocab.addWord': string
  'personalVocab.startTest': string
  'personalVocab.searchPlaceholder': string
  'personalVocab.allCategories': string
  'personalVocab.custom': string
  'personalVocab.allLevels': string
  'personalVocab.dueOnly': string
  'personalVocab.loading': string
  'personalVocab.noResults': string
   'personalVocab.emptyState': string
   'personalVocab.flashCardTest': string
   'personalVocab.noWordsForReview': string

   /* ── Sidebar misc ── */
  'sidebar.levelRange': string
  'sidebar.userFallback': string
  'sidebar.dayCount': string        // "Kun {day}/126"
  'sidebar.daysLeft': string        // "{days} kun qoldi"
  'sidebar.xpProgress': string      // "{current} / {total} XP"
  'sidebar.themeLight': string
  'sidebar.themeDark': string
  'sidebar.themeSystem': string
  'sidebar.collapse': string
  'sidebar.expand': string
  'sidebar.closeMenu': string
  'sidebar.resourcesAria': string   // label for resources toggle button

  /* ── Mobile bottom nav ── */
  'bottomNav.home': string
  'bottomNav.lesson': string
  'bottomNav.vocab': string
  'bottomNav.grammar': string
  'bottomNav.profile': string
  'bottomNav.speaking': string

  /* ── Common (App shell) ── */
  'app.offlineMessage': string
  'app.menuLabel': string
  'app.brandName': string

  /* ── Offline banner ── */
  'offline.title': string
  'offline.subtitle': string
  'offline.available': string
  'offline.unavailable': string
  'offline.lessons': string
  'offline.vocabulary': string
  'offline.progress': string
  'offline.mockTests': string
  'offline.writing': string
  'offline.speakingPath': string
  'offline.dictionary': string
  'offline.aiFeatures': string
  'offline.tandem': string
  'offline.supabase': string
  'offline.syncPending': string
  'offline.reconnected': string
  'offline.dismiss': string
  'offline.showDetails': string
  'offline.hideDetails': string

  /* ── SEO page titles ── */
  'seo.dashboard': string
  'seo.lessons': string
  'seo.vocabulary': string
  'seo.mockTest': string
  'seo.chat': string
  'seo.profile': string
  'seo.tandem': string
  'seo.skills': string
  'seo.phrasalVerbs': string
  'seo.idioms': string
  'seo.grammar': string
  'seo.listening': string
  'seo.speaking': string
  'seo.reading': string
  'seo.writing': string
  'seo.conversation': string
  'seo.pronunciation': string
  'seo.review': string
  'seo.confusablePairs': string
  'seo.desc': string

  /* ── Grammar page titles ── */
  'grammar.presentSimple': string
  'grammar.presentContinuous': string
  'grammar.presentPerfect': string
  'grammar.presentPerfectContinuous': string
  'grammar.pastSimple': string
  'grammar.pastContinuous': string
  'grammar.pastPerfect': string
  'grammar.pastPerfectContinuous': string
  'grammar.futureSimple': string
  'grammar.futureContinuous': string
  'grammar.futurePerfect': string
  'grammar.modalVerbs': string
  'grammar.conditionals': string
  'grammar.passiveVoice': string
  'grammar.reportedSpeech': string
  'grammar.comparatives': string
  'grammar.articles': string
  'grammar.prepositions': string
  'grammar.conjunctions': string
  'grammar.causative': string
  'grammar.gerundInfinitive': string

  /* ── Grammar page ── */
  'grammar.selectTitle': string
  'grammar.selectSubtitle': string
  'grammar.weekLabel': string
  'grammar.exerciseCount': string
  'grammar.xpLabel': string
  'grammar.startButton': string
  'grammar.tipText': string
  'grammar.formulaLabel': string
  'grammar.whenToUse': string
  'grammar.examplesLabel': string
  'grammar.startExercise': string
  'grammar.fillBlankTitle': string
  'grammar.correctAnswer': string
  'grammar.mcTitle': string
  'grammar.errorCorrectionTitle': string
  'grammar.errorInputPlaceholder': string
  'grammar.transformTitle': string
  'grammar.transformHint': string
  'grammar.transformInputPlaceholder': string
  'grammar.aiButton': string
  'grammar.aiTitle': string
  'grammar.loading': string
  'grammar.viewExplanation': string
  'grammar.otherTopic': string
  'grammar.submitCheck': string
  'grammar.retryButton': string
  'grammar.resultPerfect': string
  'grammar.resultGreat': string
  'grammar.resultGood': string
  'grammar.resultMorePractice': string
  'grammar.resultReread': string
  'grammar.resultCorrect': string
  'grammar.resultWrong': string
  'grammar.resultXP': string
  'grammar.scoreLabel': string
  'grammar.exerciseProgress': string
  'grammar.explanationLabel': string
  'grammar.noAnswer': string

  /* ── Breadcrumb ── */
  'breadcrumb.home': string
  'breadcrumb.lessons': string
  'breadcrumb.grammar': string
  'breadcrumb.vocabulary': string
  'breadcrumb.writing': string
  'breadcrumb.speaking': string
  'breadcrumb.profile': string
  'breadcrumb.dictionary': string

  /* ── PWA install prompt ── */
  'pwa.installTitle': string
  'pwa.installDesc': string
  'pwa.install': string
  'pwa.dismiss': string
  'pwa.notNow': string
  'pwa.installed': string

  /* ── Auth page ── */
  'auth.tagline': string
  'auth.signupSuccessBody': string
  'auth.orDivider': string
  'auth.tabLogin': string
  'auth.tabSignup': string
  'auth.signupSuccess': string
  'auth.signupResent': string
  'auth.checkEmailStep1': string
  'auth.checkEmailStep2': string
  'auth.checkEmailStep3': string
  'auth.spamTip': string
  'auth.resendButton': string
  'auth.resendCooldown': string
  'auth.backToLogin': string
  'auth.nameLabel': string
  'auth.namePlaceholder': string
  'auth.emailLabel': string
  'auth.emailPlaceholder': string
  'auth.passwordLabel': string
  'auth.passwordPlaceholder': string
  'auth.forgotPassword': string
  'auth.submitLoading': string
  'auth.submitLogin': string
  'auth.submitSignup': string
  'auth.demoButton': string
  'auth.supportText': string
  'auth.resetTitle': string
  'auth.resetSubtitle': string
  'auth.resetSentTitle': string
  'auth.resetSentBody': string
  'auth.resetSentOk': string
  'auth.resetLoading': string
  'auth.resetSubmit': string
  'auth.closeModal': string
  'auth.errorInvalidCredentials': string
  'auth.errorEmailNotConfirmed': string
  'auth.errorAlreadyRegistered': string
  'auth.errorEmailNotFound': string

  /* ── Dashboard ── */
  'dashboard.greetingMorning': string
  'dashboard.greetingAfternoon': string
  'dashboard.greetingEvening': string
  'dashboard.greetingUser': string
  'dashboard.topBarLevel': string
  'dashboard.topBarWeek': string
  'dashboard.topBarDay': string
  'dashboard.topBarStreak': string
  'dashboard.streakLabel': string
  'dashboard.topBarDaysLeft': string
  'dashboard.daysLeftLabel': string
  'dashboard.totalWordsLabel': string
  'dashboard.signOutTitle': string
  'dashboard.skillProgressTitle': string
  'dashboard.skillProgressSubtitle': string
  'dashboard.skillProgressAvg': string
  'dashboard.skillRingGrammar': string
  'dashboard.skillRingGrammarHours': string
  'dashboard.skillRingVocab': string
  'dashboard.skillRingVocabHours': string
  'dashboard.skillRingListening': string
  'dashboard.skillRingListeningHours': string
  'dashboard.skillRingReading': string
  'dashboard.skillRingReadingHours': string
  'dashboard.skillRingSpeaking': string
  'dashboard.skillRingSpeakingHours': string
  'dashboard.skillRingWriting': string
  'dashboard.skillRingWritingHours': string
  'dashboard.skillRingAria': string
  'dashboard.lessonProgressTitle': string
  'dashboard.lessonProgressViewAll': string
  'dashboard.lessonProgressCompleted': string
  'dashboard.lessonProgressAverage': string
  'dashboard.startLessonTitle': string
  'dashboard.startLessonSubtitle': string
  'dashboard.startLessonButton': string
  'dashboard.speakingPathTitle': string
  'dashboard.speakingPathDay': string
  'dashboard.speakingPathStreak': string
  'dashboard.speakingPathMinutes': string
  'dashboard.speakingPathReview': string
  'dashboard.speakingPathSubtitle': string
  'dashboard.speakingPathButton': string
  'dashboard.dailyIdiomTitle': string
  'dashboard.dailyIdiomViewAll': string
  'dashboard.sectionToday': string
  'dashboard.sectionRecommended': string
  'dashboard.showMore': string
  'dashboard.showLess': string
  'dashboard.tabToday': string
  'dashboard.tabAll': string
  'dashboard.duelTitle': string
  'dashboard.duelSubtitle': string
  'dashboard.duelButton': string
  'dashboard.sectionReviewOverview': string
  'dashboard.sectionGrammarSrs': string
  'dashboard.storyBeatProgress': string
  'dashboard.storyBeatDay': string

  /* ── LearnHub ── */
  'learnHub.title': string
  'learnHub.subtitle': string
  'learnHub.tabGrammar': string
  'learnHub.headerTitle': string
  'learnHub.headerSubtitle': string
  'learnHub.progressTitle': string
  'learnHub.progressCompleted': string
  'learnHub.progressInProgress': string
  'learnHub.progressPending': string
  'learnHub.progressAvgResult': string
  'learnHub.reviewStart': string
  'learnHub.reviewRestart': string
  'learnHub.lessonContinue': string
  'learnHub.lessonStart': string
  'learnHub.tipText': string
  'learnHub.duelTitle': string
  'learnHub.duelSubtitle': string
  'learnHub.duelButton': string
  'learnHub.formulasCount': string
  'learnHub.wordsCount': string
  'learnHub.exercisesCount': string
  'learnHub.xpCount': string
  'learnHub.testsCount': string
  'learnHub.tabTheory': string
  'learnHub.tabDrill': string
  'learnHub.tabReading': string
  'learnHub.tabSpeaking': string
  'learnHub.tabWriting': string
  'learnHub.tabListening': string

  /* ── NotFound ── */
  'notFound.title': string
  'notFound.subtitle': string
  'notFound.back': string
  'notFound.home': string
  'notFound.footer': string

  /* ── Common / Shared ── */
  'common.loading': string
  'common.noResults': string
  'common.tryDifferentQuery': string
  'common.all': string
  'common.filterClear': string
  'common.back': string
  'common.backToSkills': string
  'common.next': string
  'common.previous': string
  'common.close': string
  'common.save': string
  'common.saving': string
  'common.saved': string
  'common.error': string
  'common.retry': string
  'common.search': string
  'common.reset': string
  'common.restart': string
  'common.submit': string
  'common.continue': string
  'common.exit': string
  'common.delete': string
  'common.confirm': string
  'common.cancel': string
  'common.minutes': string
  'common.words': string

  /* ── Profile ── */
  'profile.title': string
  'profile.tabInfo': string
  'profile.tabProgress': string
  'profile.tabAchievements': string
  'profile.tabLeaders': string
  'profile.signOut': string
  'profile.userFallback': string
  'profile.meLabel': string
  'profile.leaderRow.userFallback': string
  'profile.greetingMorning': string
  'profile.greetingAfternoon': string
  'profile.greetingEvening': string
  'profile.levelA2Plus': string
  'profile.levelB1': string
  'profile.levelB1Plus': string
  'profile.levelB2': string

  /* ── Profile Info Tab ── */
  'profile.info.badgesTitle': string
  'profile.info.streakLabel': string
  'profile.info.totalXPLabel': string
  'profile.info.dayLabel': string
  'profile.info.daysLeftLabel': string
  'profile.info.weeklyWinsLabel': string
  'profile.info.personalInfoTitle': string
  'profile.info.nameLabel': string
  'profile.info.namePlaceholder': string
  'profile.info.emailLabel': string
  'profile.info.emailChangeNote': string
  'profile.info.levelLabel': string
  'profile.info.levelTestButton': string
  'profile.info.goalTitle': string
  'profile.info.goalStarted': string
  'profile.info.goalTarget': string
  'profile.info.certButton': string
  'profile.info.saveButton': string
  'profile.info.savingButton': string
  'profile.info.savedLabel': string
  'profile.info.errorNameTooShort': string
  'profile.info.errorSaveFailed': string
  'profile.info.accountTitle': string
  'profile.info.userIdLabel': string
  'profile.info.emailConfirmedLabel': string
  'profile.info.emailConfirmedYes': string
  'profile.info.emailConfirmedNo': string
  'profile.info.registeredAtLabel': string
  'profile.info.passwordTitle': string
  'profile.info.passwordDesc': string
  'profile.info.passwordReset': string
  'profile.info.passwordResetAlert': string

  /* ── Profile Study Buddy ── */
  'profile.studyBuddy.title': string
  'profile.studyBuddy.loading': string
  'profile.studyBuddy.studyingTogether': string
  'profile.studyBuddy.duoStreakToday': string
  'profile.studyBuddy.duoStreakNotToday': string
  'profile.studyBuddy.duoStreakLabel': string
  'profile.studyBuddy.progressTitle': string
  'profile.studyBuddy.xpLabel': string
  'profile.studyBuddy.streakLabel': string
  'profile.studyBuddy.wordsLabel': string
  'profile.studyBuddy.comparisonTitle': string
  'profile.studyBuddy.youLabel': string
  'profile.studyBuddy.buddyLabel': string
  'profile.studyBuddy.challengeSent': string
  'profile.studyBuddy.challengeSend': string
  'profile.studyBuddy.emailPlaceholder': string
  'profile.studyBuddy.addButton': string
  'profile.studyBuddy.userNotFound': string
  'profile.studyBuddy.aiTitle': string
  'profile.studyBuddy.aiDesc': string
  'profile.studyBuddy.aiChatButton': string

  /* ── Profile Progress Tab ── */
  'profile.progress.totalXPLabel': string
  'profile.progress.streakLabel': string
  'profile.progress.avgLabel': string
  'profile.progress.currentDayLabel': string
  'profile.progress.chartHoursTitle': string
  'profile.progress.chartHoursSub': string
  'profile.progress.chartRadarTitle': string
  'profile.progress.chartRadarSub': string
  'profile.progress.chartMockTitle': string
  'profile.progress.chartMockSub': string
  'profile.progress.chartCalendarTitle': string
  'profile.progress.chartCalendarSub': string
  'profile.progress.chartXPHistoryTitle': string
  'profile.progress.chartXPHistorySub': string
  'profile.progress.dailyLogTitle': string
  'profile.progress.tableDate': string
  'profile.progress.tableHours': string
  'profile.progress.tableTopics': string
  'profile.progress.heatLow': string
  'profile.progress.heatHigh': string
  'profile.progress.hoursTooltip': string
  'profile.progress.predictionTitle': string
  'profile.progress.predictionDays': string
  'profile.progress.predictionDate': string
  'profile.progress.predictionPace': string
  'profile.progress.predictionFaster': string
  'profile.progress.predictionNoData': string
  'profile.progress.growthTitle': string
  'profile.progress.growthLessons': string
  'profile.progress.growthXP': string
  'profile.progress.growthWords': string

  /* ── Profile Achievements Tab ── */
  'profile.achievements.title': string
  'profile.achievements.users': string
  'profile.achievements.unlocked': string
  'profile.achievements.newBanner': string
  'profile.achievements.progressTitle': string
  'profile.achievements.showUnlocked': string
  'profile.achievements.showAll': string
  'profile.achievements.filterClear': string
  'profile.achievements.emptyTitle': string
  'profile.achievements.emptyNoUnlocked': string
  'profile.achievements.emptyNoCategory': string
  'profile.achievements.quickStats': string
  'profile.achievements.statsDay': string
  'profile.achievements.statsXP': string
  'profile.achievements.statsStreak': string
  'profile.achievements.statsWords': string
  'profile.achievements.awesomeButton': string

  /* ── Profile Leaders Tab ── */
  'profile.leaders.searchPlaceholder': string
  'profile.leaders.loading': string
  'profile.leaders.errorTitle': string
  'profile.leaders.emptyTitle': string
  'profile.leaders.emptyNoSearch': string
  'profile.leaders.emptySearch': string
  'profile.leaders.filterClear': string
  'profile.leaders.myPosition': string
  'profile.leaders.activeUsers': string
  'profile.leaders.formatXP': string
  'profile.leaders.formatStreak': string
  'profile.leaders.formatWords': string
  'profile.leaderSortXP': string
  'profile.leaderSortStreak': string
  'profile.leaderSortWords': string
  'profile.leaderSortDay': string
  'profile.canDoTitle': string
  'profile.canDoSubtitle': string

  /* ── Speaking ── */
  'speaking.title': string
  'speaking.subtitle': string
  'speaking.browserWarn': string
  'speaking.browserWarnAdvice': string
  'speaking.micPermissionDenied': string
  'speaking.micRetry': string
  'speaking.chatDescriptionDetail': string
  'speaking.modePrompt': string
  'speaking.modeChat': string
  'speaking.todayPrompts': string
  'speaking.allPrompts': string
  'speaking.loadingPrompts': string
  'speaking.promptTime': string
  'speaking.promptsCount': string
  'speaking.chatDescription': string
  'speaking.chatTopics': string
  'speaking.tipsHeader': string
  'speaking.speakTooltip': string
  'speaking.recordingTimer': string
  'speaking.recordInstruction': string
  'speaking.recordStop': string
  'speaking.recordDone': string
  'speaking.recordRewind': string
  'speaking.recordEvaluate': string
  'speaking.evaluating': string
  'speaking.resultTitle': string
  'speaking.overallScore': string
  'speaking.xpEarned': string
  'speaking.speechRate': string
  'speaking.wpmLabel': string
  'speaking.feedback': string
  'speaking.yourAnswer': string
  'speaking.retryButton': string
  'speaking.nextPromptButton': string
  'speaking.chatEnd': string
  'speaking.chatTurn': string
  'speaking.chatWaiting': string
  'speaking.chatPleaseWait': string
  'speaking.chatInputTip': string
  'speaking.chatMicButton': string
  'speaking.chatStopButton': string
  'speaking.chatSendButton': string
  'speaking.chatClaudeLoading': string
  'speaking.chatFeedbackTitle': string
  'speaking.chatCompleted': string
  'speaking.chatFeedbackTurnCount': string
  'speaking.chatFeedbackLoading': string
  'speaking.chatXPEarned': string
  'speaking.chatProgressLabel': string
  'speaking.chatChecklistLabel': string
  'speaking.chatCompletedStatus': string
  'speaking.chatNotCompletedStatus': string
  'speaking.chatTranscript': string
  'speaking.chatYou': string
  'speaking.chatClaude': string
  'speaking.chatBackButton': string
  'speaking.scoreFluency': string
  'speaking.scoreGrammar': string
  'speaking.scoreVocabulary': string
  'speaking.scoreAccuracy': string
  'speaking.bannerRoleplay': string
  'speaking.bannerNew': string
  'speaking.bannerRoleplayDesc': string
  'speaking.bannerPronunciation': string
  'speaking.bannerPronunciationDesc': string

  /* ── Listening ── */
  'listening.title': string
  'listening.subtitle': string
  'listening.tabWatch': string
  'listening.tabTranscript': string
  'listening.tabShadowing': string
  'listening.loading': string
  'listening.duration': string
  'listening.exercisesCount': string
  'listening.hasShadowing': string
  'listening.keyVocabulary': string
  'listening.transcriptHint': string
  'listening.transcriptTime': string
  'listening.goToExercises': string
  'listening.exerciseTitle': string
  'listening.fillBlanks': string
  'listening.trueFalse': string
  'listening.trueLabel': string
  'listening.falseLabel': string
  'listening.summary': string
  'listening.summaryHint': string
  'listening.summaryGood': string
  'listening.submitButton': string
  'listening.backButton': string
  'listening.nextButton': string
  'listening.resultTitle': string
  'listening.resultCorrect': string
  'listening.resultXPLabel': string
  'listening.resultFillBlank': string
  'listening.resultTrueFalse': string
  'listening.resultSummary': string
  'listening.selectLesson': string
  'listening.reviewButton': string
  'listening.audioOnlyMode': string
  'listening.videoMode': string
  'listening.videoError': string
  'listening.openYouTube': string
  'listening.retryVideo': string
  'listening.shadowingSegment': string
  'listening.shadowingReveal': string
  'listening.shadowingHide': string
  'listening.shadowingHint': string
  'listening.shadowingPrev': string
  'listening.shadowingNext': string
  'listening.shadowingTip': string
  'listening.audioListen': string

  /* ── Reading ── */
  'reading.title': string
  'reading.subtitle': string
  'reading.loading': string
  'reading.readingTime': string
  'reading.wordCount': string
  'reading.vocabCount': string
  'reading.questionsCount': string
  'reading.vocabLegend': string
  'reading.vocabWordLabel': string
  'reading.aiQuestionsTitle': string
  'reading.aiGenerate': string
  'reading.aiGenerating': string
  'reading.goToQuiz': string
  'reading.quizTitle': string
  'reading.submitButton': string
  'reading.resultTitle': string
  'reading.resultCorrect': string
  'reading.resultXPLabel': string
  'reading.yourAnswer': string
  'reading.correctAnswer': string
  'reading.selectText': string
  'reading.rereadButton': string
  'reading.ieltsTimerLabel': string

  /* ── Writing ── */
  'writing.title': string
  'writing.dailyTask': string
  'writing.tipsTitle': string
  'writing.editorPlaceholder': string
  'writing.draftSaved': string
  'writing.wordCount': string
  'writing.minWordsHint': string
  'writing.submitButton': string
  'writing.evaluating': string
  'writing.ieltsMode': string
  'writing.resultTitle': string
  'writing.overallScore': string
  'writing.xpEarned': string
  'writing.ieltsBandLabel': string
  'writing.belowIELTS': string
  'writing.scoreTaskAchievement': string
  'writing.scoreCoherence': string
  'writing.scoreVocabulary': string
  'writing.scoreGrammar': string
  'writing.feedback': string
  'writing.yourEssay': string
  'writing.errorAnalysisTitle': string
  'writing.errorAnalysisLoading': string
  'writing.improvedVersion': string
  'writing.rewriteButton': string
  'writing.finishButton': string
  'writing.promptTimeLimit': string

  /* ── VocabHub ── */
  'vocabHub.tabLearn': string
  'vocabHub.tabDictionary': string
  'vocabHub.tabPhrases': string
  'vocabHub.tabPhrasesDict': string
  'vocabHub.battleTitle': string
  'vocabHub.battleDesc': string
  'vocabHub.battlePlay': string

  /* ── Phrases ── */
  'phrases.title': string
  'phrases.loading': string
  'phrases.completeTitleReview': string
  'phrases.completeTitleDone': string
  'phrases.completeTitleBatch': string
  'phrases.completeDesc': string
  'phrases.completeCorrect': string
  'phrases.completeXP': string
  'phrases.completeFinish': string
  'phrases.completeNextBatch': string
  'phrases.emptyTitleToday': string
  'phrases.emptyDescToday': string
  'phrases.emptyTitleEmpty': string
  'phrases.emptyDescEmpty': string
  'phrases.emptyRefresh': string
  'phrases.reviewDue': string
  'phrases.reviewStart': string
  'phrases.batchLabel': string
  'phrases.batchReviewLabel': string
  'phrases.batchLearnedLabel': string
  'phrases.modeFlashcard': string
  'phrases.modeTest': string
  'phrases.modeGame': string
  'phrases.searchPlaceholder': string
  'phrases.filterAll': string
  'phrases.filterNew': string
  'phrases.filterLearning': string
  'phrases.filterLearned': string
  'phrases.filterClear': string
  'phrases.noResults': string
  'phrases.flashcardExit': string
  'phrases.flashcardNext': string
  'phrases.ratingYodladim': string
  'phrases.ratingBildim': string
  'phrases.ratingQiynaldim': string
  'phrases.ratingBilmadim': string
  'phrases.testExit': string
  'phrases.testNext': string
  'phrases.gameExit': string
  'phrases.saveError': string
  'phrases.tooltipTyping': string
  'phrases.tooltipScramble': string
  'phrases.tooltipCalendar': string
  'phrases.tooltipAnalytics': string
  'phrases.tooltipExport': string
  'phrases.tooltipRefresh': string
  'phrases.modeFlashcardDesc': string
  'phrases.modeTestDesc': string
  'phrases.modeGameDesc': string
  'phrases.batchRange': string
  'phrases.statsNew': string
  'phrases.statsReview': string
  'phrases.statsLearned': string

  /* ── Confusable ── */
  'confusable.title': string
  'confusable.subtitle': string
  'confusable.searchPlaceholder': string
  'confusable.clearAria': string
  'confusable.noResults': string
  'confusable.noResultsHint': string
  'confusable.quizButton': string
  'confusable.nExamples': string
  'confusable.seeAll': string
  'confusable.detailBack': string
  'confusable.detailRule': string
  'confusable.detailMemory': string
  'confusable.detailExamples': string
  'confusable.detailDelayTitle': string
  'confusable.detailDelayAction': string
  'confusable.detailDelayDesc': string
  'confusable.detailSRSTitle': string
  'confusable.detailSRSDesc': string
  'confusable.detailSRSAdd': string
  'confusable.detailSRSInfo': string
  'confusable.detailSRSAlert': string
  'confusable.detailSRSAlready': string
  'confusable.quizSelectCorrect': string
  'confusable.quizFillBlank': string
  'confusable.quizSelectWord': string
  'confusable.quizLabel': string
  'confusable.quizExplanation': string
  'confusable.quizNext': string
  'confusable.quizResult': string
  'confusable.finishedGradeExcellent': string
  'confusable.finishedGradeGood': string
  'confusable.finishedGradeAverage': string
  'confusable.finishedGradePractice': string
  'confusable.finishedScore': string
  'confusable.finishedRestart': string
  'confusable.finishedBack': string
  'confusable.srsDelayProgress': string
  'confusable.srsDelayInfo': string
  'confusable.srsSaving': string
  'confusable.srsPushInfo': string
  'confusable.quizProgressScore': string

  /* ── Idioms ── */
  'idioms.title': string
  'idioms.subtitle': string
  'idioms.searchPlaceholder': string
  'idioms.clearAria': string
  'idioms.filterAll': string
  'idioms.noResults': string
  'idioms.noResultsHint': string
  'idioms.quizButton': string
  'idioms.detailBack': string
  'idioms.detailMeaning': string
  'idioms.detailLiteral': string
  'idioms.detailExamples': string
  'idioms.detailOrigin': string
  'idioms.detailCategory': string
  'idioms.quizFindMeaning': string
  'idioms.quizFindIdiom': string
  'idioms.quizLabel': string
  'idioms.quizExplanation': string
  'idioms.quizNext': string
  'idioms.quizResult': string
  'idioms.finishedRestart': string
  'idioms.finishedBack': string
  'idioms.finishedTitle': string
  'idioms.finishedScore': string
  'idioms.quizProgressScore': string
  'idioms.quizQuestionCorrect': string
  'idioms.quizExplanationLabel': string
  'idioms.filterCategory': string
  'idioms.filterLevel': string

  /* ── Chat (AI Tutor) ── */
  'chat.title': string
  'chat.modeFreeTalk': string
  'chat.modeGrammar': string
  'chat.modeVocab': string
  'chat.modeWriting': string
  'chat.modeLesson': string
  'chat.apiKeyTitle': string
  'chat.apiKeyDesc': string
  'chat.apiKeyLink': string
  'chat.placeholderGeneral': string
  'chat.placeholderGrammar': string
  'chat.placeholderWriting': string
  'chat.placeholderVocab': string
  'chat.placeholderApiKey': string
  'chat.footerHint': string
  'chat.copyLabel': string
  'chat.regenerateLabel': string
  'chat.clearChatLabel': string
  'chat.inputAria': string
  'chat.sendAria': string

  /* ── Conversation ── */
  'conversation.title': string
  'conversation.subtitle': string
  'conversation.tip': string
  'conversation.loadingTitle': string
  'conversation.loadingDesc': string
  'conversation.reportCompleted': string
  'conversation.barFluency': string
  'conversation.barTaskSuccess': string
  'conversation.newWordsTitle': string
  'conversation.mistakesTitle': string
  'conversation.retryButton': string
  'conversation.otherScenario': string
  'conversation.hintsButton': string
  'conversation.endButton': string
  'conversation.listeningMic': string
  'conversation.inputPlaceholder': string
  'conversation.micTitleStart': string
  'conversation.micTitleStop': string
  'conversation.categoryDaily': string
  'conversation.categoryTravel': string
  'conversation.categoryWork': string
  'conversation.categorySocial': string
  'conversation.voiceTitle': string

  /* ── Pronunciation ── */
  'pronunciation.title': string
  'pronunciation.subtitle': string
  'pronunciation.tip': string
  'pronunciation.browserWarn': string
  'pronunciation.phrasesCount': string
  'pronunciation.phraseIndex': string
  'pronunciation.listenButton': string
  'pronunciation.speedSettingsLabel': string
  'pronunciation.speedSettingsAria': string
  'pronunciation.listeningMic': string
  'pronunciation.micStopHint': string
  'pronunciation.analyzing': string
  'pronunciation.micStartHint': string
  'pronunciation.analyzingTitle': string
  'pronunciation.scoreLabel': string
  'pronunciation.issuesTitle': string
  'pronunciation.heardPrefix': string
  'pronunciation.intonationTitle': string
  'pronunciation.intonationRise': string
  'pronunciation.intonationFall': string
  'pronunciation.intonationLine': string
  'pronunciation.yourAudio': string
  'pronunciation.hearSample': string
  'pronunciation.retryButton': string
  'pronunciation.prevButton': string
  'pronunciation.nextButton': string
  'pronunciation.speedLabel': string
  'pronunciation.voiceLabel': string
  'pronunciation.xpEarned': string

  /* ── SpeakingPath ── */
  'speakingPath.title': string
  'speakingPath.subtitle': string
  'speakingPath.tabPath': string
  'speakingPath.tabFree': string
  'speakingPath.currentDay': string
  'speakingPath.completed': string
  'speakingPath.days': string
  'speakingPath.reviewTitle': string
  'speakingPath.reviewDesc': string
  'speakingPath.stepReview': string
  'speakingPath.stepWarmup': string
  'speakingPath.stepVocab': string
  'speakingPath.stepGrammar': string
  'speakingPath.stepListen': string
  'speakingPath.stepShadow': string
  'speakingPath.stepSpeak': string
  'speakingPath.stepConverse': string
  'speakingPath.stepCooldown': string
  'speakingPath.seconds': string
  'speakingPath.minutes': string
  'speakingPath.backToLadder': string
  'speakingPath.reviewComplete': string
  'speakingPath.reviewCompleteDesc': string
  'speakingPath.reviewAvgScore': string
  'speakingPath.startLesson': string
  'speakingPath.dayComplete': string
  'speakingPath.dayStats': string
  'speakingPath.srsProgress': string
  'speakingPath.pronunciationFocus': string
  'speakingPath.globalSrs': string
  'speakingPath.nextDay': string
  'speakingPath.zoneLocked': string
  'speakingPath.zoneKun': string
  'speakingPath.estMinutes': string

  /* ── MockTest ── */
  'mockTest.title': string
  'mockTest.subtitle': string
  'mockTest.a1Title': string
  'mockTest.a1Sub': string
  'mockTest.weeklyB1Title': string
  'mockTest.weeklyB1Sub': string
  'mockTest.weeklyB2Title': string
  'mockTest.weeklyB2Sub': string
  'mockTest.ieltsTitle': string
  'mockTest.ieltsSub': string
  'mockTest.minutes': string
  'mockTest.questions': string
  'mockTest.ieltsSectionsTitle': string
  'mockTest.ieltsSectionReading': string
  'mockTest.ieltsSectionListening': string
  'mockTest.ieltsSectionWriting': string
  'mockTest.ieltsSectionSpeaking': string
  'mockTest.resultTitle': string
  'mockTest.resultB2': string
  'mockTest.resultB1Plus': string
  'mockTest.resultB1': string
  'mockTest.resultUp': string
  'mockTest.resultDown': string
  'mockTest.resultPrev': string
  'mockTest.sectionBreakdown': string
  'mockTest.weaknessTitle': string
  'mockTest.weaknessDesc': string
  'mockTest.weaknessLink': string
  'mockTest.retryButton': string
  'mockTest.homeButton': string
  'mockTest.weeklyLabel': string
  'mockTest.progressLabel': string
  'mockTest.questionOf': string
  'mockTest.nextButton': string
  'mockTest.finishButton': string
  'mockTest.sectionGrammar': string
  'mockTest.sectionVocab': string
  'mockTest.sectionReading': string
  'mockTest.answersGiven': string
  'mockTest.ieltsReadingTitle': string
  'mockTest.ieltsReadingFinish': string
  'mockTest.ieltsReadingNext': string
  'mockTest.ieltsListeningTitle': string
  'mockTest.ieltsListeningFinish': string
  'mockTest.listenPrompt': string
  'mockTest.listenPlayed': string
  'mockTest.listenPlays': string
  'mockTest.listenNotSupported': string
  'mockTest.ieltsWritingTask': string
  'mockTest.writingPlaceholder': string
  'mockTest.writingWords': string
  'mockTest.writingSubmit1': string
  'mockTest.writingSubmit2': string
  'mockTest.writingEval': string
  'mockTest.ieltsSpeakingTitle': string
  'mockTest.speakingNoSpeech': string
  'mockTest.speakingQuestion': string
  'mockTest.speakingPlaceholder': string
  'mockTest.speakingMicHint': string
  'mockTest.speakingRecord': string
  'mockTest.speakingStop': string
  'mockTest.speakingEval': string
  'mockTest.speakingNext': string
  'mockTest.speakingFinish': string
  'mockTest.wordCount': string

  /* ── PhrasalVerbs ── */
  'phrasalVerbs.title': string
  'phrasalVerbs.subtitle': string
  'phrasalVerbs.searchPlaceholder': string
  'phrasalVerbs.filterAll': string
  'phrasalVerbs.noResults': string
  'phrasalVerbs.tryDifferentQuery': string
  'phrasalVerbs.detailBack': string
  'phrasalVerbs.meaning': string
  'phrasalVerbs.examples': string

  /* ── SkillsPage ── */
  'skills.title': string
  'skills.subtitle': string
  'skills.filterAll': string
  'skills.bannerContent': string
  'skills.bannerSelected': string
  'skills.bannerSelectDesc': string
  'skills.bannerDesc': string
  'skills.statsLevelDist': string
  'skills.totalProgress': string
  'skills.quickLinksTitle': string
  'skills.skillSpeaking': string
  'skills.skillReading': string
  'skills.skillWriting': string
  'skills.skillListening': string
  'skills.skillGrammar': string
  'skills.skillVocabulary': string
  'skills.skillSpeakingDesc': string
  'skills.skillReadingDesc': string
  'skills.skillWritingDesc': string
  'skills.skillListeningDesc': string
  'skills.skillGrammarDesc': string
  'skills.skillVocabularyDesc': string
  'skills.levelA1': string
  'skills.levelA2': string
  'skills.levelB1': string
  'skills.levelB1Plus': string
  'skills.levelB2': string
  'skills.linkMockTest': string
  'skills.linkAiChat': string
  'skills.linkConversation': string
  'skills.linkPronunciation': string
  'skills.linkVocabBattle': string
  'skills.linkPhrases': string
  'skills.itemCount': string
  'skills.itemsTotal': string

  /* ── MixedReview ── */
  'mixedReview.title': string
  'mixedReview.subtitle': string
  'mixedReview.backAria': string
  'mixedReview.emptyState': string
  'mixedReview.goToLessons': string
  'mixedReview.submitButton': string
  'mixedReview.exerciseCount': string
  'mixedReview.newSession': string
  'mixedReview.resultScore': string
  'mixedReview.resultXP': string

  /* ── GrammarReview ── */
  'grammarReview.doneTitle': string
  'grammarReview.noReviewsTitle': string
  'grammarReview.doneDesc': string
  'grammarReview.noReviewsDesc': string
  'grammarReview.goToLessons': string
  'grammarReview.mixedReview': string
  'grammarReview.reviewListTitle': string
  'grammarReview.startReview': string
  'grammarReview.boxLabel': string
  'grammarReview.lapsesLabel': string
  'grammarReview.newLabel': string

  /* ── PlacementTest ── */
  'placementTest.title': string
  'placementTest.introTitle': string
  'placementTest.introDesc': string
  'placementTest.introPoint1': string
  'placementTest.introPoint2': string
  'placementTest.introPoint3': string
  'placementTest.startButton': string
  'placementTest.resultLevelLabel': string
  'placementTest.resultScore': string
  'placementTest.resultBandTitle': string
  'placementTest.saveAndContinue': string
  'placementTest.retryTest': string
  'placementTest.levelA2Plus': string
  'placementTest.levelB1': string
  'placementTest.levelB1Plus': string
  'placementTest.levelB2': string
  'placementTest.levelA2PlusDesc': string
  'placementTest.levelB1Desc': string
  'placementTest.levelB1PlusDesc': string
  'placementTest.levelB2Desc': string

  /* ── AiPractice ── */
  'aiPractice.title': string
  'aiPractice.subtitle': string
  'aiPractice.error': string
  'aiPractice.themeTitle': string
  'aiPractice.weakTopicsTitle': string
  'aiPractice.grammarTopicsTitle': string
  'aiPractice.loadingTitle': string
  'aiPractice.loadingDesc': string
  'aiPractice.resultScore': string
  'aiPractice.resultXP': string
  'aiPractice.resultTopic': string
  'aiPractice.retryTopic': string
  'aiPractice.newTopic': string
  'aiPractice.quizNext': string
  'aiPractice.quizFinish': string
  'aiPractice.explanationLabel': string
  'aiPractice.backToSetup': string
  'aiPractice.progressLabel': string
  'aiPractice.themeGeneral': string
  'aiPractice.themeSport': string
  'aiPractice.themeTech': string
  'aiPractice.themeTravel': string
  'aiPractice.themeBusiness': string
  'aiPractice.themeFood': string
  'aiPractice.themeMovie': string

  /* ── Dictionary ── */
  'dictionary.title': string
  'dictionary.subtitle': string
  'dictionary.searchPlaceholder': string
  'dictionary.searchAria': string
  'dictionary.clearSearchAria': string
  'dictionary.filterAll': string
  'dictionary.addButton': string
  'dictionary.addModalTitle': string
  'dictionary.addModalEnglish': string
  'dictionary.addModalUzbek': string
  'dictionary.addModalLevel': string
  'dictionary.addModalPhonetic': string
  'dictionary.addModalExample': string
  'dictionary.addModalSave': string
  'dictionary.addModalSaving': string
  'dictionary.addModalCloseAria': string
  'dictionary.addModalRequired': string
  'dictionary.addModalUzbekRequired': string
  'dictionary.addModalSuccess': string
  'dictionary.addModalError': string
  'dictionary.speakTitle': string
  'dictionary.deleteTitle': string
  'dictionary.deleteConfirm': string
  'dictionary.wordUserBadge': string
  'dictionary.wordLearned': string
  'dictionary.wordStudying': string
  'dictionary.wordNotStudied': string
  'dictionary.boxLabel': string
  'dictionary.scoreLabel': string
  'dictionary.exampleLabel': string
  'dictionary.personalWordLabel': string
  'dictionary.levelBadgeA1': string
  'dictionary.levelBadgeA2': string
  'dictionary.levelBadgeB1': string
  'dictionary.levelBadgeB2': string
  'dictionary.boxNew': string
  'dictionary.boxLearning': string
  'dictionary.boxReviewing': string
  'dictionary.boxAlmost': string
  'dictionary.boxLearned': string
  'dictionary.emptyTitle': string
  'dictionary.emptyDesc': string
  'dictionary.emptyAddFirst': string
  'dictionary.noResultsTitle': string
  'dictionary.noResultsDesc': string
  'dictionary.resultCount': string
  'dictionary.pageLabel': string
  'dictionary.yourWords': string
  'dictionary.countWords': string
  'dictionary.countResult': string
  'dictionary.userWordBadge': string
  'dictionary.yourWordLabel': string

  /* ── PhraseDictionary ── */
  'phraseDict.title': string
  'phraseDict.subtitle': string
  'phraseDict.searchPlaceholder': string
  'phraseDict.filterAll': string
  'phraseDict.filterClear': string
  'phraseDict.emptyTitle': string
  'phraseDict.emptyNoResults': string
  'phraseDict.pageLabel': string
  'phraseDict.totalLabel': string
  'phraseDict.learnedLabel': string
  'phraseDict.startedLabel': string
  'phraseDict.yodlangan': string
  'phraseDict.learning': string
  'phraseDict.notStudied': string
  'phraseDict.lastRating': string
  'phraseDict.boxDays': string
  'phraseDict.box': string
  'phraseDict.box1': string
  'phraseDict.box2': string
  'phraseDict.box3': string
  'phraseDict.box4': string
  'phraseDict.box5': string
  'phraseDict.box6': string
  'phraseDict.speakTitle': string
  'phraseDict.countResult': string

  /* ── ResetPassword ── */
  'resetPassword.title': string
  'resetPassword.subtitle': string
  'resetPassword.newPasswordLabel': string
  'resetPassword.confirmPasswordLabel': string
  'resetPassword.saveButton': string
  'resetPassword.savingButton': string
  'resetPassword.successTitle': string
  'resetPassword.successRedirect': string
  'resetPassword.errorMinLength': string
  'resetPassword.errorNotMatch': string
  'resetPassword.errorTimeout': string
  'resetPassword.placeholderPassword': string

  /* ── InvitePage ── */
  'invitePage.processingTitle': string
  'invitePage.successTitle': string
  'invitePage.authRequiredTitle': string
  'invitePage.errorTitle': string
  'invitePage.processingMessage': string
  'invitePage.successMessage': string
  'invitePage.authRequiredMessage': string
  'invitePage.errorMessageDefault': string
  'invitePage.codeNotFound': string
  'invitePage.alreadyFriend': string
  'invitePage.goToTandem': string
  'invitePage.goToAuth': string
  'invitePage.goHome': string

  /* ── Vocabulary (remaining strings) ── */
  'vocabPage.exitButton': string
  'vocabPage.nextButton': string
  'vocabPage.grammarAnalysis': string
  'vocabPage.reviewBanner': string
  'vocabPage.reviewStart': string
  'vocabPage.batchLabel': string
  'vocabPage.wordsCount': string
  'vocabPage.newCount': string
  'vocabPage.reviewCount': string
  'vocabPage.learnedCount': string
  'vocabPage.filterNew': string
  'vocabPage.filterLearning': string
  'vocabPage.filterLearned': string
  'vocabPage.filterClear': string
  'vocabPage.noResults': string
  'vocabPage.modeFlashcard': string
  'vocabPage.modeTest': string
  'vocabPage.modeGame': string
  'vocabPage.modeFlashcardDesc': string
  'vocabPage.modeTestDesc': string
  'vocabPage.modeGameDesc': string
  'vocabPage.batchPhaseName': string
  /* ── Vocabulary subcomponents (FilterBar, VocabViews, VocabHeader, FlashCardRenderer) ── */
  'vocabPage.searchPlaceholder': string
  'vocabPage.loading': string
  'vocabPage.rpcErrorTitle': string
  'vocabPage.refresh': string
  'vocabPage.dailyDone': string
  'vocabPage.dailyDoneDesc': string
  'vocabPage.noWordsTitle': string
  'vocabPage.noWordsDesc': string
  'vocabPage.reviewDone': string
  'vocabPage.dailyDoneAlt': string
  'vocabPage.batchDone': string
  'vocabPage.scoreText': string
  'vocabPage.correct': string
  'vocabPage.finish': string
  'vocabPage.nextBatch': string
  'vocabPage.backToSkills': string
  'vocabPage.game': string
  'vocabPage.sentenceGame': string
  'vocabPage.calendar': string
  'vocabPage.analytics': string
  'vocabPage.export': string
  'vocabPage.xpScore': string
  'aria.close': string
  'aria.goBack': string
  'aria.submit': string
  'aria.listenAll': string
  'aria.reload': string
  'aria.copy': string
  'aria.send': string
  'aria.audioSettings': string
  'aria.check': string
  'aria.danger': string
  'writing.essayLabel': string

  /* ── Connection Feedback ── */
  'connectionFeedback.tryWriting': string
  'connectionFeedback.writeMore': string
  'connectionFeedback.aiFeedback': string
  'connectionFeedback.exampleAnswer': string

  /* ── VocabLearner ── */
  'vocabLearner.ruleShort': string
  'vocabLearner.ruleLong': string
  'vocabLearner.ruleCVC': string
  'vocabLearner.ruleIncorrect': string
  'vocabLearner.testEnToUz': string
  'vocabLearner.testUzToEn': string
  'vocabLearner.testUsage': string
  'vocabLearner.testMixed': string
  'vocabLearner.tabBrowse': string
  'vocabLearner.tabFlashcard': string
  'vocabLearner.tabTest': string
  'vocabLearner.reviewFor': string
  'vocabLearner.nWords': string
  'vocabLearner.miniQuizReview': string
  'vocabLearner.headerEnglish': string
  'vocabLearner.headerUzbek': string
  'vocabLearner.headerExample': string
  'vocabLearner.flashKnown': string
  'vocabLearner.flashAllKnown': string
  'vocabLearner.flashEnglish': string
  'vocabLearner.flashTapReveal': string
  'vocabLearner.flashUzbek': string
  'vocabLearner.flashListenAgain': string
  'vocabLearner.flashTapHide': string
  'vocabLearner.flashPrev': string
  'vocabLearner.flashKnowKnown': string
  'vocabLearner.flashKnowUnknown': string
  'vocabLearner.flashNext': string
  'vocabLearner.flashCongrats': string
  'vocabLearner.flashLearnedAll': string
  'vocabLearner.flashMiniQuiz': string
  'vocabLearner.flashFullTest': string
  'vocabLearner.testNoWords': string
  'vocabLearner.testPerfect': string
  'vocabLearner.testGreat': string
  'vocabLearner.testGood': string
  'vocabLearner.testTryAgain': string
  'vocabLearner.testSaving': string
  'vocabLearner.testSaveSRS': string
  'vocabLearner.testSaved': string
  'vocabLearner.testRestart': string
  'vocabLearner.testMiniQuiz': string
  'vocabLearner.testSectionOf': string
  'vocabLearner.testNoQuestions': string
  'vocabLearner.testNextSection': string
  'vocabLearner.testQuizTitle': string
  'vocabLearner.testFillBlank': string
  'vocabLearner.testCorrect': string
  'vocabLearner.testWrong': string
  'vocabLearner.testCorrectAnswer': string
  'vocabLearner.testNextQuestion': string
  'vocabLearner.testFinish': string
  'vocabLearner.nWordsPlural': string

  /* ── VocabSentenceGame ── */
  'vocabGame.levelA1': string
  'vocabGame.levelA2': string
  'vocabGame.levelB1': string
  'vocabGame.levelB2': string
  'vocabGame.title': string
  'vocabGame.subtitle': string
  'vocabGame.selectLevel': string
  'vocabGame.nQuestions': string
  'vocabGame.loadingWords': string
  'vocabGame.score': string
  'vocabGame.englishWord': string
  'vocabGame.aiSentence': string
  'vocabGame.generating': string
  'vocabGame.checking': string
  'vocabGame.correct': string
  'vocabGame.wrong': string
  'vocabGame.wrongTranslation': string
  'vocabGame.correctAnswer': string
  'vocabGame.analyzing': string
  'vocabGame.grammarAnalysis': string
  'vocabGame.writeTranslation': string
  'vocabGame.next': string
  'vocabGame.pressEnter': string
  'vocabGame.percentCorrect': string
  'vocabGame.playAgain': string
  'vocabGame.changeLevel': string
  'vocabGame.mistakes': string
  'vocabGame.you': string
  'vocabGame.empty': string
  'vocabGame.correctLabel': string
  'vocabGame.perfectResult': string
  'vocabGame.allCorrect': string
  'vocabGame.close': string
  'vocabGame.promptWord': string
  'vocabGame.correctInstruction': string
  'vocabGame.aiError': string
  'vocabGame.aiErrorTitle': string
  'levelUp.a1Desc': string
  'levelUp.a2Desc': string
  'levelUp.b1Desc': string
  'levelUp.b1pDesc': string
  'levelUp.b2Desc': string
  'levelUp.c1Desc': string
  'levelUp.a1Unlock1': string
  'levelUp.a1Unlock2': string
  'levelUp.a1Unlock3': string
  'levelUp.a2Unlock1': string
  'levelUp.a2Unlock2': string
  'levelUp.a2Unlock3': string
  'levelUp.b1Unlock1': string
  'levelUp.b1Unlock2': string
  'levelUp.b1Unlock3': string
  'levelUp.b1pUnlock1': string
  'levelUp.b1pUnlock2': string
  'levelUp.b1pUnlock3': string
  'levelUp.b2Unlock1': string
  'levelUp.b2Unlock2': string
  'levelUp.b2Unlock3': string
  'levelUp.c1Unlock1': string
  'levelUp.c1Unlock2': string
  'levelUp.c1Unlock3': string

  /* ── VocabProgress ── */
  'vocabProgress.totalWords': string
  'vocabProgress.review': string
  'vocabProgress.days': string

  /* ── WordRow ── */
  'wordRow.aiAssistant': string
  'wordRow.learned': string
  'wordRow.new': string
  'wordRow.box': string

  /* ── WordTest ── */
  'wordTest.findUzbek': string
  'wordTest.findEnglish': string

  /* ── WordGame ── */
  'wordGame.matchWords': string

  /* ── FlashCard ── */
  'flashCard.new': string
  'flashCard.view': string
  'flashCard.learned': string
  'flashCard.box': string
  'flashCard.boxInterval': string
  'flashCard.correct': string
  'flashCard.wrong': string

  /* ── RetentionBar ── */
  'retentionBar.tooltip': string

  /* ── GrammarAnalysisPanel ── */
  'grammarAnalysis.title': string
  'grammarAnalysis.loading': string

  /* ── VocabCalendar / PhraseCalendar ── */
  'calendar.today': string
  'calendar.months': string
  'calendar.weekdays': string
  'calendar.completed': string
  'calendar.partial': string
  'calendar.notStarted': string
  'calendar.taskNotStarted': string
  'calendar.taskNotDone': string
  'calendar.startTask': string
  'calendar.continueTask': string
  'calendar.backToToday': string
  'calendar.batch': string
  'calendar.learned': string
  'calendar.viewed': string

  /* ── VocabAnalytics ── */
  'analytics.loading': string
  'analytics.studied': string
  'analytics.learned': string
  'analytics.dailyAvg': string
  'analytics.sessions': string
  'analytics.wordCount': string
  'analytics.phraseCount': string
  'analytics.dailyActivity': string
  'analytics.last14Days': string
  'analytics.boxDistribution': string
  'analytics.byLevel': string
  'analytics.total': string
  'analytics.wordsViewed': string
  'analytics.phrasesViewed': string
  'analytics.noData': string
  'analytics.noWordsYet': string
  'analytics.addWordsDesc': string
  'analytics.noPhrasesYet': string
  'analytics.addPhrasesDesc': string
  'analytics.learnedPerLevel': string
  'analytics.studiedPerLevel': string

  /* ── VocabTypingGame ── */
  'typingGame.title': string
  'typingGame.subtitle': string
  'typingGame.selectLevel': string
  'typingGame.questions': string
  'typingGame.loadingWords': string
  'typingGame.score': string
  'typingGame.uzbek': string
  'typingGame.checking': string
  'typingGame.correct': string
  'typingGame.wrong': string
  'typingGame.correctAnswer': string
  'typingGame.yourAnswer': string
  'typingGame.inputPlaceholder': string
  'typingGame.next': string
  'typingGame.pressEnter': string
  'typingGame.result': string
  'typingGame.percentCorrect': string
  'typingGame.playAgain': string
  'typingGame.changeLevel': string
  'typingGame.mistakes': string
  'typingGame.you': string
  'typingGame.empty': string
  'typingGame.correctLabel': string
  'typingGame.perfectResult': string
  'typingGame.allCorrect': string
  'typingGame.close': string
  'typingGame.grammarAnalysis': string
  'typingGame.viewAnalysis': string
  'typingGame.analyzing': string

  /* ── PhraseScrambleGame ── */
  'scrambleGame.uzbekPhrase': string
  'scrambleGame.clickWords': string
  'scrambleGame.undo': string
  'scrambleGame.check': string
  'scrambleGame.next': string
  'scrambleGame.correct': string
  'scrambleGame.wrong': string
  'scrambleGame.correctAnswer': string
  'scrambleGame.score': string

  /* ── PhraseRow ── */
  'phraseRow.pronounce': string
  'phraseRow.learned': string
  'phraseRow.new': string
  'phraseRow.box': string

  /* ── PhraseProgress ── */
  'phraseProgress.totalPhrases': string
  'phraseProgress.review': string
  'phraseProgress.days': string

  /* ── PhraseTest ── */
  'phraseTest.findUzbek': string
  'phraseTest.findEnglish': string

  /* ── Listening Professional Audio ── */
  'listening.professionalAudio': string
  'listening.listenAndFollow': string
  'listening.audioNotSupported': string
  'listening.listenedTimes': string

  /* ── CEFR Can-Do Statements ── */
  'cefrCanDo.title': string
  'cefrCanDo.levelTitle': string
  'cefrCanDo.lessonCanDo': string

  /* CEFR Progress Dashboard */
  'cefrProgress.title': string
  'cefrProgress.subtitle': string
  'cefrProgress.completed': string
  'cefrProgress.of': string
  'cefrProgress.lessons': string
  'cefrProgress.viewAll': string

  /* ── Daily Lesson: Listening ── */
  'dailyListening.preparing': string
  'dailyListening.listening': string
  'dailyListening.exercises': string
  'dailyListening.result': string
  'dailyListening.stepFirst': string
  'dailyListening.stepQuestions': string
  'dailyListening.goToQuestions': string
  'dailyListening.relisten': string
  'dailyListening.comprehensionTitle': string
  'dailyListening.answeredCount': string
  'dailyListening.replayAudio': string
  'dailyListening.dictation': string
  'dailyListening.dictationHint': string
  'dailyListening.dictationPlaceholder': string
  'dailyListening.lineNumber': string
  'dailyListening.discussion': string
  'dailyListening.checkAnswers': string
  'dailyListening.answerReview': string
  'dailyListening.dictationResults': string
  'dailyListening.backToListen': string
  'dailyListening.nextPhase': string
  'dailyListening.resultComplete': string
  'dailyListening.resultExcellent': string
  'dailyListening.resultGood': string
  'dailyListening.percentCorrect': string
  'dailyListening.listenedCount': string
  'dailyListening.restartFromStart': string

  /* ── Daily Lesson: Listening Player ── */
  'dailyListening.backupLink': string
  'dailyListening.exerciseLabel': string
  'dailyListening.speakerSpeaking': string
  'dailyListening.linesCount': string
  'dailyListening.hideTranscript': string
  'dailyListening.showTranscript': string
  'dailyListening.afterListenOnly': string
  'dailyListening.transcript': string
  'dailyListening.listenAllText': string

  /* ── Speaking History ── */
  'speakingHistory.title': string
  'speakingHistory.loading': string
  'speakingHistory.noResults': string
  'speakingHistory.noResultsDesc': string
  'speakingHistory.question': string
  'speakingHistory.feedback': string

  /* ── Audio Playback ── */
  'audioPlayback.yourAudio': string
  'audioPlayback.sample': string
  'audioPlayback.playing': string
  'audioPlayback.play': string
  'audioPlayback.pause': string

  /* ── Intonation Contour ── */
  'intonation.noPitchData': string

  /* ── Stress Visualizer ── */
  'stressVis.title': string
  'stressVis.stressed': string
  'stressVis.unstressed': string

  /* ── Daily Lesson: Speaking ── */
  'dailySpeaking.aiGeneratingTask': string
  'dailySpeaking.taskTitle': string
  'dailySpeaking.listen': string
  'dailySpeaking.tips': string
  'dailySpeaking.keyPhrases': string
  'dailySpeaking.speakNow': string
  'dailySpeaking.evaluate': string
  'dailySpeaking.evaluating': string
  'dailySpeaking.fluency': string
  'dailySpeaking.grammar': string
  'dailySpeaking.vocabulary': string
  'dailySpeaking.retry': string
  'dailySpeaking.browserNotSupported': string
  'dailySpeaking.xpEarned': string
  'dailySpeaking.paused': string

  /* ── Writing History ── */
  'writingHistory.title': string
  'writingHistory.loading': string
  'writingHistory.noResults': string
  'writingHistory.noResultsDesc': string
  'writingHistory.task': string
  'writingHistory.yourText': string
  'writingHistory.aiFeedback': string
  'writingHistory.wordCount': string

  /* ── Daily Lesson: Writing ── */
  'dailyWriting.aiGeneratingTask': string
  'dailyWriting.taskTitle': string
  'dailyWriting.targetWords': string
  'dailyWriting.estimatedTime': string
  'dailyWriting.tipsTitle': string
  'dailyWriting.keyPhrases': string
  'dailyWriting.suggestedStructure': string
  'dailyWriting.yourResponse': string
  'dailyWriting.placeholder': string
  'dailyWriting.goodLength': string
  'dailyWriting.overLimit': string
  'dailyWriting.submitButton': string
  'dailyWriting.evaluating': string
  'dailyWriting.analysing': string
  'dailyWriting.overallScore': string
  'dailyWriting.feedback': string
  'dailyWriting.improvedVersion': string
  'dailyWriting.editResubmit': string
  'dailyWriting.resultExcellent': string
  'dailyWriting.resultGood': string
  'dailyWriting.resultAverage': string
  'dailyWriting.resultPoor': string
  'dailyWriting.aiError': string
  'dailyWriting.wordCount': string
  'dailyWriting.scoreTaskAchievement': string
  'dailyWriting.scoreCoherence': string
  'dailyWriting.scoreVocabulary': string
  'dailyWriting.scoreGrammar': string

  /* ── Grammar Analysis sections ── */
  'grammarAnalysis.sectionTense': string
  'grammarAnalysis.sectionArticle': string
  'grammarAnalysis.sectionConjunctions': string
  'grammarAnalysis.sectionWordOrder': string
  'grammarAnalysis.sectionErrors': string
  'grammarAnalysis.sectionOverall': string
  'grammarAnalysis.sectionFallback': string

  /* ── Writing IELTS bands ── */
  'writing.ieltsBand9': string
  'writing.ieltsBand85': string
  'writing.ieltsBand75': string
  'writing.ieltsBand65': string
  'writing.ieltsBand55': string
  'writing.ieltsBand45': string
  'writing.rubricTitle': string
  'writing.rubricContent': string
  'writing.rubricGrammar': string
  'writing.rubricVocabulary': string
  'writing.rubricCoherence': string
  'writing.rubricShow': string
  'writing.rubricHide': string

  /* ── IELTS Mock Test ── */
  'ielts.title': string
  'ielts.timeRemaining': string
  'ielts.submit': string
  'ielts.score': string
  'ielts.pass': string
  'ielts.fail': string
  'ielts.readingPassage': string
  'sync.offline': string
  'sync.syncing': string
  'sync.complete': string
  'mixedReview.description': string
  'mixedReview.start': string
  'mixedReview.complete': string
  'mixedReview.retry': string

  'accessibility.vocab.exitFlashcard': string
  'accessibility.vocab.exitTest': string
  'accessibility.vocab.exitGame': string
  'accessibility.vocab.grammarAnalysis': string
  'accessibility.vocab.nextWord': string
  'accessibility.vocab.startReview': string
  'accessibility.vocab.batch': string
  'accessibility.dict.addWord': string
  'accessibility.dict.filterAll': string
  'accessibility.dict.filterLevel': string

  'crossReview.title': string
  'crossReview.description': string
  'mixedReview.loading': string
  'mixedReview.noExercises': string
  'crossReview.selectLevel': string
}

