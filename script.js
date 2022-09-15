const reposList = document.querySelector('.repos__list')
const searchLine = document.querySelector('.search__line')
const autocompleteList = document.querySelector('.search__autocomplete')


const searchStart = (e) => {
    getRepos(searchLine.value)
}

const addToReposList = (item) => {
    const newItem = document.createElement('li');
        
        newItem.innerHTML = `<span>Name: ${item.textContent}</span>
                             <span>Owner: ${item.dataset.owner}</span>
                             <span>Stars: ${item.dataset.stars}</span>
                             <button class = 'btn'></btn>`;
        reposList.appendChild(newItem);
}

class AutocompleteItem {

    constructor (item) {
        this.name = item.name;
        this.stars = item.stargazers_count;
        this.owner = item.owner.login;
    }

    createNewItem () {
        const newItem = document.createElement('li')
        newItem.textContent = this.name
        newItem.dataset.owner = this.owner
        newItem.dataset.stars = this.stars
        newItem.setAttribute('onclick', 'addToReposList(this)')
        autocompleteList.appendChild(newItem)
        
    }
}

const addAutocompleteList = (searchResult) => {
    autocompleteList.innerHTML = ''
    autocompleteList.style.display = 'block'
    for (let item of searchResult.items) {
        const autocompleteItem = new AutocompleteItem(item) 
        autocompleteItem.createNewItem()
    }
}



async function getRepos (searchValue) {
    let response = await fetch(`https://api.github.com/search/repositories?q=${searchValue}&per_page=5`)
    let result = response.json()
    .then((res) => addAutocompleteList(res))
}


    const debounce = (fn, debounceTime) => {
    let delay;
    return function () {
        const fnCall = () => {fn.apply(this, arguments)}
        clearTimeout(delay)
        delay = setTimeout(fnCall, debounceTime)
    }
};


searchLine.addEventListener('keyup', debounce(searchStart, 300));

autocompleteList.addEventListener('click', (e) => {
    if (e.target.tagName = 'li') {
        autocompleteList.innerHTML = ''
        searchLine.value = ''
    }
})

reposList.addEventListener('click', (e) => {
    if (e.target.className != 'btn') return;
    let li = e.target.closest('li');
    li.remove()
})
