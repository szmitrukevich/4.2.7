const reposList = document.querySelector('.repos__list')
const searchLine = document.querySelector('.search__line')
const autocompleteList = document.querySelector('.search__autocomplete')


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

const searchStart = (e) => {
    if (searchLine.value) {
    getRepos(searchLine.value)
    } else {
        return
    }
}

searchLine.addEventListener('keypress', debounce(searchStart, 300));


const createNewAutocompleteItem = (item) => {
    const newItem = document.createElement('li')
    newItem.textContent = item.name
    newItem.dataset.owner = item.owner.login
    newItem.dataset.stars = item.stargazers_count
    newItem.setAttribute('onclick', 'addToReposList(this)')
    autocompleteList.appendChild(newItem)
}

const addAutocompleteList = (searchResult) => {
    autocompleteList.innerHTML = ''
    autocompleteList.style.display = 'block'
    for (let item of searchResult.items) {
        createNewAutocompleteItem(item)
    }
}




const addToReposList = (item) => {
    const newItem = document.createElement('li');
        
        newItem.innerHTML = `<span>Name: ${item.textContent}</span>
                             <span>Owner: ${item.dataset.owner}</span>
                             <span>Stars: ${item.dataset.stars}</span>
                             <button class = 'btn'></btn>`;
        reposList.appendChild(newItem);
}

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
