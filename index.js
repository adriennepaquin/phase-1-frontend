const recipeCards = document.querySelector('#card-container');
const filter = document.querySelector('#selector');

filter.addEventListener('change', filterRecipes);

recipeCards.addEventListener('click', addLike);

fetchRecipes()

function fetchRecipes(){
    
    return fetch("http://localhost:3000/recipes")
    .then(res => res.json())
    .then(renderRecipes);
}

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

    recipeDiv.className = "cards";
    title.textContent = recipe.name;
    image.src = recipe.image;
    link.href = recipe["recipe-url"];
    link.textContent = "Click here for recipe!"
    likeBtn.textContent = " YUM ";
    likeBtn.dataset.id = recipe.id
    likeBtn.dataset.likes = recipe.hearts
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
    fetch("http://localhost:3000/recipes")
    .then(res => res.json())
    .then(filterFunction)

    function filterFunction(data) {
        filteredArray = [];
        data.forEach(recipe => {
            if(recipe.ingredients.indexOf(e.target.value)>=0) {
                // console.log(recipe.id)
                filteredArray.push(recipe.id);
            }
        })
        filterFetch(filteredArray)
    }
}
function filterFetch(array){
    recipeCards.textContent = ""
    for (index in array){
        fetch(`http://localhost:3000/recipes/${array[index]}`)
        .then(resp => resp.json())
        .then(data => renderRecipe(data))
    }
}
function addLike(e){
    //console.log(e.target)
    if (e.target.textContent === " YUM "){
        e.target.dataset.likes = parseInt(e.target.dataset.likes) + 1
        let newHearts = {hearts: (e.target.dataset.likes)}
        //console.log(newHearts)
        fetch(`http://localhost:3000/recipes/${e.target.dataset.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newHearts)
        })
        .then(resp => resp.json())
        .then((data) => {
            //recipeCards.textContent = ""
            e.target.previousSibling.textContent = `${data.hearts} likes`
            //renderRecipe(data)
            //fetchRecipes()

        })
    }
}