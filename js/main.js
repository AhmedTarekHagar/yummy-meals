

//#region ***** navbar *****

function closeNavbar() {
    $('.navbarContent').addClass('navbarContent-hide');
    $('.navbarControls').animate({ left: "0%" }, 500);
    $('#navbarButton').text('🍔');
    setTimeout(() => {
        $('.side-nav').css('z-index', '0');
    }, 1000);
}

$('#navbarButton').on('click', function () {
    if ($('.navbarControls').css('left') != '0px') {
        closeNavbar();
    } else {
        $('.navbarContent').removeClass('navbarContent-hide');
        $('.navbarControls').animate({ left: "75%" }, 1000);
        $('#navbarButton').text('X');
        $('.side-nav').css('z-index', '5000');
    }
})

//#endregion

//#region ***** search meals *****

function displayMeals(meals) {
    let content = ``;
    meals.forEach(meal => {
        content += `
                    <div class="item col-lg-3 col-md-4 overflow-hidden p-0 rounded-4">
                        <div onclick="getMealDetailsById(${meal.idMeal})" class="inner position-relative m-3 overflow-hidden rounded-4">
                            <img src="${meal.strMealThumb}" class="w-100" alt="${meal.strInstructions}">
                            <div class="layer position-absolute bg-secondary-custom d-flex align-items-center rounded-4">
                                <span class="text-main ps-3 fs-3 fw-bold">${meal.strMeal}</span>
                            </div>
                        </div>
                    </div>
        `;
    });
    $('#rowContent').html(content);
}

function displayNoMeals() {

    let content = `
                    <div class="item col-12 overflow-hidden p-0 rounded-4">
                        <div class="inner position-relative m-3 overflow-hidden rounded-4 text-danger text-center fw-bolder">
                            NO MEALS
                        </div>
                    </div>
        `;

    $('#rowContent').html(content);
}

async function getMeals(searchValue = '') {
    $('.loader').parent().removeClass('d-none');
    let req = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`);
    let response = await req.json();
    if (response.meals == null) {
        displayNoMeals();
    } else {
        displayMeals(response.meals);
    }
    $('.loader').parent().addClass('d-none');
}

getMeals();

//#endregion

//#region ***** meal details *****

function displayMealDetails(mealDetails) {

    let ingredients = ``;

    for (let i = 1; i <= 20; i++) {
        if (mealDetails[`strIngredient${i}`]) {
            ingredients += `<span class="bg-secondary-custom text-main badge m-2 p-1">${mealDetails[`strMeasure${i}`]} ${mealDetails[`strIngredient${i}`]}</span>`
        }
    }

    let mealTags = mealDetails.strTags?.split(',');

    if (!mealTags) {
        mealTags = [];
    }

    let tagsElements = ``;

    for (let i = 0; i < mealTags.length; i++) {
        tagsElements += `
                        <span class="bg-secondary-custom text-main badge m-2 p-1">${mealTags[i]}</span>
                        `;
    }

    let content = `
                    <div class="col-md-4">
                    <img class="w-100 rounded-4 mb-3" src="${mealDetails.strMealThumb}" alt="${mealDetails.strInstructions}">
                    <h2 class="ps-3 fs-1 fw-bold">${mealDetails.strMeal}</h2>
                </div>
                <div class="col-md-7 ms-5">
                    <p class="fs-3 fw-bold">Instructions:</p>
                    <p>${mealDetails.strInstructions}</p>
                    <h2>Area: <span>${mealDetails.strArea}</span></h2>
                    <h2>Category: <span>${mealDetails.strCategory}</span></h2>
                    <h3>Recipes:</h3>
                    <div class="d-flex flex-wrap">
                    ${ingredients}
                    </div>
                    <h3>Tags</h3>
                    <div>
                    ${tagsElements}
                    </div>
                    <a href="${mealDetails.strSource ? mealDetails.strSource : '#'}" class="btn btn-success" target="_blank">Source</a>
                    <a href="${mealDetails.strYoutube ? mealDetails.strYoutube : '#'}" class="btn btn-danger" target="_blank">Youtube</a>

                    <button type="button" class="btn btn-danger position-absolute top-0 end-0 me-3 mt-3" onclick="getMeals()">Close</button>
                </div>
    `;

    $('#rowContent').html(content);
}

async function getMealDetailsById(mealId) {
    $('.loader').parent().removeClass('d-none');
    let req = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    let respone = await req.json();
    displayMealDetails(respone.meals[0]);
    $('.loader').parent().addClass('d-none');
}

//#endregion

// #region ***** categories *****

function displayCategories(categories) {
    let content = ``;

    categories.forEach(category => {
        content += `
                    <div class="item col-lg-3 col-md-4 overflow-hidden p-0 rounded-4">
                        <div onclick="getMealsbyCategory('${category.strCategory}')" class="inner position-relative m-3 overflow-hidden rounded-4">
                            <img src="${category.strCategoryThumb}" class="w-100" alt="${category.strCategoryDescription}">
                                <div class="layer position-absolute bg-secondary-custom text-center rounded-4">
                                    <span class="text-main ps-3 fs-3 fw-bold">${category.strCategory}</span>
                                    <p class="text-main">${category.strCategoryDescription}</p>
                                </div>
                        </div>
                    </div>
    `;
    })

    $('#rowContent').html(content);
}

async function getAllCategories() {
    $('.loader').parent().removeClass('d-none');
    closeNavbar();
    let req = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let response = await req.json();
    displayCategories(response.categories);
    $('.loader').parent().addClass('d-none');
}

// #endregion

// #region ***** meals by category ******

function displayCategoryMeals(categoryMeals) {
    let content = ``;

    categoryMeals.forEach(meal => {
        content += `
        <div class="item col-lg-3 col-md-4 overflow-hidden p-0 rounded-4">
        <div onclick="getMealDetailsById(${meal.idMeal})" class="inner position-relative m-3 overflow-hidden rounded-4">
            <img src="${meal.strMealThumb}" class="w-100" alt="${meal.strMeal}">
            <div class="layer position-absolute bg-secondary-custom d-flex align-items-center rounded-4">
                <span class="text-main ps-3 fs-3 fw-bold">${meal.strMeal}</span>
            </div>
        </div>
    </div>
        `;
    });

    $('#rowContent').html(content);
}

async function getMealsbyCategory(category) {
    $('.loader').parent().removeClass('d-none');
    let req = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    let response = await req.json();

    displayCategoryMeals(response.meals);
    $('.loader').parent().addClass('d-none');
}

// #endregion

// #region ***** areas *****

function displayAreas(areas) {
    let content = ``;

    areas.forEach(area => {
        content += `
            <div class="item col-lg-3 col-md-4 overflow-hidden p-0 rounded-4 cursor-pointer">
                <div onclick="getMealsByArea('${area.strArea}')" class="position-relative m-3 overflow-hidden rounded-4">
                <i class="fa-solid fa-house fs-1"></i>
                <p>${area.strArea}</p>
                </div>
            </div>
        `;
    });

    $('#rowContent').html(content);
}

async function getAreas() {
    $('.loader').parent().removeClass('d-none');
    closeNavbar();
    let req = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let respone = await req.json();
    displayAreas(respone.meals);
    $('.loader').parent().addClass('d-none');
}

// #endregion

// #region ***** meals by area *****

function displayMealsByArea(areaMeals) {
    let content = ``;

    areaMeals.forEach(meal => {
        content += `
                
    <div class="item col-lg-3 col-md-4 overflow-hidden p-0 rounded-4">
    <div onclick="getMealDetailsById(${meal.idMeal})" class="inner position-relative m-3 overflow-hidden rounded-4">
        <img src="${meal.strMealThumb}" class="w-100" alt="${meal.strInstructions}">
        <div class="layer position-absolute bg-secondary-custom d-flex align-items-center rounded-4">
            <span class="text-main ps-3 fs-3 fw-bold">${meal.strMeal}</span>
        </div>
    </div>
</div>
        `;
    });

    $('#rowContent').html(content);
}

async function getMealsByArea(area) {
    $('.loader').parent().removeClass('d-none');
    let req = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    let response = await req.json();
    displayMealsByArea(response.meals);
    $('.loader').parent().addClass('d-none');
}

// #endregion

// #region ***** ingredients *****

function displayIngredients(ingredients) {
    let content = ``;


    ingredients.forEach(ingredient => {
        content += `
            <div class="item col-lg-3 col-md-4 overflow-hidden p-0 rounded-4 cursor-pointer">
                <div onclick="getMealsByIgredients('${ingredient.strIngredient}')" class="position-relative m-3 overflow-hidden rounded-4">
                <i class="fa-solid fa-bowl-food fs-1"></i>
                <p>${ingredient.strIngredient}</p>
                </div>
            </div>
        `;
    });

    $('#rowContent').html(content);
}

async function getIngredients() {
    $('.loader').parent().removeClass('d-none');
    closeNavbar();
    let req = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    let response = await req.json();
    displayIngredients(response.meals);
    $('.loader').parent().addClass('d-none');
}

// #endregion

// #region ***** meals by ingredient *****

function displayMealsByMainIngredient(meals) {
    let content = ``;

    meals.forEach(meal => {
        content += `
            
        <div class="item col-lg-3 col-md-4 overflow-hidden p-0 rounded-4">
        <div onclick="getMealDetailsById(${meal.idMeal})" class="inner position-relative m-3 overflow-hidden rounded-4">
            <img src="${meal.strMealThumb}" class="w-100" alt="${meal.strInstructions}">
            <div class="layer position-absolute bg-secondary-custom d-flex align-items-center rounded-4">
                <span class="text-main ps-3 fs-3 fw-bold">${meal.strMeal}</span>
            </div>
        </div>
    </div>
        `;
    });

    $('#rowContent').html(content);
}

async function getMealsByIgredients(mainIngredient) {
    $('.loader').parent().removeClass('d-none');
    let req = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngredient}`);
    let response = await req.json();
    displayMealsByMainIngredient(response.meals);
    $('.loader').parent().addClass('d-none');
}

// #endregion

// #region ***** Search *****

$('#searchInputs input').slideUp(0);
$('#closeSearch').slideUp(0);

function displaySearchInputs() {
    closeNavbar();
    $('#closeSearch').slideDown(1000);
    $('#searchInputs input').slideDown(1000);
}

function closeSearch() {
    $('#searchInputs input').slideUp(1000);
    $('#closeSearch').slideUp(1000);
}

function trimInput() {
    inputElement = document.getElementById('SearchByFirstLetter');
    if (inputElement.value.length > 1) {
        inputElement.value = inputElement.value.substring(0, 1);
    }
}

document.getElementById('SearchByFirstLetter').addEventListener('input', trimInput)

// #endregion

//#region ***** contact *****

function contactUs() {

    closeNavbar();
    closeSearch();

    setTimeout(() => {
        $('#rowContent').css('z-index', '500000000');
    }, 1000);

    let content = `
    <div class="col-md-4 mx-4">
            <input class="form-control py-4 bg-transparent focus-ring focus-ring-warning mb-3" type="text" id="userName" placeholder="Enter Your Name">
            <div id="nameAlert" class="alert alert-warning d-none" role="alert">
                Cannot Be Empty!
            </div>
        </div>
        <div class="col-md-4 mx-4">
            <input class="form-control py-4 bg-transparent focus-ring focus-ring-warning mb-3" type="email" id="userMail" placeholder="Enter Your Email">
            <div id="emailAlert" class="alert alert-warning d-none" role="alert">
                Enter a valid email
            </div>
        </div>
        <div class="col-md-4 mx-4">
            <input class="form-control py-4 bg-transparent focus-ring focus-ring-warning mb-3" type="tel" id="userPhone" placeholder="Enter Your Phone Number">
            <div id="phoneAlert" class="alert alert-warning d-none" role="alert">
                Enter a valid Phone Number
            </div>
        </div>
        <div class="col-md-4 mx-4">
            <input class="form-control py-4 bg-transparent focus-ring focus-ring-warning mb-3" type="number" id="userAge" placeholder="Enter Your Age">
            <div id="ageAlert" class="alert alert-warning d-none" role="alert">
                Enter a valid Age between 18 - 100
            </div>
        </div>
        <div class="col-md-4 mx-4">
            <input class="form-control py-4 bg-transparent focus-ring focus-ring-warning mb-3" type="password" id="userPassword" placeholder="Enter Your Password">
            <div id="passwordAlert" class="alert alert-warning d-none" role="alert">
                password must be between 8 to 16 charachters with one letter and one number
            </div>
        </div>
        <div class="col-md-4 mx-4">
            <input class="form-control py-4 bg-transparent focus-ring focus-ring-warning mb-3" type="password" id="userPasswordConfirm" placeholder="Enter Your Password">
            <div id="confirmPasswordAlert" class="alert alert-warning d-none" role="alert">
                password doesn't match
            </div>
        </div>
        <div class="col-9">
            <button id="submitButton" type="button" class="btn btn-danger d-block w-auto mx-auto" disabled>Submit</button>
        </div>
    `;

    $('#rowContent').html(content);


    document.querySelectorAll('input').forEach(element => {
        element.addEventListener('input', validateAll);
    });
}

function validateAll() {
    if (!nameValidation()) {
        document.getElementById('nameAlert').classList.remove('d-none');
    } else {
        document.getElementById('nameAlert').classList.add('d-none');
    }
    if (!emailValidation()) {
        document.getElementById('emailAlert').classList.remove('d-none');
    } else {
        document.getElementById('emailAlert').classList.add('d-none');
    }
    if (!phoneValidation()) {
        document.getElementById('phoneAlert').classList.remove('d-none');
    } else {
        document.getElementById('phoneAlert').classList.add('d-none');
    }
    if (!ageValidation()) {
        document.getElementById('ageAlert').classList.remove('d-none');
    } else {
        document.getElementById('ageAlert').classList.add('d-none');
    }
    if (!passwordValidation()) {
        document.getElementById('passwordAlert').classList.remove('d-none');
    } else {
        document.getElementById('passwordAlert').classList.add('d-none');
    }
    if (!passwordConfirmValidation()) {
        document.getElementById('confirmPasswordAlert').classList.remove('d-none');
    } else {
        document.getElementById('confirmPasswordAlert').classList.add('d-none');
    }

    if (nameValidation() && emailValidation() && phoneValidation() && ageValidation() && passwordValidation() && passwordConfirmValidation()) {
        document.getElementById('submitButton').disabled = false;
    } else {
        document.getElementById('submitButton').disabled = true;
    }
}

function nameValidation() {
    return (/^[a-zA-Z0-9]{3,}$/.test(document.getElementById('userName').value))
}

function emailValidation() {
    return (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(document.getElementById('userMail').value))
}

function phoneValidation() {
    return (/^01[1205]\d{8}$/.test(document.getElementById('userPhone').value))
}

function ageValidation() {
    return (/^(1[89]|[2-9][0-9]|100)$/.test(document.getElementById('userAge').value))
}

function passwordValidation() {
    return (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(document.getElementById('userPassword').value))
}

function passwordConfirmValidation() {
    return document.getElementById('userPasswordConfirm').value == document.getElementById('userPassword').value
}
//#endregion

