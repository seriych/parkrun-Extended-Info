(function() {
    'use strict';

    var latestPage = false,
        juniorsPage = false,
        historyPage = false,
        athleteResultsLocalPage = false,
        athleteResultsAllPage = false;

    // Выполняем обработку, если мы на нужной странице
    if (isResultsPage()) {

        // настройки по умолчанию
        var LANG = 'en',
            jubileeMax = 2,
            showAgeTable = true,
            showHoverStyle = true,
            defaultPrefs = {
                LANG: LANG,
                jubileeMax: jubileeMax,
                showAgeTable: showAgeTable,
                showHoverStyle: showHoverStyle
            };
        var COLORS = {
                count: '145, 238, 145',
                man:   '160, 208, 250',
                woman: '255, 195, 255'
            },
            DB = {},
            lsprefs = {},
            IMG = {
                extIco48: chrome.runtime.getURL('images/icon48.png'),
                prefsIco36: chrome.runtime.getURL('images/config36.png'),
                m: chrome.runtime.getURL('images/man36.png'),
                f: chrome.runtime.getURL('images/woman36.png')
            };
        for (let lang in L10n) {
            IMG[lang] = chrome.runtime.getURL('images/flags/' + lang + '.png');
        }

        // Читаем настройки из кэша
        chrome.storage.local.get(['parkrunExtendedInfo'], function(result) {
            if (result.parkrunExtendedInfo !== undefined) {
                lsprefs = result.parkrunExtendedInfo;
                console.log(lsprefs);
                if (lsprefs.LANG !== undefined && L10n.hasOwnProperty(lsprefs.LANG)) {
                    LANG = lsprefs.LANG;
                }
            }
            extendObjects(lsprefs, defaultPrefs);

            // запускаем обработку страницы
            if (historyPage) {
                // история забегов
                extendEventHistory();
            } else if (athleteResultsAllPage) {
                // результаты бегуна на всех паркранах
                extendAthleteAll();
            } else if (athleteResultsLocalPage) {
                // результаты бегуна на текущем паркране
                extendAthleteLocal();
            } else {
                // результаты забега
                main();
            }
        });
    } else {
        return;
    }

    // Основное тело скрипта
    function main() {
        // добавляем непереведенные фразы из основных языков
        if (LANG !== 'ru') {
            extendObjects(L10n.en, L10n.ru);
            if (LANG !=='en') {
                extendObjects(L10n[LANG], L10n.en);
            }
        }

        // заменяем пробелы на неразрывные для выравнивания колонок
        L10n[LANG].sex.m = L10n[LANG].sex.m.replace(/\s/g, '&nbsp;');
        L10n[LANG].sex.f = L10n[LANG].sex.f.replace(/\s/g, '&nbsp;');

        // удаляем добавленные скриптом элементы
        for (let id of ['scriptPrefsMain', 'scriptTage', 'scriptTsummary', 'main_header']) {
            if (document.getElementById(id) !== null) {
                document.getElementById(id).remove();
            }
        }

        // добавляем на страницу блок настроек скрипта
        addMainOptionsSelector();

        let note = { // ru             en              pl           it              de             dk              fr                  jp           sw
            pb:    ["Личный рекорд!", "New PB!",      "Nowe PB!",  "Nuovo PB!",    "Neue PB!",    "Ny PB!",       "Meilleure Perf'!", "自己ベスト!", "Nytt PB!"],
            first: ["Первый забег!",  "First Timer!", "Debiutant", "Prima volta!", "Erstläufer!", "Første gang!", "Première Perf'!",  "初参加!",   "Debut!"]
        };

        let Cmain = document.getElementById('main'),
            Tresults = document.getElementById('results'),
            Atr = Tresults.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

        if (document.getElementById('scriptStyles') !== null) {
            document.getElementById('scriptStyles').remove();
        }
        let trHoverStyle = 'display: block;';
        if (!lsprefs.showHoverStyle) {
            trHoverStyle = 'display: none;';
        }
        if (document.getElementById('scriptStyles') === null) {
            let style = document.createElement('style');
            style.id = 'scriptStyles';
            style.innerHTML = '\
                .ageTable, .summaryTable {font-family: sans-serif, Arial; text-align: center; border: 2px solid #c7dbe3; border-collapse: collapse; background: #f5fafc; margin: 30px 5px 20px; font-size: 11pt; width: 100%;} \
                .ageTable thead th, .summaryTable thead th {font-weight: normal; font-size: 14pt; background: #e5f3fc;} \
                .ageTable td, .summaryTable td, .ageTable th, .summaryTable th {border: 1px solid #c7dbe3;} \
                .ageTable td, .summaryTable td {padding: 5px;} \
                .ageTable th, .summaryTable th {padding: 5px 0px; vertical-align: middle;} \
                .ageTable th:nth-child(1), .summaryTable th:nth-child(1) {font-weight: bold; text-align: left; font-size: 12pt; padding: 0px 10px;} \
                .ageTable th:nth-child(2) {width: 90px;} \
                .summaryTable td:nth-child(1) {padding-left: 10px; text-align: left; font-weight: bold;} \
                .summaryTable tr:nth-child(1) td:not(:nth-child(2)), .summaryTable tr:nth-child(2) td:not(:nth-child(2)), .summaryTable tr:nth-child(3) td:not(:nth-child(2)) \
                    {padding-left: 10px; text-align: left;} \
                .ageTable td:nth-child(3), .ageTable td:nth-child(5), .ageTable td:nth-child(6), .ageTable td:nth-child(8) {width: 50px;} \
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
                .scriptPrefsMain {font-family: sans-serif, Arial; position: absolute; right: 50px; top: 5px; width: 190px; z-index: 4; align: left; text-align: left;}\
                .headerPrefs {font-size: 10pt; text-align: left; color: white; text-shadow: #222222 -1px -1px 1px, #222222 -1px 1px 1px, #222222 1px -1px 1px, #222222 1px 1px 1px;}\
                .selLang {margin: 5px auto 0px; text-align: left;}\
                .extIco {float: left; margin-right: 2px;}\
                .optionFlag {padding: 3px 4px;}\
                .optionFlag:hover {padding: 1px 2px; border: 2px dashed #DDDDDD; cursor: pointer;}\
                .currentFlag {vertical-align: top; padding: 1px 2px; border: 2px inset #DDDDDD;}\
                .scriptPrefs {font-size: 10pt; font-family: sans-serif, Arial; background: rgba(140, 155, 100, 0.9); position: absolute; right: 285px; top: 0px; padding: 2px 10px; width: auto; height: 160px; z-index: 4; text-align: left;}\
                .scriptPrefs div {border-top: 1px dashed #AACCBB; vertical-align: middle; color: white; text-shadow: #333333 -1px -1px 1px, #333333 -1px 1px 1px, #333333 1px -1px 1px, #333333 1px 1px 1px; margin-top: 3px; padding-top: 2px;}\
                .scriptPrefs div input {vertical-align: middle; margin-right: 5px;}\
                .scriptPrefsIcoDiv {filter: grayscale(100%); position: absolute; right: 245px; top: 5px; width: 36px; height: 48px; z-index: 4; background: url("' + IMG.prefsIco36 + '") no-repeat center center; background-size: 32px;}\
                .scriptPrefsIcoDiv:hover {filter: none !important; cursor: pointer; background-size: 36px !important;}\
                .selJubilee {margin-top: 2px;}\
                .selJubilee option {color: rgb(0, 0, 0); font-weight: normal;}\
                .selJubilee option:checked {color: rgb(0, 144, 255) !important; font-weight: bold !important;}\
            ';
            Cmain.appendChild(style);
        }

        // база для хранения собранной информации
        DB = {
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
        };

        // перебираем всех участников забега и собираем информацию
        for (let i = 0; i < Atr.length; i++) {
            let Atd = Atr[i].getElementsByTagName('td'),
                indexes = {name: 0, time: 1, age: 2, rate: 3, sex: 4, persbest: 6, races: 7};
            if (Atd.length > 10) {
                indexes = {name: 1, time: 2, age: 3, rate: 4, sex: 5, persbest: 8, races: 9};
            }
            let time = Atd[indexes.time].innerHTML;
            if (time === '') {
                DB.number.u += 1;
            } else {
                let name = Atd[indexes.name].getElementsByTagName('a')[0].innerHTML;
                name = name.split(/(\s|\-)+/).map(word => word[0].toUpperCase() + word.substring(1).toLowerCase()).join(' ').replace(/\s*\-\s*/g, '-');
                let rate = parseFloat(Atd[indexes.rate].innerHTML),
                    sex = Atd[indexes.sex].innerHTML.toLowerCase();
                if (sex === 'f') {
                    Atd[indexes.sex].style.backgroundColor = '#FFE0FF';
                    Atd[indexes.name].style.backgroundColor = '#FFE0FF';
                }
                let age = Atd[indexes.age].getElementsByTagName('a')[0].innerHTML.replace(/^[^0-9\-]*/, '');
                if (age.length < 1) {
                    age = 'WC';
                }
                if (!DB.ageNumber.hasOwnProperty(age)) {
                    DB.ageNumber[age] = {all: {names: []}, m: {number: 0, time: '', name: '', names: []}, f: {number: 0, time: '', name: '', names: []}};
                }
                DB.ageNumber[age][sex].number += 1;
                DB.ageNumber[age][sex].names.push({time: time, name: name});
                DB.ageNumber[age].all.names.push({time: time, name: name, sex: sex});
                if (DB.ageNumber[age][sex].time === '' || time2sec(time) < time2sec(DB.ageNumber[age][sex].time)) {
                    DB.ageNumber[age][sex].time = time;
                    DB.ageNumber[age][sex].name = name;
                }
                let persbest = Atd[indexes.persbest].innerHTML,
                    races = parseInt(Atd[indexes.races].innerHTML);
                if (races === 1) {
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
                    if (races !== 1) {
                        DB.firstRun[sex].home += 1;
                        DB.firstRun[sex].homeNames.push({name: name, races: races});
                    }
                } else if (~note.pb.indexOf(persbest)) {
                    DB.personalBest[sex].number += 1;
                    DB.personalBest[sex].names.push({name: name, time: time});
                }
                DB.number[sex] += 1;
                if (DB.fastest[sex].time === 0 || time2sec(time) < time2sec(DB.fastest[sex].time)) {
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
        for (let sex of ['m', 'f']) {
            for (let key of ['allNames', 'homeNames']) {
                for (let i = 0; i < DB.firstRun[sex][key].length; i++) {
                    DB.firstRun.all[key].push(DB.firstRun[sex][key][i]);
                }
                DB.firstRun[sex][key].sort(compareFirst);
            }
            for (let i = 0; i < DB.personalBest[sex].names.length; i++) {
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
        let Tage = document.createElement('table');
        Tage.id = 'scriptTage';
        Tage.className = 'ageTable';
        let Tagehead = document.createElement('thead');
        Tagehead.innerHTML = '<tr>\
                                  <th style="width: 220px;">' + L10n[LANG].ageTable.mainTitle + '</th>\
                                  <th class="sexMF" title="' + L10n[LANG].sex.all + '">\
                                      <img src="' + IMG.m + '"><span>+</span><img src="' + IMG.f + '">\
                                  </th>\
                                  <th colspan="3" class="sexMF" title="' + L10n[LANG].sex.men + '"><img src="' + IMG.m + '"></th>\
                                  <th colspan="3" class="sexMF" title="' + L10n[LANG].sex.women + '"><img src="' + IMG.f + '"></th>\
                              </tr>';
        Tage.appendChild(Tagehead);
        let Tagebody = document.createElement('tbody');
        Tage.appendChild(Tagebody);
        let Aage = Object.keys(DB.ageNumber).sort();
        for (let i = 0; i < Aage.length; i++) {
            let agetr = document.createElement('tr'),
                ageGR = Aage[i],
                GRname = ageGR,
                mnumber = DB.ageNumber[ageGR].m.number,
                fnumber = DB.ageNumber[ageGR].f.number,
                allnumber = mnumber + fnumber;
            if (ageGR !== 'WC' && ageGR !== '---') {
                let ageAVG = ageGR.split('-');
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
                '<td>' + DB.ageNumber[ageGR].m.time + '</td>' +
                '<td>' + DB.ageNumber[ageGR].m.name + names2p(DB.ageNumber[ageGR].m.names) + '</td>' +
                '<td>' + mnumber + '</td>' +
                '<td>' + fnumber + '</td>' +
                '<td>' + DB.ageNumber[ageGR].f.name + names2p(DB.ageNumber[ageGR].f.names) + '</td>' +
                '<td>' + DB.ageNumber[ageGR].f.time + '</td>';
            Tagebody.appendChild(agetr);
        }
        if (lsprefs.showAgeTable) {
            Cmain.insertBefore(Tage, Cmain.firstChild);
        }

        // добавляем на страничку пустую таблицу для общих результатов
        let Tsummary = document.createElement('table');
        Tsummary.id = 'scriptTsummary';
        Tsummary.className = 'summaryTable';
        let Thead = document.createElement('thead');
        Thead.innerHTML = '<tr>\
                               <th style="font-size: 14pt;">' + L10n[LANG].summaryTable.mainTitle + '</th>\
                               <th class="sexMF" title="' + L10n[LANG].sex.all + '">\
                                   <img src="' + IMG.m + '">+<img src="' + IMG.f + '">\
                               </th>\
                               <th colspan="2" class="sexMF" title="' + L10n[LANG].sex.men + '"><img src="' + IMG.m + '"></th>\
                               <th colspan="2" class="sexMF" title="' + L10n[LANG].sex.women + '"><img src="' + IMG.f + '"></th>\
                           </tr>';
        Tsummary.appendChild(Thead);
        let Tbody = document.createElement('tbody');
        Tsummary.appendChild(Tbody);
        for (let i = 0; i < 10; i++) {
            let tr = document.createElement('tr');
            tr.id = 'summary' + (1 + i);
            if (i < 3) {
                for (let j = 0; j < 6; j++) {
                    tr.appendChild(document.createElement('td'));
                }
            } else {
                for (let j = 0; j < 4; j++) {
                    let td = document.createElement('td');
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
        let nodes = document.getElementById('summary1').getElementsByTagName('td');
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
        let notscan = '';
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
        if (lsprefs.jubileeMax === 0) {
            document.getElementById('summary10').style.display = 'none';
        }

        // Клонируем заголовок таблицы результатов
        let Ccontent = document.getElementById('content'),
            main_header = Ccontent.getElementsByTagName('h2')[0].cloneNode(true);
        main_header.style.marginTop = '-10px';
        main_header.id = 'main_header';
        Cmain.insertBefore(main_header, Cmain.firstChild);

        // Добавляем гистограммы
        addHistogram(Tagebody, 1);
        addHistogram(Tagebody, 4, false, COLORS.man, true);
        addHistogram(Tagebody, 5, false, COLORS.woman);
        addHistogram(Tagebody, 2, true, COLORS.man);
        addHistogram(Tagebody, 7, true, COLORS.woman);
        //addHistogram(Tresults.getElementsByTagName('tbody')[0], 4);
        //addHistogram(Tresults.getElementsByTagName('tbody')[0], 9);
    }


    // Обрабатываем страницу истории забегов
    function extendEventHistory() {
        let TBresults = document.getElementById('results').getElementsByTagName('tbody')[0];
        addHistogram(TBresults, 2);
        addHistogram(TBresults, 6, true, COLORS.man);
        addHistogram(TBresults, 9, true, COLORS.woman);
    }

    // Обрабатываем страницу результатов бегуна на всех паркранах
    function extendAthleteAll() {
        let TBresults = document.getElementsByClassName('sortable')[0].getElementsByTagName('tbody')[0];
        addHistogram(TBresults, 4, true);
        addHistogram(TBresults, 5);
        TBresults = document.getElementsByClassName('sortable')[1].getElementsByTagName('tbody')[0];
        addHistogram(TBresults, 1);
        addHistogram(TBresults, 4, true);
    }

    // Обрабатываем страницу результатов бегуна на текущем паркране
    function extendAthleteLocal() {
        let TBresults = document.getElementsByClassName('sortable')[0].getElementsByTagName('tbody')[0];
        addHistogram(TBresults, 1, true);
        addHistogram(TBresults, 2);
        TBresults = document.getElementsByClassName('sortable')[1].getElementsByTagName('tbody')[0];
        addHistogram(TBresults, 3, true);
        addHistogram(TBresults, 4);
    }

    // добавляем гистограмму в колонку таблицы
    function addHistogram(parent_node, col_num = 0, is_speed = false, color = COLORS.count, is_to_left = false) {
        let direction = "to right";
        if (is_to_left) {
            direction = "to left";
        }
        let Atr = parent_node.getElementsByTagName('tr');

        // читаем содержимое ячеек в массив
        let value_max = 0,
            value_min = 100000,
            Avalue = [];
        for (let i = 0; i < Atr.length; i++) {
            let td = Atr[i].getElementsByTagName('td')[col_num],
                value = td.innerText;
            if (is_speed) {
                value = time2sec(value);
            } else {
                value = parseFloat(td.innerText);
            }
            Avalue.push(value);

            if (value > value_max) {
                value_max = value;
            }
            if (value < value_min) {
                value_min = value;
            }
        }

        // отбрасываем слишком медленные забеги
        if ((Avalue.length > 5) && is_speed && historyPage && (value_min < 30*60)) {
            value_max = Math.min(value_max, 30*60);
        }

        // настройка линейности гистограмм
        let pow = 1;
        if (historyPage || is_speed) {
            pow = 0.75; // выглядит лучше, чем просто отношение (для забегов с большими выбросами, например, на юбилеях)
        }

        // нормируем масштаб гистограмм для обоих полов
        if (!is_speed && !historyPage && !athleteResultsLocalPage && !athleteResultsAllPage && col_num > 2) {
            for (let ageGR in DB.ageNumber) {
                value_max = Math.max(value_max, DB.ageNumber[ageGR].m.number, DB.ageNumber[ageGR].f.number);
            }
        }

        // рисуем гистограммы
        for (let i = 0; i < Atr.length; i++) {
            let td = Atr[i].getElementsByTagName('td')[col_num],
                transparent = 0.7,
                pct = 0;
            if ((historyPage || athleteResultsLocalPage || athleteResultsAllPage)
                && ((is_speed && Avalue[i] === value_min) || (!is_speed && Avalue[i] === value_max))) {
                transparent = 1;
                td.style.fontWeight = 'bold';
            }
            if (!is_speed) {
                if (col_num > 1 && (athleteResultsAllPage || athleteResultsLocalPage)) {
                    pct = 2 + 98 * (((Avalue[i] - value_min) / (value_max - value_min)) ** pow);
                } else {
                    pct = 100 * ((Avalue[i] / value_max) ** pow);
                }
            } else {
                pct = 2 + 98 * (((1/Avalue[i] - 1/value_max) / (1/value_min - 1/value_max)) ** (1/pow));
            }
            td.style.backgroundImage = 'linear-gradient(' + direction + ', rgba(' + color + ', ' + transparent + ') ' + pct + '%, transparent ' + pct + '%)';
        }
    }

    // проверка, находимся ли мы на страничке результатов
    function isResultsPage() {
        let url = String(window.location);
        if (!~url.indexOf('runSeqNumber')) {
            latestPage = true;
        }
        if (~url.indexOf('-juniors/results/')) {
            juniorsPage = true;
        }
        if (~url.indexOf('/eventhistory') || ~url.indexOf('/historiabiegu')) {
            historyPage = true;
        }
        if (~url.indexOf('/athletehistory')) {
            athleteResultsLocalPage = true;
        }
        if (~url.indexOf('/athleteresultshistory')) {
            athleteResultsAllPage = true;
        }
        return (~url.indexOf('parkrun.')
            && (
                ~url.indexOf('/latestresults') || ~url.indexOf('/ostatnierezultaty')
                || ~url.indexOf('/weeklyresults')
                || ~url.indexOf('/eventhistory') || ~url.indexOf('/historiabiegu')
                || ~url.indexOf('/athletehistory') || ~url.indexOf('/athleteresultshistory')
            )
        );
    }

    // переводим запись времени в секунды
    function time2sec(str) {
        let Atime = str.split(':').map(DD => parseInt(DD.replace(/^0/, '')));
        if (Atime.length === 2) {
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
    function compareObjects(obj1, obj2, property='name') {
        return obj1[property] > obj2[property];
    }

    // создаем строку имен из массива объектов
    function names2p(Names) {
        let str = '';
        if (Names.length > 0) {
            if (Names[0].hasOwnProperty('time')) {
                for (let i = 0; i < Names.length; i++) {
                    if (Names[i].hasOwnProperty('sex')) {
                        str += '<p>' + Names[i].time + ' - ' + L10n[LANG].sex[Names[i].sex] + ' - ' + Names[i].name + '</p>';
                    } else {
                        str += '<p>' + Names[i].time + ' - ' + Names[i].name + '</p>';
                    }
                }
            } else if (Names[0].hasOwnProperty('races')) {
                str = '<p>' + L10n[LANG].summaryTable.firstHomeNote + '</p>';
                for (let i = 0; i < Names.length; i++) {
                    str += '<p>' + Names[i].name + ' (' + Names[i].races + ')' + '</p>';
                }
            } else if (Names[0].hasOwnProperty('name')) {
                for (let i = 0; i < Names.length; i++) {
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
            for (let key in source) {
                target[key] = source[key] instanceof Object ? extendObjects(target[key], source[key]) : key in target ? target[key] : source[key];
            }
        }
        return target;
    }

    // проверяем, является ли забег юбилейным
    function isJubileeNow(races) {
        return (
            races % 50 === 0
            || (juniorsPage && (races === 11 || races === 21))
        );
    }

    // проверяем, что скоро будет юбилейный забег
    function isJubileeSoon(races) {
        return (
            races % 50 >= 50 - lsprefs.jubileeMax
            || (juniorsPage && races < 21 && (races % 11 >= 11 - lsprefs.jubileeMax || races % 21 >= 21 - lsprefs.jubileeMax))
        );
    }

    // добавляем на страницу блок настроек скрипта
    function addMainOptionsSelector() {
        // блок с основными настройками
        let div = document.createElement('div');
        div.id = 'scriptPrefsMain';
        div.className = 'scriptPrefsMain';

        // иконка расширения
        let extIco = document.createElement('img');
        extIco.className = 'extIco';
        extIco.title = 'parkrun Extended Info';
        extIco.src = IMG.extIco48;
        div.appendChild(extIco);

        // заголовок
        let header = document.createElement('div');
        header.className = 'headerPrefs';
        header.innerHTML = 'parkrun Extended Info';
        header.title = L10n[LANG].scriptSettings.headerTooltip;
        div.appendChild(header);

        // выбор языка
        let selLang = document.createElement('div');
        selLang.className = 'selLang';

        // добавляем флажки языков
        for (let lang in L10n) {
            let flag = document.createElement('img');
            flag.id = 'optionFlag_' + lang;
            flag.title = L10n[lang].nativeLanguageTitle;
            flag.src = IMG[lang];
            if (lang === LANG) {
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
        let node = document.getElementById('mainheader');
        node.insertBefore(div, node.firstChild);

        // иконка настроек
        if (document.getElementById('scriptPrefsIcoDiv') == null) {
            let div = document.createElement('div');
            div.id = 'scriptPrefsIcoDiv';
            div.className = 'scriptPrefsIcoDiv';
            div.title = L10n[LANG].scriptSettings.headerTooltip;
            div.onclick = function() {
                if (this.style.filter === 'none') {
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
        let div = document.createElement('div');
        div.id = 'scriptPrefs';
        div.className = 'scriptPrefs';
        // прячем блок, если мышь покинула его
        div.onmouseleave = function() {
            document.getElementById('scriptPrefsIcoDiv').style.filter = 'grayscale(100%)';
            document.getElementById('scriptPrefsIcoDiv').style.backgroundSize = '32px';
            this.remove();
        };

        // заголовок выбора максимального лимита количества забегов, оставшихся до юбилея
        let pJubilee = document.createElement('div');
        pJubilee.id = 'pJubilee';
        pJubilee.innerHTML = L10n[LANG].scriptSettings.jubileeMax.title;
        div.appendChild(pJubilee);

        // добавляем выбор максимального лимита количества забегов, оставшихся до юбилея
        let selJubilee = document.createElement('select');
        selJubilee.id = 'selJubilee';
        selJubilee.className = 'selJubilee';
        for (let i = 0; i <= 5; i++) {
            let option = document.createElement('option');
            option.innerHTML = L10n[LANG].scriptSettings.jubileeMax[i];
            option.value = i;
            if (i === +lsprefs.jubileeMax) {
                option.selected = 'selected';
            } else {
                option.style.color = 'rgb(0, 0, 0)';
                option.style.fontWeight = 'normal';
            }
            selJubilee.appendChild(option);
        }
        selJubilee.onchange = function() {
            let Aopt = this.getElementsByTagName('option');
            for (let i = 0; i < Aopt.length; i++) {
                if (this.value === Aopt[i].value) {
                    if (Aopt[i].style.color === 'rgb(0, 0, 0)') {
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
        };
        div.appendChild(selJubilee);

        // добавляем чекбокс отображения таблицы с результатами по возрастным группам
        let checkAgeTableDiv = document.createElement('div');
        checkAgeTableDiv.id = 'checkAgeTableDiv';
        let checkAgeTableInput = document.createElement('input');
        checkAgeTableInput.id = 'checkAgeTableInput';
        checkAgeTableInput.type = 'checkbox';
        checkAgeTableInput.checked = lsprefs.showAgeTable;
        checkAgeTableInput.onchange = function() {
            lsprefs.showAgeTable = this.checked;
            chrome.storage.local.set({parkrunExtendedInfo: lsprefs}, function() {
                main();
            });
        };
        checkAgeTableDiv.appendChild(checkAgeTableInput);
        let checkAgeTableLabel = document.createElement('label');
        checkAgeTableLabel.htmlFor = 'checkAgeTableInput';
        checkAgeTableLabel.innerHTML = L10n[LANG].scriptSettings.showAgeTable;
        checkAgeTableDiv.appendChild(checkAgeTableLabel);
        div.appendChild(checkAgeTableDiv);


        // добавляем чекбокс показа раскрывающихся списков
        let checkHoverStyleDiv = document.createElement('div');
        checkHoverStyleDiv.id = 'checkHoverStyleDiv';
        let checkHoverStyleInput = document.createElement('input');
        checkHoverStyleInput.id = 'checkHoverStyleInput';
        checkHoverStyleInput.type = 'checkbox';
        checkHoverStyleInput.checked = lsprefs.showHoverStyle;
        checkHoverStyleInput.onchange = function() {
            lsprefs.showHoverStyle = this.checked;
            chrome.storage.local.set({parkrunExtendedInfo: lsprefs}, function() {
                main();
            });
        };
        checkHoverStyleDiv.appendChild(checkHoverStyleInput);
        let checkHoverStyleLabel = document.createElement('label');
        checkHoverStyleLabel.htmlFor = 'checkHoverStyleInput';
        checkHoverStyleLabel.innerHTML = L10n[LANG].scriptSettings.showHoverStyle;
        checkHoverStyleDiv.appendChild(checkHoverStyleLabel);
        div.appendChild(checkHoverStyleDiv);

        // добавляем блок на страницу
        let node = document.getElementById('mainheader');
        node.insertBefore(div, node.firstChild);

        document.getElementById('pJubilee').style.width = document.getElementById('pJubilee').style.left;
    }
})();