const onSizeChange = event => {
    const elements = document.querySelectorAll('.prices');
    [...elements].forEach(element => {
        element.setAttribute('hidden', true);
    });
    document.getElementById(event.target.value).removeAttribute('hidden');
};

const onRadioChange = event => {
    const show = event.target.value;
    const elements = document.querySelectorAll('.swappable');
    [...elements].forEach(element => {
        if(element.hasAttribute('hidden')) {
            if(element.className.includes(`colour-${show}`)) {
                element.removeAttribute('hidden');
            }
        } else {
            element.setAttribute('hidden', true);
        }
    });
    const sizeSelector = document.getElementById('size');
    sizeSelector.value = document.querySelector(`select .colour-${show}`).value;
    sizeSelector.dispatchEvent(new Event('change'));

    document.querySelector('.colour-selector__selected').textContent = event.target.attributes['data-colour'].value;
};

const radioButtons = document.querySelectorAll('.colour-selector__radio');
[...radioButtons].forEach(radio => {
    radio.addEventListener('change', onRadioChange);
});

document.querySelector('#size').addEventListener('change', onSizeChange);