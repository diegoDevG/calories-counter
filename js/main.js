const compose = (...functions) => data =>
    functions.reduceRight((value, func) => func(value), data)

//****** */Modo imperativo**********
// const attrsToString = (obj = {}) => {
//     const keys = Object.keys(obj)
//     const attrs = []

//     for (let i = 0; i < keys.length; i++) {
//         let attr = keys[i]
//         attrs.push(`${attr}="${obj[attr]}"`)
//     }

//     const string = attrs.join(' ')

//     return string
// }


//****** Modo declarativo */
const attrsToString = (obj = {}) =>
    Object.keys(obj)
        .map(attr => `${attr}="${obj[attr]}"`)
        .join(' ')


const tagAttrs = obj => (content = '') =>
    `<${obj.tag}${obj.attrs ? ' ' : ''}${attrsToString(obj.attrs)}>${content}</${obj.tag}>`

///****Modo imperativo */
// const tag = t => {
//     if (typeof t === 'string') {
//         return tagAttrs({ tag: t })
//     }
//     return tagAttrs(t)
// }

///***Modo declartivo */
const tag = t => typeof t === 'string' ? tagAttrs({ tag: t }) : tagAttrs(t)

const tableRowTag = tag('tr')
const tableRow = items => compose(tableRowTag, tableCells)(items)

const tableCell = tag('td')
const tableCells = items => items.map(tableCell).join('')

const trashIcon = tag({ tag: 'i', attrs: { class: 'fa fa-trash-alt' } })('')

let description = $('#description')
let calories = $('#calories')
let carbs = $('#carbs')
let protein = $('#protein')

let list = [];

description.keypress(() => {
    description.removeClass('is-invalid')
})
calories.keypress(() => {
    calories.removeClass('is-invalid')
})
carbs.keypress(() => {
    carbs.removeClass('is-invalid')
})
protein.keypress(() => {
    protein.removeClass('is-invalid')
})

const validateInputs = () => {
    description.val() ? '' : description.addClass('is-invalid')
    calories.val() ? '' : calories.addClass('is-invalid')
    carbs.val() ? '' : carbs.addClass('is-invalid')
    protein.val() ? '' : protein.addClass('is-invalid')

    if (description.val() &&
        calories.val() &&
        carbs.val() &&
        protein.val()
    ) add()

}

const add = () => {
    const newItem = {
        description: description.val(),
        calories: parseInt(calories.val()),
        carbs: parseInt(carbs.val()),
        protein: parseInt(protein.val())
    }

    list = [...list, newItem]
    updateTotals()
    cleanInputs()
    renderItems()
}

const updateTotals = () => {
    let calories = 0, carbs = 0, protein = 0

    list.map(item => {
        calories += item.calories
        carbs += item.carbs
        protein += item.protein
    })

    document.querySelector('#totalCalories').textContent = calories
    document.querySelector('#totalCarbs').textContent = carbs
    document.querySelector('#totalProtein').textContent = protein

}

const cleanInputs = () => {
    description.val('')
    calories.val('')
    carbs.val('')
    protein.val('')
}

const renderItems = () => {
    const $container = document.getElementsByTagName("tbody")[0];
    $container.innerHTML = "";
    const rows = list.map((item, index) => {
        const removeButton = tag({
            tag: 'button',
            attrs: {
                class: 'btn btn-outline-danger',
                onclick: `removeItem(${index})`
            }
        })(trashIcon)
        const { description, calories, carbs, protein } = item;
        return tableRow([description, calories, carbs, protein, removeButton]);
    });
    $container.innerHTML = rows.join("");
};

const removeItem = (index) => {
    list.splice(index, 1)

    updateTotals()
    renderItems()
}
