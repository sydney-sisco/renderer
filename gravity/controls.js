const settings = {
    // projection: {
    //     name: 'projection',
    //     type: 'select',
    //     value: 'perspective',
    //     options: ['perspective', 'orthographic']
    // },
    // {
    //   name: 'autoRotate',
    //   type: 'checkbox',
    //   value: false,
    //   startingValue: false,
    // },
    // {
    //   name: '3dobject',
    //   type: 'select',
    //   value: 'cube',
    //   startingValue: 'cube',
    //   options: ['cube', 'sphere'],
    // },
};

const createSelect = (setting) => {
    let selectDiv = document.createElement('div');
    let label = document.createElement('label');
    let select = document.createElement('select');

    // Set attributes
    label.innerText = `${setting.name}:`;
    select.id = `${setting.name}Select`;

    setting.options.map((option) => {
        let optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.innerText = option;
        select.appendChild(optionElement);
    });

    select.addEventListener('change', () => {
        setting.value = select.value;
        console.log(`${setting.name}: ${setting.value}`);
    });

    selectDiv.appendChild(label);
    selectDiv.appendChild(select);

    const controlsWrapper = document.querySelector('#controlsWrapper');
    controlsWrapper.appendChild(selectDiv);
};

const createCheckbox = (setting) => {
    let checkboxDiv = document.createElement('div');
    let label = document.createElement('label');
    let checkbox = document.createElement('input');

    label.innerText = `${setting.name}:`;
    checkbox.type = 'checkbox';
    checkbox.id = `${setting.name}Checkbox`;
    checkbox.checked = setting.value;

    checkbox.addEventListener('change', () => {
        setting.value = checkbox.checked;
        console.log(`${setting.name}: ${setting.value}`);
        if (setting.cb) {
            setting.cb();
        }
    });

    checkboxDiv.appendChild(label);
    checkboxDiv.appendChild(checkbox);

    const controlsWrapper = document.querySelector('#controlsWrapper');
    controlsWrapper.appendChild(checkboxDiv);
};

const createButton = (setting) => {
    let buttonDiv = document.createElement('div');
    let button = document.createElement('button');

    button.id = `${setting.name}Button`;
    button.innerText = setting.name;

    button.addEventListener('click', () => {
        if (setting.cb) {
            setting.cb();
        } else {
            console.error('no callback for button', setting.name);
        }
    });

    buttonDiv.appendChild(button);
    
    const controlsWrapper = document.querySelector('#controlsWrapper');
    controlsWrapper.appendChild(buttonDiv);
};

const createSlider = (setting) => {
    let sliderDiv = document.createElement('div');
    sliderDiv.className = 'sliderDiv';
    let label = document.createElement('label');
    let slider = document.createElement('input');

    label.innerText = `${setting.name}:`;
    slider.type = 'range';
    slider.min = setting.min;
    slider.max = setting.max;
    slider.step = setting.step;
    slider.value = setting.startingValue;
    slider.id = `${setting.name}Slider`;

    setting.value = setting.startingValue;


    // Set up event listener for slider
    slider.addEventListener('input', () => {
        setting.value = Number.parseFloat(slider.value);
        if (setting.cb) {
            setting.cb(setting.value);
        } else {
            console.error('no callback for slider', setting.name, setting.value);
        }
    });

    sliderDiv.appendChild(label);
    sliderDiv.appendChild(slider);
    document.body.appendChild(sliderDiv);
}

const addSettings = (newSettings) => {
    for (let i = 0; i < newSettings.length; i++) {
        settings[newSettings[i].name] = newSettings[i];
    }
    processSettings(newSettings);
};

const processSettings = (settings) => {
    for (let setting in settings) {
        switch (settings[setting].type) {
            case 'select':
                createSelect(settings[setting]);
                break;
            case 'checkbox':
                createCheckbox(settings[setting]);
                break;
            case 'button':
                createButton(settings[setting]);
                break;
            case 'slider':
                createSlider(settings[setting]);
                break;
            default:
                console.error('invalid setting type', settings[setting].type);
        }
    }
};

processSettings(settings);
