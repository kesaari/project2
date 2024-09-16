let input = document.querySelector(".input");
let datalist = document.querySelector('.suggest_cont');
let like = document.querySelector('.like');
let likeData = JSON.parse(localStorage.getItem('like')) || [];
let controller;

function updateLike() {
    likeData.forEach(repo => {
        renderLike(repo);
    })
}

function createLoader() {
    datalist.innerHTML = `<span class="loader"></span>`;
}

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

function fixToLike(repo) {
    if (!likeData.find(el => el.id === repo.id)) {
        likeData.push(repo);
        localStorage.setItem('like', JSON.stringify(likeData));
        renderLike(repo);
        closeSuggest();
    }
}

function deleteLike(repo, card) {
    likeData = likeData.filter(elem => elem.name !== repo);
    localStorage.setItem('like', JSON.stringify(likeData));
    let deleteItem = card;
    deleteItem.remove();
}

document.addEventListener('click', function(event) {
    if (!datalist.contains(event.target)) {
        closeSuggest();
    }
});

// input.addEventListener('keyup', debounce(searchRepos.bind(this), 500));
    

// input.addEventListener('keydown', (event) => {
//     if(event.keyCode === 46 || event.keyCode === 8) {
//         closeSuggest();
//     }
// });

// function createSuggest(repos) {
//     repos.forEach(repo => {

//         let suggest_item = document.createElement('div');
//         suggest_item.textContent = `${repo.name}`;
//         suggest_item.classList.add('suggest_item');
//         let likeBtn = createItem('button', 'like_btn');
//         suggest_item.append(likeBtn);
//         datalist.append(suggest_item);
//         likeBtn.onclick = function() {
//             fixToLike(repo)
//         }
//         suggest_item.onclick = function() {
//             fixToLike(repo)
//         }
//     })
// }

function createSuggest(repos) {
    repos.forEach(repo => {
        let suggest_item = createItem('div', 'suggest_item');
        let likeBtn = createItem('button', 'like_btn');
        let suggest_info = createItem('div', 'title');
        suggest_info.textContent = `${repo.name}`;
        suggest_item.append(suggest_info);
        suggest_item.append(likeBtn);
        datalist.append(suggest_item);

        likeBtn.onclick = function() {
            fixToLike(repo)
        }
        suggest_item.onclick = function() {
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
        createLoader()
        let response = await fetch(`https://api.github.com/search/repositories?q=${input.value}&per_page=5`, { signal: controller.signal });
        let reposList = await response.json();
        closeSuggest();
        createSuggest(reposList.items);
        if (reposList.items.length === 0) {
            datalist.innerHTML = `<div>Ничего не нашлось</div>`
        }
}

// async function searchRepos() {
//     if (input.value) {
//         if (controller) {
//             controller.abort();
//         }
//         controller = new AbortController();
//         const signal = controller.signal;
//         createLoader();
//         try {
//             let response = await fetch(`https://api.github.com/search/repositories?q=${input.value}&per_page=5`, { signal });
//             if (!response.ok) {
//                 throw new Error('Слишком много запросов');
//             }
//             let reposList = await response.json();
//             closeSuggest();
//             createSuggest(reposList.items);
//             if (reposList.items.length === 0) {
//                 datalist.innerHTML = `<div>Ничего не нашлось</div>`;
//             }
//         } catch (error) {
//             if (error.name === 'AbortError') {
//                 console.log('Запрос прерван');
//             } else {
//                 console.error('Fetch error:', error);
//             }
//         }
//     } else {
//         closeSuggest();
//     }
// }

input.addEventListener('input', function() {
    if (controller) {
        controller.abort();
    }
    if (input.value) {
        controller = new AbortController();
        debounce(searchRepos(), 500);
    } else {
        closeSuggest();
    }
});

// function abortSearch() {
//     if (controller) {
//         controller.abort(); /// otmena esli yje est
//     }
//     if (input.value) {
//         controller = new AbortController(); // novii controller
//         debounce(searchRepos(), 500);
//     } else {
//         closeSuggest();
//     }
// }

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

updateLike()