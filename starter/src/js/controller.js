import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './views/config.js';
import recipeview from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import previewView from './views/previewView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable'; //polyfilling async await
import 'regenerator-runtime/runtime'; //polyfilling everything esle
//console.log(icons);
console.log('hey');
const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

////////////////////////////////////////////////////////////////////////////////
if (module.hot) {
  module.hot.accept();
}
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); //gets the hash number in
    //the url and extracts everything after the hash and stores it in
    //id varible
    console.log(id);
    if (!id) return;
    recipeview.renderSpinner();
    ///BUSINESS LOGIC, WAS MOVED TO THE MODEL.JS
    /* const res = await fetch(
      //`https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886`
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    console.log(res, data);
    //create a new object bso you can change the property name
    let { recipe } = data.data; //.recipe; since the object name inside data
    //is recipe, you can destructure it on the left hand side since its
    //the same name

    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(recipe);
*/ //0) Update results view to highlighted selected search result
    resultsView.update(model.getSearchResultsPage());
    //3)  updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    //1) Loading recipe
    await model.loadRecipe(id); //load recipe is an async function so we
    //need to await

    //2) Rendering recipe
    recipeview.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeview.renderError();
  }
};
//controlRecipes();

//window.addEventListener('hashchange', controlRecipes); //listen for hash
//change, everything after the hash in the url, the call the
//show recipe function
//window.addEventListener('load', controlRecipes); //listen for a load nd call the
//show recipe function, this allows so that you can copy link and paste
//in anoda browser and it works
console.log('hey');
console.log('hey mama');

//components of any architecture
//Business logic:- code that solves the actual business problem
//directly related to what the business does and what it needs. e.g sending
//messages,storing transc,calculating taxes

//state
//-Essentially stores
//http library
//application logic(router)
//presentation logic(UI layer)

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    console.log(resultsView);
    console.log('hey');
    console.log('adaeze');
    //1) Get search query
    const query = searchView.getQuery();
    if (!query) return;
    //2) load search results
    await model.loadSearchResults(query);
    //3) render results
    console.log(model.state.search.results);
    //resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    //4 Render initial pagination buttons

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

//this is the handler function in the pagination view. its called with the goto data set
const controlPagination = function (goToPage) {
  //render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //4 Render initial pagination buttons

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);

  //update the recipe view
  //recipeview.render(model.state.recipe); //you render again the recipeview becauce the servings has just been
  //updated in the model
  recipeview.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) Add/remove bookmark
  if (!model.state.recipe.bookmark)
    model.addBookmark(model.state.recipe); //you only want to add a bookmark
  //if there isnt a bookmark
  else model.deleteBookmark(model.state.recipe.id);

  //2) Update recipe view
  recipeview.update(model.state.recipe);

  //3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //Render Recipe
    recipeview.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView.togglewindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);

    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeview.addHandlerRender(controlRecipes);
  recipeview.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeview.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  console.log('welcom');
};
init();

console.log('Hello world');
