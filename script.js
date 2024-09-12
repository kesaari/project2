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

function addToFavorites(repo) {
    if (!likeData.find(fav => fav.id === repo.id)) {
        likeData.push(repo);
        localStorage.setItem('like', JSON.stringify(likeData));
    }
console.log(localStorage);
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
        datalist.append(suggest_item);
        suggest_item.onclick = () => addToFavorites(repo);

        // suggest_item.onclick = function() {
        //     fixToLike(repo)
        // }
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

