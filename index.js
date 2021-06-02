const recipeCards = document.querySelector('#card-container');
const filter = document.querySelector('#selector');

filter.addEventListener('change', filterRecipes)

fetch("http://localhost:3000/recipes")
.then(res => res.json())
.then(renderRecipes);

function renderRecipes(recipesObj) {
    // console.log(recipesObj);
    recipesObj.forEach(recipe => renderRecipe(recipe));
}

function renderRecipe(recipe) {
    // console.log(recipe["recipe-url"])
    let recipeDiv = document.createElement('div');
    let title = document.createElement('h3');
    let image = document.createElement('img')
    let ingredUl = document.createElement('ul');
    let link = document.createElement('a');
    let likeDiv = document.createElement('div');
    let likeBtn = document.createElement('button');
    let likes = document.createElement('p');

    recipeDiv.className = "cards"
    title.textContent = recipe.name;
    image.src = recipe.image;
    link.href = recipe["recipe-url"];
    link.textContent = "Click here for recipe!"
    likeBtn.textContent = " YUM ";
    likes.textContent = `${recipe.hearts} likes`;

    likeDiv.append(likes, likeBtn);
    recipeDiv.append(title, image, link, ingredUl, likeDiv);
    recipeCards.append(recipeDiv);

    recipe.ingredients.forEach(ingredient => {
        let ingredLi = document.createElement('li');
        ingredLi.textContent = ingredient;
        ingredUl.append(ingredLi);
    })
}

function filterRecipes(e) {
    // console.log(e.target.value);
    // filter through recipe.ingredients on each recipe
    let recipeArray = [];
    fetch("http://localhost:3000/recipes")
    .then(res => res.json())
    .then(data => {
        data.forEach(recipe => {
            recipeArray.push(recipe.ingredients.filter(ingred => ingred === e.target.value))
            // console.log(recipeArray);
        })
        recipeArray.forEach(recipe => {
            if (recipe.length > 0) {
                return 
            } 
        })
    });
    // return id
}