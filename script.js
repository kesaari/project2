let input = document.querySelector(".input");
let datalist = document.querySelector('.suggest_cont');
let like = document.querySelector('.like');
let likeData = JSON.parse(localStorage.getItem('like')) || [];
let body = document.getElementsByTagName('body')

function closeSuggest() {
    datalist.innerHTML = ' '
}

const debounce = (fn, delay) => {
    let timer;
    return function() {
      const fnCall = () => { fn.apply(this, arguments) } 
      clearTimeout(timer);
      timer = setTimeout(fnCall, delay);
    };
  };

function fixToLike(element) {
    // element.addEventListener('click', function () {
    //     let likeCard = createItem('div', 'like_card');
    //     likeCard.textContent = element.textContent;
    //     like.append(likeCard);
    //     closeSuggest();
// );};
}

function fixToLike(repo) {
    if (!likeData.find(el => el.id === repo.id)) {
        likeData.push(repo);
        localStorage.setItem('like', JSON.stringify(likeData));
        renderLike(repo);
        closeSuggest();
    }
console.log(localStorage);
}

function deleteLike(repo, card) {
    likeData = likeData.filter(elem => elem.name !== repo);
    localStorage.setItem('like', JSON.stringify(likeData));
    let deleteItem = card;
    deleteItem.remove();
    console.log(deleteItem);
}
document.addEventListener('click', function(event) {
    if (!datalist.contains(event.target)) {
        closeSuggest();
    }
});
input.addEventListener('keyup', debounce(searchRepos.bind(this), 1000));
input.addEventListener('keydown', (event) => {
    if(event.keyCode === 46 || event.keyCode === 8) {
        closeSuggest();
    }
});

function createSuggest(repos) {
    repos.forEach(repo => {

        let suggest_item = document.createElement('div');
        suggest_item.textContent = `${repo.name}`;
        suggest_item.classList.add('suggest_item');
        let likeBtn = createItem('button', 'like_btn');
        suggest_item.append(likeBtn);
        datalist.append(suggest_item);
        likeBtn.onclick = function() {
            fixToLike(repo)
        }
    })
}


function createItem(tagName, className) {
    let item = document.createElement(tagName);
    if(className) item.classList.add(className);
    return item
}

async function searchRepos() {
    if(input.value) {
        createLoader()
        let response = await fetch(`https://api.github.com/search/repositories?q=${input.value}&per_page=5`);
        let reposList = await response.json();
        closeSuggest();
        createSuggest(reposList.items);
    } else {
        closeSuggest();
    }
}

function renderLike(repo) {
    let likeCard = createItem('div', 'like_card');
        likeCard.innerHTML = `<div class="titleText">${repo.name}</div>
                              <div class="text">Владелец: ${repo.owner.login}</div>
                              <div class="text">Рейтинг: ${repo.stargazers_count}</div> `;
        let deleteBtn = createItem('button', 'delete_btn');
        deleteBtn.onclick = () => deleteLike(repo.name, deleteBtn.parentNode)
        likeCard.append(deleteBtn);
        like.append(likeCard);
}

function updateLike() {
    
    likeData.forEach(repo => {
        renderLike(repo);
    })
}

function createLoader() {
    datalist.innerHTML = `<span class="loader"></span>`;
}

updateLike();
console.log(likeData)