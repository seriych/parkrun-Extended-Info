(function() {
    'use strict';

    var latestPage = false;
    var juniorsPage = false;

    // Выполняем обработку, если мы на нужной странице
    if (isResultsPage()) {

        // Локализация / Localization
        var L10n = {
            en: {
                nativeLanguageTitle: 'English',
                sex: {m: 'm', f: ' f ', men: 'Men', women: 'Women', all: 'All'},
                summaryTable: {
                    mainTitle: 'Summary run results',
                    fastest: 'Fastest time:',
                    ageRate: 'Top age grade: ',
                    maxRaces: 'Most runs:',
                    number: 'Total participants:',
                    unknown: 'unknowns',
                    unknownTooltip: 'no barcode - no result :-(',
                    personalBest: 'Personal bests (PBs):',
                    firstHome: 'First time visiting this parkrun:',
                    firstHomeNote: 'name (number of parkruns)',
                    firstRun: 'First timers:',
                    firstRunTooltip: 'Information is only available for the last run',
                    jubileeNext: 'Upcoming milestone:',
                    jubilee: 'Milestone run:',
                    jubileeTooltip: 'Shows the total number of run now, and not at the date of the viewed run',
                    ageAVG: 'Average age:*',
                    ageAVGTooltip: 'The average age may be inaccurate (deviation not more than 2 years)'
                },
                ageTable: {
                    mainTitle: 'Distribution by age and fastest by age',
                    WC: 'Wheelchair users',
                    '---': 'Age not specified'
                },
                scriptSettings: {
                    headerTooltip: 'Script settings',
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
            ru: {
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
                    jubileeNext: 'Скоро юбилейный забег:',
                    jubilee: 'Юбилейный забег:',
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
                    headerTooltip: 'Настройки скрипта',
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
            }
        };

        // настройки по умолчанию
        var LANG = 'en';
        var jubileeMax = 2;
        var showAgeTable = true;
        var showHoverStyle = true;
        var defaultPrefs = {
            LANG: LANG,
            jubileeMax: jubileeMax,
            showAgeTable: showAgeTable,
            showHoverStyle: showHoverStyle
        };

        // иконки
        var IMG = {
            extIco48: chrome.runtime.getURL('images/icon48.png'),
            prefsIco36: chrome.runtime.getURL('images/config36.png'),
            prefsBackground: chrome.runtime.getURL('images/prefsBackground.png'),
            en: chrome.runtime.getURL('images/flags/en.png'),
            ru: chrome.runtime.getURL('images/flags/ru.png'),
            m: chrome.runtime.getURL('images/man36.png'),
            f: chrome.runtime.getURL('images/woman36.png')
        };
        if (juniorsPage) {
            IMG.prefsBackground = chrome.runtime.getURL('images/prefsBackgroundJuniors.png');
        }

        // Читаем настройки из кэша
        var lsprefs = {};
        chrome.storage.local.get(['parkrunExtendedInfo'], function(result) {
            if (result.parkrunExtendedInfo !== undefined) {
                lsprefs = result.parkrunExtendedInfo;
                console.log(lsprefs);
                if (lsprefs.LANG !== undefined && L10n.hasOwnProperty(lsprefs.LANG)) {
                    LANG = lsprefs.LANG;
                }
            }
            extendObjects(lsprefs, defaultPrefs);
            // запускаем основное тело скрипта
            main();
        });
    } else {
        return;
    }

    // Основное тело скрипта
    function main() {
        // добавляем непереведенные фразы из основных языков
        if (LANG != 'ru') {
            extendObjects(L10n.en, L10n.ru);
            if (LANG != 'en') {
                extendObjects(L10n[LANG], L10n.en);
            }
        }

        // заменяем пробелы на неразрывные для выравнивания колонок
        L10n[LANG].sex.m = L10n[LANG].sex.m.replace(/\s/g, '&nbsp;');
        L10n[LANG].sex.f = L10n[LANG].sex.f.replace(/\s/g, '&nbsp;');

        // удаляем добавленные скриптом элементы
        if (document.getElementById('scriptPrefsMain') !== null) {
            document.getElementById('scriptPrefsMain').remove();
        }
        if (document.getElementById('scriptTage') !== null) {
            document.getElementById('scriptTage').remove();
        }
        if (document.getElementById('scriptTsummary') !== null) {
            document.getElementById('scriptTsummary').remove();
        }


        // добавляем на страницу блок настроек скрипта
        addMainOptionsSelector();

        var note = { // ru             en              pl           it              de             dk              fr                  jp           sw
            pb:    ["Личный рекорд!", "New PB!",      "Nowe PB!",  "Nuovo PB!",    "Neue PB!",    "Ny PB!",       "Meilleure Perf'!", "自己ベスト!", "Nytt PB!"],
            first: ["Первый забег!",  "First Timer!", "Debiutant", "Prima volta!", "Erstläufer!", "Første gang!", "Première Perf'!",  "初参加!",   "Debut!"]
        };

        var Cmain = document.getElementById('main');
        var Tresults = document.getElementById('results');
        var Atr = Tresults.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

        if (document.getElementById('scriptStyles') !== null) {
            document.getElementById('scriptStyles').remove();
        }
        if (lsprefs.showHoverStyle) {
            var trHoverStyle = 'display: block;';
        } else {
            trHoverStyle = 'display: none;';
        }
        if (document.getElementById('scriptStyles') === null) {
            var style = document.createElement('style');
            style.id = 'scriptStyles';
            style.innerHTML = '.ageTable, .summaryTable {font-family: sans-serif, Arial; text-align: center; border: 2px solid #c7dbe3; border-collapse: collapse; background: #f5fafc; margin: 30px 5px 20px; font-size: 11pt; width: 100%;} \
                               .ageTable thead th, .summaryTable thead th {font-weight: normal; font-size: 14pt; background: #e5f3fc;} \
                               .ageTable td, .summaryTable td, .ageTable th, .summaryTable th {border: 1px solid #c7dbe3;} \
                               .ageTable td, .summaryTable td {padding: 5px;} \
                               .ageTable th, .summaryTable th {padding: 5px 0px; vertical-align: middle;} \
                               .ageTable th:nth-child(1), .summaryTable th:nth-child(1) {font-weight: bold; text-align: left; font-size: 12pt; padding: 0px 10px;} \
                               .ageTable th:nth-child(2) {width: 90px;} \
                               .summaryTable td:nth-child(1) {padding-left: 10px; text-align: left; font-weight: bold;} \
                               .summaryTable tr:nth-child(1) td:not(:nth-child(2)), .summaryTable tr:nth-child(2) td:not(:nth-child(2)), .summaryTable tr:nth-child(3) td:not(:nth-child(2)) \
                                   {padding-left: 10px; text-align: left;} \
                               .ageTable td:nth-child(3n), .ageTable td:nth-child(3n+1) {width: 45px;} \
                               .ageTable tbody tr:hover, .summaryTable tbody tr:hover {background: #e5f3fc; font-weight: bold; vertical-align: top;} \
                               .ageTable tbody td p, .summaryTable tbody td p {text-align: left; font-weight: normal; display: none; margin: 0px !important;} \
                               .ageTable tbody td p {font-size: 9pt; text-indent: -40px; padding-left: 40px;} \
                               .summaryTable tbody td p {font-size: 10pt; margin-left: 5px;} \
                               .ageTable tbody td p:first-child, .summaryTable tbody td p:first-child {margin-top: 5px;} \
                               .ageTable tbody tr:hover p, .summaryTable tbody tr:hover p {' + trHoverStyle + '} \
                               .sexMF img {vertical-align: middle;} \
                               .sexMF span {font-size: 14pt; vertical-align: middle;} \
                               .guestsInfo {margin: 20px 15px -10px; font-size: 11pt; text-align: left;} \
                               .guestsInfo p {margin-bottom: 5px;} \
                               .guestsInfo p span {font-weight: bold;} \
                               .scriptPrefsMain {font-family: sans-serif, Arial; position: absolute; right: 100px; top: 5px; width: 200px; z-index: 4; align: left; text-align: left;}\
                               .headerPrefs {font-size: 10pt; text-align: left; color: white; text-shadow: #222222 -1px -1px 1px, #222222 -1px 1px 1px, #222222 1px -1px 1px, #222222 1px 1px 1px;}\
                               .selLang {display: inline-block; margin: 5px auto 0px; text-align: left;}\
                               .extIco {float: left; margin-right: 2px;}\
                               .optionFlag {display: inline-block; padding: 4px;}\
                               .optionFlag:hover {padding: 2px; border: 2px dashed #DDDDDD; cursor: pointer;}\
                               .currentFlag {vertical-align: top; padding: 2px; border: 2px inset #DDDDDD;}\
                               .scriptPrefs {font-size: 10pt; font-family: sans-serif, Arial; background: rgba(140, 155, 100, 0.9); position: absolute; right: 345px; top: 0px; padding: 2px 10px; width: auto; height: 160px; z-index: 4; text-align: left;}\
                               .scriptPrefs div {border-top: 1px dashed #AACCBB; vertical-align: middle; color: white; text-shadow: #333333 -1px -1px 1px, #333333 -1px 1px 1px, #333333 1px -1px 1px, #333333 1px 1px 1px; margin-top: 3px; padding-top: 2px;}\
                               .scriptPrefs div input {vertical-align: middle; margin-right: 5px;}\
                               .scriptPrefsIcoDiv {filter: grayscale(100%); position: absolute; right: 305px; top: 5px; width: 36px; height: 48px; z-index: 4; background: url("' + IMG.prefsIco36 + '") no-repeat center center; background-size: 32px;}\
                               .scriptPrefsIcoDiv:hover {filter: none !important; cursor: pointer; background-size: 36px !important;}\
                               .selJubilee {margin-top: 2px;}\
                               .selJubilee option {color: rgb(0, 0, 0); font-weight: normal;}\
                               .selJubilee option:checked {color: rgb(0, 144, 255) !important; font-weight: bold !important;}\
                              ';
            Cmain.appendChild(style);
        }

        // база для хранения собранной информации
        var DB = {
            firstRun: {
                        all: {all: 0, home: 0, allNames: [], homeNames: []},
                          m: {all: 0, home: 0, allNames: [], homeNames: []},
                          f: {all: 0, home: 0, allNames: [], homeNames: []}
            },
            maxRaces: {
                        m: {name: '', races: 0},
                        f: {name: '', races: 0}
            },
            jubilee: {
                        all: {number: 0, names: [], strNames: ''},
                          m: {number: 0, names: [], strNames: ''},
                          f: {number: 0, names: [], strNames: ''},
                       next: {
                        all: {number: 0, names: [], strNames: ''},
                          m: {number: 0, names: [], strNames: ''},
                          f: {number: 0, names: [], strNames: ''}
                       }
            },
            personalBest: {
                        all: {number: 0, names: [], strNames: ''},
                          m: {number: 0, names: [], strNames: ''},
                          f: {number: 0, names: [], strNames: ''}
            },
            fastest: {
                        m: {name: '', time: 0},
                        f: {name: '', time: 0}
            },
            ageRate: {
                        m: {name: '', rate: 0},
                        f: {name: '', rate: 0}
            },
            ageNumber: {},
            number: {all: 0, m: 0, f: 0, u: 0, WC: {all: 0, m: 0, f: 0}, '---': {all: 0, m: 0, f: 0}},
            ageAVG: {m: 0, f: 0}
        }

        // перебираем всех участников забега и собираем информацию
        for (var i = 0; i < Atr.length; i++) {
            var Atd = Atr[i].getElementsByTagName('td');
            if (Atd.length > 10) {
                var indexes = {name: 1, time: 2, age: 3, rate: 4, sex: 5, persbest: 8, races: 9};
            } else {
                indexes = {name: 0, time: 1, age: 2, rate: 3, sex: 4, persbest: 6, races: 7};
            }
            var time = Atd[indexes.time].innerHTML;
            if (time == '') {
                DB.number.u += 1;
            } else {
                var name = Atd[indexes.name].getElementsByTagName('a')[0].innerHTML;
                name = name.split(/(\s|\-)+/).map(word => word[0].toUpperCase() + word.substring(1).toLowerCase()).join(' ').replace(/\s*\-\s*/g, '-');
                var rate = parseFloat(Atd[indexes.rate].innerHTML);
                var sex = Atd[indexes.sex].innerHTML.toLowerCase();
                if (sex == 'f') {
                    Atd[indexes.sex].style.backgroundColor = '#FFE0FF';
                    Atd[indexes.name].style.backgroundColor = '#FFE0FF';
                }
                var age = Atd[indexes.age].getElementsByTagName('a')[0].innerHTML.replace(/^[^0-9\-]*/, '');
                if (age.length < 1) {
                    age = 'WC';
                }
                if (!DB.ageNumber.hasOwnProperty(age)) {
                    DB.ageNumber[age] = {all: {names: []}, m: {number: 0, time: '', name: '', names: []}, f: {number: 0, time: '', name: '', names: []}};
                }
                DB.ageNumber[age][sex].number += 1;
                DB.ageNumber[age][sex].names.push({time: time, name: name});
                DB.ageNumber[age].all.names.push({time: time, name: name, sex: sex});
                if (DB.ageNumber[age][sex].time == '' || time2sec(time) < time2sec(DB.ageNumber[age][sex].time)) {
                    DB.ageNumber[age][sex].time = time;
                    DB.ageNumber[age][sex].name = name;
                }
                var persbest = Atd[indexes.persbest].innerHTML;
                var races = parseInt(Atd[indexes.races].innerHTML);
                if (races == 1) {
                    DB.firstRun[sex].all += 1;
                    DB.firstRun[sex].allNames.push({name: name});
                } else if (isJubileeNow(races)) {
                    DB.jubilee[sex].number += 1;
                    DB.jubilee[sex].names.push({name: name, races: races});
                    DB.jubilee.all.number += 1;
                    DB.jubilee.all.names.push({name: name, races: races});
                } else if (isJubileeSoon(races)) {
                    DB.jubilee.next[sex].number += 1;
                    DB.jubilee.next[sex].names.push({name: name, races: races});
                    DB.jubilee.next.all.number += 1;
                    DB.jubilee.next.all.names.push({name: name, races: races});
                }
                if (~note.first.indexOf(persbest)) {
                    if (races != 1) {
                        DB.firstRun[sex].home += 1;
                        DB.firstRun[sex].homeNames.push({name: name, races: races});
                    }
                } else if (~note.pb.indexOf(persbest)) {
                    DB.personalBest[sex].number += 1;
                    DB.personalBest[sex].names.push({name: name, time: time});
                }
                DB.number[sex] += 1;
                if (DB.fastest[sex].time == 0 || time2sec(time) < time2sec(DB.fastest[sex].time)) {
                    DB.fastest[sex].time = time;
                    DB.fastest[sex].name = name;
                }
                if (rate > DB.ageRate[sex].rate) {
                    DB.ageRate[sex].rate = rate;
                    DB.ageRate[sex].name = name;
                }
                if (races > DB.maxRaces[sex].races) {
                    DB.maxRaces[sex].races = races;
                    DB.maxRaces[sex].name = name;
                }
            }
        }
        DB.personalBest.all.number = DB.personalBest.m.number + DB.personalBest.f.number;
        DB.number.all = DB.number.m + DB.number.f + DB.number.u;
        DB.firstRun.all.home = DB.firstRun.m.home + DB.firstRun.f.home;
        DB.firstRun.all.all = DB.firstRun.m.all + DB.firstRun.f.all;
        for (sex of ['m', 'f']) {
            for (var key of ['allNames', 'homeNames']) {
                for (i = 0; i < DB.firstRun[sex][key].length; i++) {
                    DB.firstRun.all[key].push(DB.firstRun[sex][key][i]);
                }
                DB.firstRun[sex][key].sort(compareFirst);
            }
            for (i = 0; i < DB.personalBest[sex].names.length; i++) {
                DB.personalBest.all.names.push(extendObjects({sex: sex}, DB.personalBest[sex].names[i]));
            }
            DB.personalBest[sex].names.sort(compareByName);
            DB.jubilee[sex].names.sort(compareByRaces);
            DB.jubilee.next[sex].names.sort(compareByRaces);

        }
        DB.firstRun.all.allNames.sort(compareFirst);
        DB.firstRun.all.homeNames.sort(compareFirst);
        DB.personalBest.all.names.sort(compareByName);
        DB.jubilee.all.names.sort(compareByRaces);
        DB.jubilee.next.all.names.sort(compareByRaces);

        // добавляем на страничку информацию о количестве участников по возрастным группам
        var Tage = document.createElement('table');
        Tage.id = 'scriptTage';
        Tage.className = 'ageTable';
        var Tagehead = document.createElement('thead');
        Tagehead.innerHTML = '<tr>\
                                  <th style="width: 220px;">' + L10n[LANG].ageTable.mainTitle + '</th>\
                                  <th class="sexMF" title="' + L10n[LANG].sex.all + '">\
                                      <img src="' + IMG.m + '"><span>+</span><img src="' + IMG.f + '">\
                                  </th>\
                                  <th colspan="3" class="sexMF" title="' + L10n[LANG].sex.men + '"><img src="' + IMG.m + '"></th>\
                                  <th colspan="3" class="sexMF" title="' + L10n[LANG].sex.women + '"><img src="' + IMG.f + '"></th>\
                              </tr>';
        Tage.appendChild(Tagehead);
        var Tagebody = document.createElement('tbody');
        Tage.appendChild(Tagebody);
        var Aage = Object.keys(DB.ageNumber).sort();
        for (i = 0; i < Aage.length; i++) {
            var agetr = document.createElement('tr');
            var ageGR = Aage[i];
            var GRname = ageGR;
            var mnumber = DB.ageNumber[ageGR].m.number;
            var fnumber = DB.ageNumber[ageGR].f.number;
            var allnumber = mnumber + fnumber;
            if (ageGR != 'WC' && ageGR != '---') {
                var ageAVG = ageGR.split('-');
                ageAVG = (parseInt(ageAVG[ageAVG.length - 1]) + parseInt(ageAVG[0])) / 2.0;
                DB.ageAVG.m += ageAVG * mnumber;
                DB.ageAVG.f += ageAVG * fnumber;
            } else {
                DB.number[ageGR].m = mnumber;
                DB.number[ageGR].f = fnumber;
                DB.number[ageGR].all = mnumber + fnumber;
                GRname = L10n[LANG].ageTable[ageGR];
            }
            agetr.innerHTML = '<td>' + GRname + names2p(DB.ageNumber[ageGR].all.names) + '</td>' +
                '<td>' + allnumber + '</td>' +
                '<td>' + mnumber + '</td>' +
                '<td>' + DB.ageNumber[ageGR].m.time + '</td>' +
                '<td>' + DB.ageNumber[ageGR].m.name + names2p(DB.ageNumber[ageGR].m.names) + '</td>' +
                '<td>' + fnumber + '</td>' +
                '<td>' + DB.ageNumber[ageGR].f.time + '</td>' +
                '<td>' + DB.ageNumber[ageGR].f.name + names2p(DB.ageNumber[ageGR].f.names) + '</td>';
            Tagebody.appendChild(agetr);
        }
        if (lsprefs.showAgeTable) {
            Cmain.insertBefore(Tage, Cmain.firstChild);
        }

        // добавляем на страничку пустую таблицу для общих результатов
        var Tsummary = document.createElement('table');
        Tsummary.id = 'scriptTsummary';
        Tsummary.className = 'summaryTable';
        var Thead = document.createElement('thead');
        Thead.innerHTML = '<tr>\
                               <th style="font-size: 14pt;">' + L10n[LANG].summaryTable.mainTitle + '</th>\
                               <th class="sexMF" title="' + L10n[LANG].sex.all + '">\
                                   <img src="' + IMG.m + '">+<img src="' + IMG.f + '">\
                               </th>\
                               <th colspan="2" class="sexMF" title="' + L10n[LANG].sex.men + '"><img src="' + IMG.m + '"></th>\
                               <th colspan="2" class="sexMF" title="' + L10n[LANG].sex.women + '"><img src="' + IMG.f + '"></th>\
                           </tr>';
        Tsummary.appendChild(Thead);
        var Tbody = document.createElement('tbody');
        Tsummary.appendChild(Tbody);
        for (i = 0; i < 10; i++) {
            var tr = document.createElement('tr');
            tr.id = 'summary' + (1 + i);
            if (i < 3) {
                for (var j = 0; j < 6; j++) {
                    var td = document.createElement('td');
                    tr.appendChild(td);
                }
            } else {
                for (j = 0; j < 4; j++) {
                    td = document.createElement('td');
                    if (j > 1) {
                        td.colSpan = 2;
                    }
                    tr.appendChild(td);
                }
            }
            Tbody.appendChild(tr);
        }
        Cmain.insertBefore(Tsummary, Cmain.firstChild);

        // заполняем таблицу с общими результатами

        // лучшие по времени
        var nodes = document.getElementById('summary1').getElementsByTagName('td');
        nodes[0].innerHTML = L10n[LANG].summaryTable.fastest;
        if (time2sec(DB.fastest.m.time) < time2sec(DB.fastest.f.time)) {
            nodes[1].innerHTML = DB.fastest.m.time;
            nodes[1].title = DB.fastest.m.name;
        } else {
            nodes[1].innerHTML = DB.fastest.f.time;
            nodes[1].title = DB.fastest.f.name;
        }
        nodes[2].innerHTML = DB.fastest.m.time;
        nodes[3].innerHTML = DB.fastest.m.name;
        nodes[4].innerHTML = DB.fastest.f.time;
        nodes[5].innerHTML = DB.fastest.f.name;

        // лучшие по возрастному рейтингу
        nodes = document.getElementById('summary2').getElementsByTagName('td');
        nodes[0].innerHTML = L10n[LANG].summaryTable.ageRate;
        if (DB.ageRate.m.rate > DB.ageRate.f.rate) {
            nodes[1].innerHTML = DB.ageRate.m.rate + ' %';
            nodes[1].title = DB.ageRate.m.name;
        } else {
            nodes[1].innerHTML = DB.ageRate.f.rate + ' %';
            nodes[1].title = DB.ageRate.f.name;
        }
        nodes[2].innerHTML = DB.ageRate.m.rate + ' %';
        nodes[3].innerHTML = DB.ageRate.m.name;
        nodes[4].innerHTML = DB.ageRate.f.rate + ' %';
        nodes[5].innerHTML = DB.ageRate.f.name;

        // лучшие максимальному количеству забегов
        nodes = document.getElementById('summary3').getElementsByTagName('td');
        nodes[0].innerHTML = L10n[LANG].summaryTable.maxRaces;
        if (DB.maxRaces.m.races > DB.maxRaces.f.races) {
            nodes[1].innerHTML = DB.maxRaces.m.races;
            nodes[1].title = DB.maxRaces.m.name;
        } else {
            nodes[1].innerHTML = DB.maxRaces.f.races;
            nodes[1].title = DB.maxRaces.f.name;
        }
        nodes[2].innerHTML = DB.maxRaces.m.races;
        nodes[3].innerHTML = DB.maxRaces.m.name;
        nodes[4].innerHTML = DB.maxRaces.f.races;
        nodes[5].innerHTML = DB.maxRaces.f.name;

        // количество участников забега
        nodes = document.getElementById('summary4').getElementsByTagName('td');
        nodes[0].innerHTML = L10n[LANG].summaryTable.number;
        var notscan = '';
        if (DB.number.u > 0) {
            notscan = '<span title="' + L10n[LANG].summaryTable.unknownTooltip + '"> (' + L10n[LANG].summaryTable.unknown + ': ' + DB.number.u + ')</span>';
        }
        nodes[1].innerHTML = DB.number.all + notscan;
        nodes[2].innerHTML = DB.number.m;
        nodes[3].innerHTML = DB.number.f;

        // личные рекорды
        nodes = document.getElementById('summary5').getElementsByTagName('td');
        nodes[0].innerHTML = L10n[LANG].summaryTable.personalBest + names2p(DB.personalBest.all.names);
        nodes[1].innerHTML = DB.personalBest.all.number;
        nodes[2].innerHTML = DB.personalBest.m.number + names2p(DB.personalBest.m.names);
        nodes[3].innerHTML = DB.personalBest.f.number + names2p(DB.personalBest.f.names);

        // впервые на паркране вообще
        nodes = document.getElementById('summary6').getElementsByTagName('td');
        if (latestPage) {
            nodes[0].innerHTML = L10n[LANG].summaryTable.firstRun + names2p(DB.firstRun.all.allNames);
            nodes[1].innerHTML = DB.firstRun.all.all;
            nodes[2].innerHTML = DB.firstRun.m.all + names2p(DB.firstRun.m.allNames);
            nodes[3].innerHTML = DB.firstRun.f.all + names2p(DB.firstRun.f.allNames);
        } else {
            nodes[0].innerHTML = L10n[LANG].summaryTable.firstRun + '<p style="width: 280px;">' + L10n[LANG].summaryTable.firstRunTooltip + '</p>';
            nodes[1].innerHTML = '?';
            nodes[2].innerHTML = '?';
            nodes[3].innerHTML = '?';
            nodes[1].title = L10n[LANG].summaryTable.firstRunTooltip;
            nodes[2].title = L10n[LANG].summaryTable.firstRunTooltip;
            nodes[3].title = L10n[LANG].summaryTable.firstRunTooltip;
        }

        // впервые на этом паркране
        nodes = document.getElementById('summary7').getElementsByTagName('td');
        nodes[0].innerHTML = L10n[LANG].summaryTable.firstHome + names2p(DB.firstRun.all.homeNames);
        nodes[1].innerHTML = DB.firstRun.all.home;
        nodes[2].innerHTML = DB.firstRun.m.home + names2p(DB.firstRun.m.homeNames);
        nodes[3].innerHTML = DB.firstRun.f.home + names2p(DB.firstRun.f.homeNames);

        // средний возраст
        nodes = document.getElementById('summary8').getElementsByTagName('td');
        document.getElementById('summary8').title = L10n[LANG].summaryTable.ageAVGTooltip;
        nodes[0].innerHTML = L10n[LANG].summaryTable.ageAVG;
        nodes[1].innerHTML = ((DB.ageAVG.m + DB.ageAVG.f)/(DB.number.m + DB.number.f - DB.number.WC.all)).toFixed();
        nodes[2].innerHTML = (DB.ageAVG.m/(DB.number.m - DB.number.WC.m)).toFixed();
        nodes[3].innerHTML = (DB.ageAVG.f/(DB.number.f - DB.number.WC.f)).toFixed();

        // юбилейные забеги
        nodes = document.getElementById('summary9').getElementsByTagName('td');
        if (latestPage) {
            nodes[0].innerHTML = L10n[LANG].summaryTable.jubilee + '' + names2p(DB.jubilee.all.names);
        } else {
            nodes[0].innerHTML = L10n[LANG].summaryTable.jubilee + '*' + names2p(DB.jubilee.all.names);
            nodes[0].title = L10n[LANG].summaryTable.jubileeTooltip;
        }
        nodes[1].innerHTML = DB.jubilee.all.number;
        nodes[2].innerHTML = DB.jubilee.m.number + names2p(DB.jubilee.m.names);
        nodes[3].innerHTML = DB.jubilee.f.number + names2p(DB.jubilee.f.names);

        // скоро юбилейные забеги
        nodes = document.getElementById('summary10').getElementsByTagName('td');
        if (latestPage) {
            nodes[0].innerHTML = L10n[LANG].summaryTable.jubileeNext + '' + names2p(DB.jubilee.next.all.names);
        } else {
            nodes[0].innerHTML = L10n[LANG].summaryTable.jubileeNext + '*' + names2p(DB.jubilee.next.all.names);
            nodes[0].title = L10n[LANG].summaryTable.jubileeTooltip;
        }
        nodes[1].innerHTML = DB.jubilee.next.all.number;
        nodes[2].innerHTML = DB.jubilee.next.m.number + names2p(DB.jubilee.next.m.names);
        nodes[3].innerHTML = DB.jubilee.next.f.number + names2p(DB.jubilee.next.f.names);
        if (lsprefs.jubileeMax == 0) {
            document.getElementById('summary10').style.display = 'none';
        }
    }

    // проверка, находимся ли мы на страничке результатов
    function isResultsPage() {
        var url = String(window.location);
        if (!~url.indexOf('runSeqNumber')) {
            latestPage = true;
        }
        if (~url.indexOf('-juniors/results/')) {
            juniorsPage = true;
        }
        return ~url.indexOf('parkrun.') && ((~url.indexOf('/latestresults') || ~url.indexOf('/ostatnierezultaty') || ~url.indexOf('/weeklyresults')));
    }

    // переводим запись времени в секунды
    function time2sec(str) {
        var Atime = str.split(':');
        for (var i = 0; i < Atime.length; i++) {
            Atime[i] = parseInt(Atime[i].replace(/^0/, ''));
        }
        if (Atime.length == 2) {
            Atime.unshift(0);
        }
        return 3600*Atime[0] + 60*Atime[1] + Atime[2];
    }

    // функция сравнения для сортировки впервые пробежавших
    function compareFirst(obj1, obj2) {
        if (obj1.hasOwnProperty('races')) {
            return compareObjects(obj2, obj1, 'races');
        } else {
            return compareObjects(obj1, obj2, 'name');
        }
    }

    // функция сравнения для сортировки объектов по количеству забегов
    function compareByRaces(obj1, obj2) {
        return compareObjects(obj2, obj1, 'races');
    }

    // функция сравнения для сортировки объектов по имени
    function compareByName(obj1, obj2) {
        return compareObjects(obj1, obj2, 'name');
    }

    // функция сравнения для сортировки объектов по заданному свойству
    function compareObjects(obj1, obj2, property) {
        property = property || 'name';
        if (obj1[property] > obj2[property]) {
            return 1;
        } else {
            return -1;
        }
    }

    // создаем строку имен из массива объектов
    function homeNames2str(Names) {
        var str = '';
        var split = ', ';
        for (var i = 0; i < Names.length; i++) {
            if (i == Names.length - 1) {
                split = '';
            }
            if (Names[i].hasOwnProperty('races')) {
                str += Names[i].name + ' (' + Names[i].races + ')' + split;
            } else {
                str += Names[i].name + split;
            }
        }
        return str;
    }

    // создаем строку имен из массива объектов
    function names2p(Names, key) {
        key = key || '';
        var str = '';
        if (Names.length > 0) {
            if (key == 'time' || (key == '' && Names[0].hasOwnProperty('time'))) {
                for (var i = 0; i < Names.length; i++) {
                    if (Names[i].hasOwnProperty('sex')) {
                        str += '<p>' + Names[i].time + ' - ' + L10n[LANG].sex[Names[i].sex] + ' - ' + Names[i].name + '</p>';
                    } else {
                        str += '<p>' + Names[i].time + ' - ' + Names[i].name + '</p>';
                    }
                }
            } else if (key == 'races' || (key == '' && Names[0].hasOwnProperty('races'))) {
                str = '<p>' + L10n[LANG].summaryTable.firstHomeNote + '</p>';
                for (i = 0; i < Names.length; i++) {
                    str += '<p>' + Names[i].name + ' (' + Names[i].races + ')' + '</p>';
                }
            } else if (Names[0].hasOwnProperty('name')) {
                for (i = 0; i < Names.length; i++) {
                    str += '<p>' + Names[i].name + '</p>';
                }
            }
        }
        return str;
    }

    // добавляем отсутствующие поля в объект
    function extendObjects(target, source) {
        if (!(target instanceof Object)) {
            target = {};
        }
        if (source instanceof Object) {
            for (var i in source) {
                target[i] = source[i] instanceof Object ? extendObjects(target[i], source[i]) : i in target ? target[i] : source[i];
            }
        }
        return target;
    }

    // проверяем, является ли забег юбилейным
    function isJubileeNow(races) {
        if (races % 50 == 0
            || (juniorsPage && (races == 11 || races == 21))
        ) {
            return true;
        } else {
            return false;
        }
    }

    // проверяем, что скоро будет юбилейный забег
    function isJubileeSoon(races) {
        if (races % 50 >= 50 - lsprefs.jubileeMax
            || (juniorsPage && races < 21 && (races % 11 >= 11 - lsprefs.jubileeMax || races % 21 >= 21 - lsprefs.jubileeMax))
        ) {
            return true;
        } else {
            return false;
        }
    }

    // добавляем на страницу блок настроек скрипта
    function addMainOptionsSelector() {
        // блок с основными настройками
        var div = document.createElement('div');
        div.id = 'scriptPrefsMain';
        div.className = 'scriptPrefsMain';

        // иконка расширения
        var extIco = document.createElement('img');
        extIco.className = 'extIco';
        extIco.title = 'parkrun Extended Info';
        extIco.src = IMG.extIco48;
        div.appendChild(extIco);

        // заголовок
        var header = document.createElement('div');
        header.className = 'headerPrefs';
        header.innerHTML = 'parkrun Extended Info';
        header.title = L10n[LANG].scriptSettings.headerTooltip;
        div.appendChild(header);

        // выбор языка
        var selLang = document.createElement('div');
        selLang.className = 'selLang';

        // добавляем флажки языков
        for (var lang in L10n) {
            var flag = document.createElement('img');
            flag.id = 'optionFlag_' + lang;
            flag.title = L10n[lang].nativeLanguageTitle;
            flag.src = IMG[lang];
            if (lang == LANG) {
                flag.className = 'currentFlag';
            } else {
                flag.className = 'optionFlag';
                // при клике по флажку меняем язык и перезагружаем элементы
                flag.onclick = function() {
                    this.className = 'currentFlag';
                    document.getElementById('optionFlag_' + LANG).className = 'optionFlag';
                    LANG = this.id.slice(this.id.indexOf('_') + 1);
                    lsprefs.LANG = LANG;
                    chrome.storage.local.set({parkrunExtendedInfo: lsprefs}, function() {
                        if (document.getElementById('scriptPrefs') != null) {
                            addOptionsSelector();
                        }
                        if (document.getElementById('scriptPrefsIcoDiv') != null) {
                            document.getElementById('scriptPrefsIcoDiv').title = L10n[LANG].scriptSettings.headerTooltip;
                        }
                        main();
                    });
                };
            }
            selLang.appendChild(flag);
        }

        // добавляем блок на страничку
        div.appendChild(selLang);
        var node = document.getElementById('mainheader');
        node.insertBefore(div, node.firstChild);

        // иконка настроек
        if (document.getElementById('scriptPrefsIcoDiv') == null) {
            var div = document.createElement('div');
            div.id = 'scriptPrefsIcoDiv';
            div.className = 'scriptPrefsIcoDiv';
            div.title = L10n[LANG].scriptSettings.headerTooltip;
            div.onclick = function() {
                if (this.style.filter == 'none') {
                    this.style.filter = 'grayscale(100%)';
                    this.style.backgroundSize = '32px';
                    document.getElementById('scriptPrefs').remove();
                } else {
                    this.style.filter = 'none';
                    this.style.backgroundSize = '36px';
                    if (document.getElementById('scriptPrefs') == null) {
                        addOptionsSelector();
                    }
                }
            };
            // добавляем блок на страничку
            node.insertBefore(div, node.firstChild);
        }
    }

    // добавляем на страницу раскрывающийся блок настроек скрипта
    function addOptionsSelector() {
        // Удаляем блок, если он уже есть
        if (document.getElementById('scriptPrefs') != null) {
            document.getElementById('scriptPrefs').remove();
        }

        // блок с дополнительными настройками
        var div = document.createElement('div');
        div.id = 'scriptPrefs';
        div.className = 'scriptPrefs';
        // прячем блок, если мышь покинула его
        div.onmouseleave = function() {
            document.getElementById('scriptPrefsIcoDiv').style.filter = 'grayscale(100%)';
            document.getElementById('scriptPrefsIcoDiv').style.backgroundSize = '32px';
            this.remove();
        };

        // заголовок выбора максимального лимита количества забегов, оставшихся до юбилея
        var pJubilee = document.createElement('div');
        pJubilee.id = 'pJubilee';
        pJubilee.innerHTML = L10n[LANG].scriptSettings.jubileeMax.title;
        div.appendChild(pJubilee);

        // добавляем выбор максимального лимита количества забегов, оставшихся до юбилея
        var selJubilee = document.createElement('select');
        selJubilee.id = 'selJubilee';
        selJubilee.className = 'selJubilee';
        for (var i = 0; i <= 5; i++) {
            var option = document.createElement('option');
            option.innerHTML = L10n[LANG].scriptSettings.jubileeMax[i];
            option.value = i;
            if (i == lsprefs.jubileeMax) {
                option.selected = 'selected';
            } else {
                option.style.color = 'rgb(0, 0, 0)';
                option.style.fontWeight = 'normal';
            }
            selJubilee.appendChild(option);
        }
        selJubilee.onchange = function () {
            var Aopt = this.getElementsByTagName('option');
            for (i = 0; i < Aopt.length; i++) {
                if (this.value == Aopt[i].value) {
                    if (Aopt[i].style.color == 'rgb(0, 0, 0)') {
                        Aopt[i].selected = 'selected';
                        lsprefs.jubileeMax = this.value;
                        chrome.storage.local.set({parkrunExtendedInfo: lsprefs}, function() {
                            main();
                        });
                    }
                } else {
                    Aopt[i].style.color = 'rgb(0, 0, 0)';
                    Aopt[i].style.fontWeight = 'normal';
                }
            }
        }
        div.appendChild(selJubilee);

        // добавляем чекбокс отображения таблицы с результатами по возрастным группам
        var checkAgeTableDiv = document.createElement('div');
        checkAgeTableDiv.id = 'checkAgeTableDiv';
        var checkAgeTableInput = document.createElement('input');
        checkAgeTableInput.id = 'checkAgeTableInput';
        checkAgeTableInput.type = 'checkbox';
        checkAgeTableInput.checked = lsprefs.showAgeTable;
        checkAgeTableInput.onchange = function () {
            lsprefs.showAgeTable = this.checked;
            chrome.storage.local.set({parkrunExtendedInfo: lsprefs}, function() {
                main();
            });
        }
        checkAgeTableDiv.appendChild(checkAgeTableInput);
        var checkAgeTableLabel = document.createElement('label');
        checkAgeTableLabel.htmlFor = 'checkAgeTableInput';
        checkAgeTableLabel.innerHTML = L10n[LANG].scriptSettings.showAgeTable;
        checkAgeTableDiv.appendChild(checkAgeTableLabel);
        div.appendChild(checkAgeTableDiv);


        // добавляем чекбокс показа раскрывающихся списков
        var checkHoverStyleDiv = document.createElement('div');
        checkHoverStyleDiv.id = 'checkHoverStyleDiv';
        var checkHoverStyleInput = document.createElement('input');
        checkHoverStyleInput.id = 'checkHoverStyleInput';
        checkHoverStyleInput.type = 'checkbox';
        checkHoverStyleInput.checked = lsprefs.showHoverStyle;
        checkHoverStyleInput.onchange = function () {
            lsprefs.showHoverStyle = this.checked;
            chrome.storage.local.set({parkrunExtendedInfo: lsprefs}, function() {
                main();
            });
        }
        checkHoverStyleDiv.appendChild(checkHoverStyleInput);
        var checkHoverStyleLabel = document.createElement('label');
        checkHoverStyleLabel.htmlFor = 'checkHoverStyleInput';
        checkHoverStyleLabel.innerHTML = L10n[LANG].scriptSettings.showHoverStyle;
        checkHoverStyleDiv.appendChild(checkHoverStyleLabel);
        div.appendChild(checkHoverStyleDiv);

        // добавляем блок на страницу
        var node = document.getElementById('mainheader');
        node.insertBefore(div, node.firstChild);

        document.getElementById('pJubilee').style.width = document.getElementById('pJubilee').style.left;
    }
})();