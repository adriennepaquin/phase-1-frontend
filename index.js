const recipeCards = document.querySelector('#card-container');
const filter = document.querySelector('#selector');
const addIngredBtn = document.querySelector('#addIngredBtn');
const ingredForm = document.querySelector('#ingredientForm');
const recipeForm = document.querySelector('#add-form');
const allBtn = document.querySelector('#showAll');
const ingredDropdown = document.querySelector('#ingredient');
const ingredientsArray = [];


filter.addEventListener('change', filterRecipes);
recipeCards.addEventListener('click', addLike);
addIngredBtn.addEventListener('click', addInput);
recipeForm.addEventListener('submit', addRecipe);
allBtn.addEventListener('click', () => {
    recipeCards.textContent = "";
    fetchRecipes()
});

fetchRecipes()

function fetchRecipes(){ 
    return fetch("http://localhost:3000/recipes")
    .then(res => res.json())
    .then((data) => {
        renderRecipes(data);
        renderDropdown();
    });
}

function renderRecipes(recipesObj) {
    recipesObj.forEach(recipe => renderRecipe(recipe));
}

function renderRecipe(recipe) {
    let recipeDiv = document.createElement('div');
    let title = document.createElement('h3');
    let image = document.createElement('img')
    let ingredUl = document.createElement('ul');
    let link = document.createElement('a');
    let likeDiv = document.createElement('div');
    let likeBtn = document.createElement('button');

    let ewBtn = document.createElement('button');
    let likes = document.createElement('p');

    recipeDiv.className = "cards";
    title.textContent = recipe.name;
    image.src = recipe.image;
    link.href = recipe["recipe-url"];
    link.textContent = "Click here for recipe!"
    likeBtn.textContent = " YUM ";
    likeBtn.dataset.id = recipe.id
    likeBtn.dataset.likes = recipe.hearts
    likeBtn.className = "likebutton"

    ewBtn.textContent = " EW ";
    ewBtn.dataset.id = recipe.id;
    ewBtn.dataset.likes = recipe.hearts;
    ewBtn.className = "ewbutton"

    likes.textContent = `${recipe.hearts} likes`;
    ingredUl.className = "scrollingred"

    likeDiv.append(likes, likeBtn, ewBtn);
    recipeDiv.append(title, image, link, ingredUl, likeDiv);
    recipeCards.append(recipeDiv);

    recipe.ingredients.forEach(ingredient => {
        ingredientsArray.push(ingredient.toLowerCase());

        let ingredLi = document.createElement('li');
        ingredLi.textContent = ingredient;
        ingredUl.append(ingredLi);
    })
}

function filterRecipes(e) {
    fetch("http://localhost:3000/recipes")
    .then(res => res.json())
    .then(filterFunction)

    function filterFunction(data) {
        filteredArray = [];
        data.forEach(recipe => {
            if(recipe.ingredients.indexOf(e.target.value)>=0) {
                filteredArray.push(recipe.id);
            }
        })
        filterFetch(filteredArray)
    }
}

function filterFetch(array){
    recipeCards.textContent = "";
    for (index in array){
        fetch(`http://localhost:3000/recipes/${array[index]}`)
        .then(resp => resp.json())
        .then(data => renderRecipe(data))
    }
}

function addLike(e){
    if (e.target.textContent === " YUM "){
        console.log(e.target.nextSibling)
        newLikes = parseInt(e.target.dataset.likes) + 1;
        e.target.dataset.likes = newLikes;
        e.target.nextSibling.dataset.likes = newLikes;
        let newHearts = {hearts: (e.target.dataset.likes)};
        fetch(`http://localhost:3000/recipes/${e.target.dataset.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newHearts)
        })
        .then(resp => resp.json())
        .then(data => {
            e.target.previousSibling.textContent = `${data.hearts} likes`
        })
    } else if (e.target.textContent === " EW "){
        console.log(e.target.previousSibling)
        newLikes = parseInt(e.target.dataset.likes) - 1;
        e.target.dataset.likes = newLikes;
        e.target.previousSibling.dataset.likes = newLikes;
        let newHearts = {hearts: (e.target.dataset.likes)};
        fetch(`http://localhost:3000/recipes/${e.target.dataset.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newHearts)
        })
        .then(resp => resp.json())
        .then(data => {
            e.target.previousSibling.previousSibling.textContent = `${data.hearts} likes`
        })
    }
}

function addInput(e) {
    let newInput = document.createElement('input');
    newInput.type = "text";
    newInput.className = "ingredients";
    newInput.name = "ingredients";
    ingredForm.append(newInput);
}

function addRecipe(e) {
    e.preventDefault()
    let newIngre = []
    e.target.ingredients.forEach(index => newIngre.push(index.value))
    let newRecipe = {
        name: e.target.name.value,
        image: e.target.image.value,
        "recipe-url": e.target.recipeUrl.value,
        hearts: 0,
        ingredients: newIngre
    }
    fetch("http://localhost:3000/recipes", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRecipe)
    })
    .then(resp => resp.json())
    .then(data => {
        renderRecipe(data);
        renderDropdown();
    })
}

function renderDropdown() {
    ingredDropdown.innerHTML = "";
    let blank = document.createElement('option');
    blank.setAttribute('selected', 'selected');
    blank.setAttribute('disabled', 'disabled');
    blank.setAttribute('hidden', 'hidden');
    ingredDropdown.append(blank);

    let uniqueIngredients = [...new Set(ingredientsArray)];
    uniqueIngredients = uniqueIngredients.sort();
    uniqueIngredients.forEach(ingred => {
        let newIngred = document.createElement('option');
        newIngred.value = ingred;
        newIngred.textContent = ingred;
        ingredDropdown.append(newIngred);
    })
}