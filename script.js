const input = document.querySelector(".input");
const datalist = document.querySelector('.suggest_cont');
const like = document.querySelector('.like');
let likeData = JSON.parse(localStorage.getItem('likeData')) || [];

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
        let likeCard = createItem('div', 'like_card');
        likeCard.innerHTML = `<div class="titleText">${repo.name}</div>
                              <div class="text">Владелец: ${repo.owner.login}</div>
                              <div class="text">Рейтинг: ${repo.stargazers_count}</div> `;
        let deleteBtn = createItem('button', 'delete_btn');
        deleteBtn.onclick = () => deleteLike(repo.name, deleteBtn.parentNode)
        likeCard.append(deleteBtn);
        like.append(likeCard);
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

input.addEventListener('keyup', debounce(searchRepos.bind(this), 500));
input.addEventListener('keydown', (event) => {
    if(event.keyCode === 46 || event.keyCode === 8) {
        closeSuggest();
    }
});

// async function searchRepos() {
//     if(input.value) {
//     return await fetch(`https://api.github.com/search/repositories?q=${input.value}&per_page=5`)
//     .then(res => {
//         if (res.ok) {
//             res.json().then(res => {
//                 res.items.forEach(repos => {
//                     let suggest = createSuggest(repos.name)
//                     reposStorage = Object.assign(repos);
//                     getActive(suggest);
//                     console.log(reposStorage)
//                 });
//                 });
//             }
//         })
//     } else {
//         datalist.innerHTML = ' ';
//     }
// }

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
        let response = await fetch(`https://api.github.com/search/repositories?q=${input.value}&per_page=5`);
        let reposList = await response.json();
        createSuggest(reposList.items);
    } else {
        closeSuggest();
    }
}

