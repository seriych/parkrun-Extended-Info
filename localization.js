// Локализация / Localization
var L10n = {

    en: { // English
        nativeLanguageTitle: 'English',
        sex: {m: 'm', f: ' f ', men: 'Men', women: 'Women', all: 'All'},
        summaryTable: {
            mainTitle: 'Summary run results',
                    fastest: 'Fastest time:',
                    ageRate: 'Top age grade:',
                    maxRaces: 'Most runs:',
                    number: 'Total participants:',
                    unknown: 'unknowns',
                    unknownTooltip: 'no barcode - no result :-(',
                    personalBest: 'Personal bests (PBs):',
                    firstHome: 'First time visiting this parkrun:',
            firstHomeNote: 'name (number of parkruns)',
                    firstRun: 'First timers:',
                    firstRunTooltip: 'Information is only available for the last run',
            jubileeNext: 'Upcoming milestones:',
            jubilee: 'Milestone run:',
            jubileeTooltip: 'Shows the total number of runs now, and not at the date of the viewed run',
                    ageAVG: 'Average age:*',
                    ageAVGTooltip: 'The average age may be inaccurate (deviation not more than 2 years)'
                },
                ageTable: {
                    mainTitle: 'Distribution by age and fastest by age',
                    WC: 'Wheelchair users',
            '---': 'Age not specified'
                },
        scriptSettings: {
            headerTooltip: 'Extension settings',
            showAgeTable: 'Show age groups table',
            showHoverStyle: 'Expand lists on mouseover',
            jubileeMax: {
                'title': 'Show upcoming milestone races:',
                '0': 'Do not show',
                '1': '1 run before',
                '2': '2 runs before',
                '3': '3 runs before',
                '4': '4 runs before',
                '5': '5 runs before'
            }
        }
    },

    pl: { // Polish
        nativeLanguageTitle: 'Polski',
        sex: {m: 'm', f: 'k ', men: 'Mężczyźni', women: 'Kobiety', all: 'Wszyscy'},
        summaryTable: {
            mainTitle: 'Podsumowanie wyników biegów',
                    fastest: 'Najszybszy czas:',
                    ageRate: 'Najlepszy współczynnik wieku:',
                    maxRaces: 'Największa liczba biegów:',
                    number: 'Całkowita liczba uczestników:',
                    unknown: 'nieznani',
                    unknownTooltip: 'nie ma kodu – nie ma wyniku :-(',
                    personalBest: 'Rekordy życiowe (PBs):',
                    firstHome: 'Debiutanci w tej lokalizacji parkrun:',
            firstHomeNote: 'imię (liczba parkrunów)',
                    firstRun: 'Debiutanci:',
                    firstRunTooltip: 'Dane dostępne tylko dla ostatniego biegu',
            jubileeNext: 'Zbliżający się jubileusz:',
            jubilee: 'Bieg jubileuszowy:',
            jubileeTooltip: 'Pokazuje całkowitą ilość biegów aktualnie, a nie w dniu danego biegu',
                    ageAVG: 'Średnia wieku:*',
                    ageAVGTooltip: 'Średnia wieku może nie być dokładna (różnica nie większa niż 2 lata)'
                },
                ageTable: {
                    mainTitle: 'Rozkład wieku i najszybsi w kategoriach wiekowych',
                    WC: 'Zawodnicy na wózkach inwalidzkich',
            '---': 'Wiek nie podany'
                },
        scriptSettings: {
            headerTooltip: 'Ustawienia rozszerzeń',
            showAgeTable: 'Pokaż tabelę wiekową',
            showHoverStyle: 'Rozwiń listę wskazaną kursorem',
            jubileeMax: {
                'title': 'Pokaż zbliżające się bieg jubileuszowy:',
                '0': 'Nie pokazuj',
                '1': '1 bieg wcześniej',
                '2': '2 biegi wcześniej',
                '3': '3 biegi wcześniej',
                '4': '4 biegi wcześniej',
                '5': '5 biegów wcześniej'
            }
        }
    },

    ru: { // Russian
        nativeLanguageTitle: 'Русский',
        sex: {m: 'м', f: 'ж', men: 'Мужчины', women: 'Женщины', all: 'Все'},
        summaryTable: {
            mainTitle: 'Сводные результаты забега',
            fastest: 'Лучшие по времени:',
            ageRate: 'Лучшие по возр. рейтингу:',
            maxRaces: 'Максимум забегов:',
            number: 'Всего участников:',
            unknown: 'редисок',
            unknownTooltip: 'нет штрихкода - нет результата :-(',
            personalBest: 'Личные рекорды:',
            firstHome: 'Впервые в гостях на этом parkrun:',
            firstHomeNote: 'имя (всего забегов)',
            firstRun: 'Впервые пробежали parkrun:',
            firstRunTooltip: 'Информация доступна только для последнего забега',
            jubileeNext: 'Скоро юбилейные забеги:',
            jubilee: 'Юбилейные забеги:',
            jubileeTooltip: 'Показывается общее число забегов на сегодняшний день, а не на момент проведения просматриваемого забега',
            ageAVG: 'Средний возраст:*',
            ageAVGTooltip: 'Средний возраст может быть неточным (отклонение не более 2 лет)'
        },
        ageTable: {
            mainTitle: 'Число участников и быстрейшие по возрастам',
            WC: 'Инвалиды-колясочники',
            '---': 'Возраст не указан'
        },
        scriptSettings: {
            headerTooltip: 'Настройки расширения',
            showAgeTable: 'Показывать результаты по возрастам',
            showHoverStyle: 'Раскрывать списки при наведении мыши',
            jubileeMax: {
                'title': 'Показывать приближение к юбилейным забегам:',
                '0': 'Не показывать',
                '1': 'За 1 забег',
                '2': 'За 2 забега',
                '3': 'За 3 забега',
                '4': 'За 4 забега',
                '5': 'За 5 забегов'
            }
        }
    },

    fr: { // French
        nativeLanguageTitle: 'Français',
        sex: {m: 'h', f: 'f ', men: 'Homme', women: 'Femme', all: 'Tous'},
        summaryTable: {
            mainTitle: 'Récapitulatif des résultats',
                    fastest: 'Meilleur temps:',
                    ageRate: 'Meilleur gradient d’Age:',
                    maxRaces: 'Plus grand nombre de footings:',
                    number: 'Nombre total de participants:',
                    unknown: 'inconnus',
                    unknownTooltip: 'pas de code barre – pas de résultat :-(',
                    personalBest: 'Meilleures Performances (MPs):',
                    firstHome: 'Premières participations à ce parkrun:',
            firstHomeNote: 'Nom (nombre de participations):',
                    firstRun: 'Premières participations:',
                    firstRunTooltip: 'Cette information est seulement disponible pour la dernière participation',
            jubileeNext: 'Prochains entrants d’un Club:',
            jubilee: 'Nouveaux entrants d’un Club:',
            jubileeTooltip: 'Indique le nombre total de footings actuel et non à la date de ce footing',
                    ageAVG: 'Age moyen:*',
                    ageAVGTooltip: 'L’âge moyen peut être imprécis (pas plus de 2 ans d’écart)'
                },
                ageTable: {
                    mainTitle: 'Répartition par tranches d’âge et meilleur temps par tranches d’âge',
                    WC: 'Coureurs en fauteuil roulant',
            '---': 'Age non indiqué'
                },
        scriptSettings: {
            headerTooltip: 'Paramètres d’extension',
            showAgeTable: 'Faire apparaître le tableau par tranches d’âge',
            showHoverStyle: 'Dérouler la liste au passage de la souris',
            jubileeMax: {
                'title': 'Faire apparaître les prochains entrants d’un Club:',
                '0': 'Ne pas faire apparaître',
                '1': '1 participation avant',
                '2': '2 participations avant',
                '3': '3 participations avant',
                '4': '4 participations avant',
                '5': '5 participations avant'
            }
        }
    },

    cn: { // Simplified Chinese
        nativeLanguageTitle: '简体中文',
        sex: {m: '男', f: '女', men: '男子', women: '女子', all: '全部性别'},
        summaryTable: {
            mainTitle: '跑步成绩报告',
                    fastest: '最快用时记录',
                    ageRate: '年龄组最佳成绩百分比',
                    maxRaces: '最多公园跑个人参加记录',
                    number: '参加总人数',
                    unknown: '无姓名参加者',
                    unknownTooltip: '未带条形码 - 没有成绩记录 :-(',
                    personalBest: '个人最佳成绩',
                    firstHome: '第一次参加此公园跑的人数',
            firstHomeNote: '姓名 （参加公园跑次数）',
                    firstRun: '第一次参加公园跑的人数',
                    firstRunTooltip: '仅上次跑的信息可供查询',
            jubileeNext: '下几次跑达到里程碑的人数',
            jubilee: '本次跑达到里程碑记录的人数',
            jubileeTooltip: '显示到目前（今天总参加数量',
                    ageAVG: '平均年龄 *',
                    ageAVGTooltip: '平均年龄不一定精确（误差不超过2岁）'
                },
                ageTable: {
                    mainTitle: '年龄组别最快用时分布记录',
                    WC: '使用轮椅的人数',
            '---': '无年龄信息的人数'
                },
        scriptSettings: {
            headerTooltip: '文档设定',
            showAgeTable: '显示年龄组别表格',
            showHoverStyle: '点击鼠标显示更多',
            jubileeMax: {
                'title': '显示下几次跑达到里程碑记录参赛数量',
                '0': '不要显示',
                '1': '剩余一次达到',
                '2': '剩余两次达到',
                '3': '剩余三次达到',
                '4': '剩余四次达到',
                '5': '剩余五次达到'
            }
        }
    },

    tw: { // Traditional Chinese
        nativeLanguageTitle: '繁體中文',
        sex: {m: '男', f: '女', men: '男子', women: '女子', all: '全部性别'},
        summaryTable: {
            mainTitle: '跑步成績彙總',
                    fastest: '最快時間:',
                    ageRate: '年齡組最佳成績百分比:',
                    maxRaces: '個人參加最多公園跑記錄:',
                    number: '參加總人數:',
                    unknown: '未知姓名參加者',
                    unknownTooltip: '未帶條碼 - 無成績記錄 :-(',
                    personalBest: '個人最佳成績:',
                    firstHome: '初次參加本地公園跑人數:',
            firstHomeNote: '姓名 (參加公園跑次數)',
                    firstRun: '初次參加公園跑人數:',
                    firstRunTooltip: '僅上次跑的訊息可供查詢',
            jubileeNext: '將達到里程碑的人數',
            jubilee: '本次跑達到里程碑的人數',
            jubileeTooltip: '顯示到目前總參加數量',
                    ageAVG: '平均年齡:*',
                    ageAVGTooltip: '平均年齡可能不正確(誤差不超過2歲)'
                },
                ageTable: {
                    mainTitle: '年齡組別人數及年齡組別最快時間',
                    WC: '使用輪椅的人數',
            '---': '未註明年齡'
                },
        scriptSettings: {
            headerTooltip: '設定選項',
            showAgeTable: '顯示年齡組別表格',
            showHoverStyle: '點擊游標顯示更多',
            jubileeMax: {
                'title': '顯示將達到參賽里程碑的人數',
                '0': '不顯示',
                '1': '剩一次達到',
                '2': '剩兩次達到',
                '3': '剩三次達到',
                '4': '剩四次達到',
                '5': '剩五次達到'
            }
        }
    },

    jp: { // Japanese
        nativeLanguageTitle: '日本語',
        sex: {m: '男', f: '女', men: '男性', women: '女性', all: '全体'},
        summaryTable: {
            mainTitle: '集計結果',
                    fastest: '最速タイム',
                    ageRate: '最高年齢換算スコア',
                    maxRaces: '最多参加',
                    number: '参加者合計',
                    unknown: '不明',
                    unknownTooltip: 'バーコードが無い場合は結果は出ません',
                    personalBest: '自己ベスト',
                    firstHome: '本パークラン初参加',
            firstHomeNote: '名前（参加回数）',
                    firstRun: '初参加者',
                    firstRunTooltip: '直近のパークランのみで表示',
            jubileeNext: '次回表彰者',
            jubilee: '表彰者',
            jubileeTooltip: '当時ではなく現在の参加回数を表示',
                    ageAVG: '平均年齢 *',
                    ageAVGTooltip: '平均年齢は2歳以下のずれがあります'
                },
                ageTable: {
                    mainTitle: '年代別の参加者数＆最速タイム',
                    WC: '車椅子参加者',
            '---': '年齢未回答'
                },
        scriptSettings: {
            headerTooltip: 'スクリプト設定',
            showAgeTable: '年代別結果の表示',
            showHoverStyle: 'マウスを使ってリストを拡大',
            jubileeMax: {
                'title': '次回表彰大会を表示',
                '0': '表示しない',
                '1': '前回大会',
                '2': '2つ前の大会',
                '3': '3つ前の大会',
                '4': '4つ前の大会',
                '5': '5つ前の大会'
            }
        }
    }

};