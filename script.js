const reposList = document.querySelector('.repos__list')
const searchLine = document.querySelector('.search__line')
const autocompleteList = document.querySelector('.search__autocomplete-list')


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

const searchStart = () => {
    if (searchLine.value) {
    getRepos(searchLine.value)
    }
}

searchLine.addEventListener('keypress', debounce(searchStart, 300));

autocompleteList.addEventListener('click', (e) => {
    if (e.target.tagName != 'LI') return
    addToReposList(e.target)
    autocompleteList.innerHTML = ''
    searchLine.value = ''
})

const addAutocompleteList = (searchResult) => {
    autocompleteList.innerHTML = ''
    for (let item of searchResult.items) {
        createNewAutocompleteItem(item)
    }
}

const createNewAutocompleteItem = (item) => {
    const newItem = document.createElement('li')
    newItem.textContent = item.name
    newItem.dataset.owner = item.owner.login
    newItem.dataset.stars = item.stargazers_count
    autocompleteList.appendChild(newItem)
}


const addToReposList = (item) => {
    const newItem = document.createElement('li');
        
        newItem.innerHTML = `<span>Name: ${item.textContent}</span>
                            <span>Owner: ${item.dataset.owner}</span>
                            <span>Stars: ${item.dataset.stars}</span>
                            <button class = 'btn'></btn>`;
        reposList.appendChild(newItem);
}



reposList.addEventListener('click', (e) => {
    if (e.target.className != 'btn') return;
    let li = e.target.closest('li');
    li.remove()
})
