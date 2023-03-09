export { setFilter, filter };

//filter pills
const typePillsCont = document.getElementById('type-pills-container');
const genrePillsCont = document.getElementById('genre-pills-container');
const countryPillsCont = document.getElementById('country-pills-container');
const langPillsCont = document.getElementById('language-pills-container');
const ratingPillsCont = document.getElementById('rating-pills-container');
const datePillsCont = document.getElementById('date-pills-container');
const keywordPillCont = document.getElementById('keyword-pill-container');
const plotPillCont = document.getElementById('plot-pill-container');


const filterParams = {
    type: [],
    genre: [],
    country: [],
    lang: [],
    plot: '',
    keywords: [],
    rating: {
        from: '',
        to: ''
    },
    date: {
        from: '',
        to: ''
    }
}

class Filter {
    constructor(data) {
        Object.assign(this, data);
    }

    siftTo(filterName, userInput) {

        switch (filterName) {
            case 'type':
                this.updateTitleType(userInput);
                break;

            case 'genre':
                this.updateGenre(userInput);
                break;

            case 'country':
                this.updateCountry(userInput);
                break;

            case 'language':
                this.updateLanguage(userInput);
                break;

            case 'rating':
                this.updateRating(userInput);
                break;

            case 'date':
                this.updateDate(userInput);
                break;

            case 'keyword':
                this.updateKeyword(userInput);
                break;

            case 'plot':
                this.updatePlot(userInput);
                break;


            default:
                break;
        }

    }

    updateTitleType(paramArr) {
        this.type = paramArr;

        if (this.type.length > 0) {
            typePillsCont.innerHTML = this.getPillsHtmlA(this.type);
            setPillListners('type');
        } else {
            typePillsCont.innerHTML = '';
        }
    }

    updateGenre(paramArr) {
        this.genre = paramArr;

        if (this.genre.length > 0) {
            
            const pills = this.genre.map(checkedOption => {
                return this.getPillsHtmlD(checkedOption);
            }).join('');

            genrePillsCont.innerHTML = pills;
            
            setPillListners('genre');
        } else {
            genrePillsCont.innerHTML = '';
        }
    }

    updateCountry(paramArr) {
        this.country = paramArr;

        if (this.country.length > 0) {
            const areaType = 'coun';
            countryPillsCont.innerHTML = this.getPillsHtmlB(areaType, this.country)
            setPillListners('country');
        } else {
            countryPillsCont.innerHTML = '';
        }
    }

    updateLanguage(paramArr) {
        this.lang = paramArr;

        if (this.lang.length > 0) {
            const areaType = 'lang';
            langPillsCont.innerHTML = this.getPillsHtmlB(areaType, this.lang);
            setPillListners('language');
        } else {
            langPillsCont.innerHTML = '';
        }
    }

    updateRating(selectedOb) {
        this.rating.from = selectedOb.fromVal;
        this.rating.to = selectedOb.toVal;

        const fromPill = this.rating.from.length > 0 ? `<i>from: ${this.rating.from}</i>` : '';
        const toPill = this.rating.to.length > 0 ? `<i> to: ${this.rating.to}</i>` : '';

        const pills = `<span>${fromPill}${toPill}</span>`;

        if (this.rating.from === '' && this.rating.to === '') {
            ratingPillsCont.innerHTML = '';
        } else {
            ratingPillsCont.innerHTML = pills;
            setPillListners('rating');
        }
    }

    updateDate(inputOb) {
        this.date.from = inputOb.from;
        this.date.to = inputOb.to;

        const dateArr = [this.date.from, this.date.to];

        if (inputOb.from.length > 0 || inputOb.to.length > 0) {
            datePillsCont.innerHTML = this.getPillsHtmlC(dateArr);
            setPillListners('date');
        } else {
            datePillsCont.innerHTML = '';
        }
    }

    updateKeyword(inputString) {

        if (this.keywords.indexOf(inputString) === -1) {

            this.keywords.push(inputString);

            const keywordsPillsHTML = this.keywords.map(keyword => {
                return `<span>${keyword}</span>`;
            }).join('');
            keywordPillCont.innerHTML = keywordsPillsHTML;

            setPillListners('keyword');
        }
    }

    updatePlot(inputString) {
        this.plot = inputString;

        if (this.plot.length > 0) {
            plotPillCont.innerHTML = `<span>${this.plot}</span>`;
            setPillListners('plot');
        } else {
            plotPillCont.innerHTML = '';
        }
    }

    getPillsHtmlA(optionsArr) {
        const pills = optionsArr.map(option => {
            return option.length > 0 ? `<span data-checkbox-id="${option}">${option}</span>` : '';
        }).join('');

        return pills;
    }

    getPillsHtmlB(areaType, optionsArr) {
        const prefix = areaType === 'lang' ? 'l' : 'c';
        const pills = optionsArr.map(option => {
            return `<span data-checkbox-id="${option.weird}-${prefix}">${option.normal}</span>`
        }).join('');

        return pills;
    }

    getPillsHtmlC(optionsArr) {

        const fromEl = optionsArr[0].length > 0 ? `<i data-checkbox-id="${optionsArr[0]}">from: ${optionsArr[0]}</i>` : '';
        const toEl = optionsArr[1].length > 0 ? `<i data-checkbox-id="${optionsArr[1]}"> to: ${optionsArr[1]}</i>` : '';

        const pills = `<span>${fromEl}${toEl}</span>`;

        return pills;
    }

    getPillsHtmlD(checkedId) {

        const checkedOptionEl = document.getElementById(checkedId).dataset.genreCheckboxes;

        return `<span data-checkbox-id="${checkedOptionEl}">${checkedOptionEl}</span>`;
    }
}


let filter;

function setFilter() {
    filter = new Filter(filterParams);
    setFilterInputsListeners();
}

function setFilterInputsListeners() {
    const inputAreas = document.querySelectorAll('[data-input-area]');

    const addLangBtn = document.querySelector('[data-add-lang-btn]');
    const addCoBtn = document.querySelector('[data-add-country-btn]');

    let subMeth = '';

    inputAreas.forEach(area => {
        const areaType = area.dataset.inputArea;

        switch (areaType) {
            case 'type':
            case 'genre':
                area.addEventListener('click', () => {
                    setFiltersTypeA(areaType);
                })
                break;

            case 'country':
                area.addEventListener('click', () => {
                    subMeth = 'select'
                    setFiltersTypeB(areaType, subMeth)
                })

                addCoBtn.addEventListener('click', () => {
                    intiateCoSetFilter()
                })

                const counTextIn = document.getElementById('coun-inp-text');
                counTextIn.addEventListener('keypress', (e) => {
                    e.key === "Enter" ? intiateCoSetFilter() : {};
                })

                //reset input validity state
                counTextIn.addEventListener('input', () => {
                    counTextIn.classList.replace('input-text-invalid', 'input-text');
                })

                function intiateCoSetFilter() {
                    subMeth = 'textInput'
                    setFiltersTypeB(areaType, subMeth, counTextIn);
                }
                break;

            case 'language':
                area.addEventListener('click', () => {
                    subMeth = 'select'
                    setFiltersTypeB(areaType, subMeth)
                })

                addLangBtn.addEventListener('click', () => {
                    intiateLangSetFilter();
                })

                const langTextIn = document.getElementById('lang-inp-text');
                langTextIn.addEventListener('keypress', (e) => {
                    e.key === "Enter" ? intiateLangSetFilter() : {};
                })

                function intiateLangSetFilter() {
                    subMeth = 'textInput';
                    setFiltersTypeB(areaType, subMeth, langTextIn);
                }

                langTextIn.addEventListener('input', () => {
                    langTextIn.classList.replace('input-text-invalid', 'input-text');
                })
                break;

            case 'rating':
                area.addEventListener('change', () => {
                    setFiltersTypeC(areaType);
                })
                break;

            case 'date':
                area.addEventListener('click', () => {
                    setFiltersTypeD(areaType);
                })
                break;

            case 'plot':
            case 'keyword':
                area.addEventListener('click', () => {
                    setFiltersTypeE(areaType, area.dataset.inputFieldId);
                })
                break;

            default:
                break;
        }
    })

}

function setFiltersTypeA(filterType) {
    const checkedArr = getCheckedOptions(filterType);
    filter.siftTo(filterType, checkedArr);
}

function setFiltersTypeB(filterType, method, textInputEl) {
    switch (method) {
        case 'select':
            const checkedArr = getCheckedOptions(filterType);
            filter.siftTo(filterType, checkedArr);
            break;

        case 'textInput':
            checkOption();
            const checkedOpArr = getCheckedOptions(filterType);
            filter.siftTo(filterType, checkedOpArr);
            break;

        default:
            break;
    }

    function checkOption() {

        const checkboxes = document.querySelectorAll(`[data-${filterType}-checkboxes]`);

        const validOptions = [...checkboxes].map(checkbox => {
            const validNormal = filterType === 'language' ? checkbox.dataset.languageCheckboxes : checkbox.dataset.countryCheckboxes;
            return validNormal;
        })

        const validityCheck = validOptions.indexOf(textInputEl.value);

        if (!(validityCheck === -1)) {
            checkboxes[validityCheck].checked = true;
            textInputEl.classList.replace('input-text-invalid', 'input-text');
        } else {
            textInputEl.classList.add('input-text-invalid');
        }
    }
}

function setFiltersTypeC(filterType) {
    const fromEl = document.querySelector('[data-rating-from]');
    const toEl = document.querySelector('[data-rating-to]');

    const currentSelected = {
        fromVal: fromEl.value,
        toVal: toEl.value
    }

    filter.siftTo(filterType, currentSelected)
}

function setFiltersTypeD(filterType) {
    const fromEl = document.getElementById("date-from")
    const toEl = document.getElementById("date-to")

    if (fromEl.validity.valid && toEl.validity.valid && !(fromEl.value === '1873' && toEl.value === '2023')) {

        const dateInputs = {
            from: fromEl.value,
            to: toEl.value
        }

        filter.siftTo(filterType, dateInputs);
    }
}

function setFiltersTypeE(filterType, inputId) {
    const inputEl = document.getElementById(inputId);

    if (inputEl.value.length > 0 && inputEl.validity.valid) {
        filter.siftTo(filterType, inputEl.value);
    }
}


function getCheckedOptions(filterType) {
    const checkboxes = document.querySelectorAll(`[data-${filterType}-checkboxes]`);

    const checkedCheckboxes = new Array;

    switch (filterType) {
        case 'type':
        case 'genre':
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    checkedCheckboxes.push(checkbox.id);
                }
            })
            break;

        case 'country':
        case 'language':
            checkboxes.forEach(checkbox => {

                if (checkbox.checked) {
                    const nameText = filterType === 'language' ? checkbox.dataset.languageCheckboxes : checkbox.dataset.countryCheckboxes;

                    const checkedOption = {
                        normal: nameText,
                        weird: checkbox.value
                    }

                    checkedCheckboxes.push(checkedOption);
                }
            })
            break;

        default:
            break;
    }

    return checkedCheckboxes;
}


function setPillListners(areaType) {
    switch (areaType) {
        case 'type':
            const typePills = typePillsCont.childNodes;

            typePills.forEach(pill => {
                pill.addEventListener('click', () => {
                    const checkbox = document.getElementById(pill.dataset.checkboxId);
                    checkbox.click();
                })
            })
            break;

        case 'genre':
            const genrePills = genrePillsCont.childNodes;

            genrePills.forEach(pill => {
                pill.addEventListener('click', () => {
                    const checkbox = document.getElementById(pill.dataset.checkboxId);
                    checkbox.click();
                })
            })
            break;

        case 'country':
            const countryPills = countryPillsCont.childNodes;

            countryPills.forEach(pill => {
                pill.addEventListener('click', () => {
                    const checkbox = document.getElementById(pill.dataset.checkboxId);
                    checkbox.click();
                })
            })
            break;

        case 'language':
            const langPills = langPillsCont.childNodes;

            langPills.forEach(pill => {
                pill.addEventListener('click', () => {
                    const checkbox = document.getElementById(pill.dataset.checkboxId);
                    checkbox.click();
                })
            })
            break;

        case 'rating':
            ratingPillsCont.addEventListener('click', () => {
                const fromEl = document.getElementById('date-select-from');
                const toEl = document.getElementById('date-select-to');

                fromEl.value = '-';
                toEl.value = '-';

                const selectedOb = {
                    fromVal: fromEl.value,
                    toVal: toEl.value
                }

                filter.updateRating(selectedOb);
            })
            break;

        case 'date':
            datePillsCont.addEventListener('click', () => {
                const inputOb = {
                    from: '',
                    to: ''
                }
                filter.updateDate(inputOb);
            })
            break;

        case 'keyword':
            const keywordPills = keywordPillCont.childNodes;

            keywordPills.forEach(pill => {
                pill.addEventListener('click', () => {
                    const targetItem = filter.keywords.indexOf(pill.textContent);
                    filter.keywords.splice(targetItem, 1);

                    pill.remove();
                })
            })

            break;

        case 'plot':
            plotPillCont.addEventListener('click', () => {
                const inputString = '';
                filter.updatePlot(inputString)
            })
            break;

        default:
            break;
    }
}