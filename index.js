const recipeCards = document.querySelector('#card-container');

fetch("http://localhost:3000/recipes")
.then(res => res.json())
.then(renderRecipes);

function renderRecipes(recipesObj) {
    console.log(recipesObj);
    recipesObj.forEach(recipe => renderRecipe(recipe));
}

function renderRecipe(recipe) {
    console.log(recipe["recipe-url"])
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
        console.log(ingredient)
        let ingredLi = document.createElement('li');
        ingredLi.textContent = ingredient;
        ingredUl.append(ingredLi);
    })
}