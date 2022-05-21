//import { all } from 'core-js/fn/promise';
//import { async } from 'regenerator-runtime';
import { API_URL, KEY } from './views/config';
//import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers';
import { RES_PER_PAGE } from './views/config';
import { async } from 'regenerator-runtime';
//this state object contains the information the controller is requesting
//it will be exported out to the controller
export const state = {
  bookmarks: [],
  recipe: {},
  search: {
    queury: '',
    results: [],
    page: 1, //setting the page to 1 by default
    resultsperpage: RES_PER_PAGE,
  },
};

const createRecipeObject = function (data) {
  let { recipe } = data.data; //.recipe; since the object name inside data
  //is recipe, you can destructure it on the left hand side since its
  //the same name
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(
      //`https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886`
      `${API_URL}/${id}?key=${KEY}`
    );

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmark = true;
    else state.recipe.bookmark = false;
    console.log(state.recipe);
  } catch (err) {
    console.error(`${err}💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.queury = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
    console.log(state.search.results);
  } catch (err) {
    console.log(`${err} 💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RES_PER_PAGE; //0
  const end = page * RES_PER_PAGE; //9
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  console.log(state.recipe.servings);

  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //newQt = oldQt * newServings/oldServings// 2*8/4=4
  });

  console.log(state.recipe.ingredients);
  state.recipe.servings = newServings; //updating recipe servings in object
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Add bookmarks
  state.bookmarks.push(recipe);

  console.log(state.bookmarks);

  //Mark current recipe as boookmark
  if (recipe.id === state.recipe.id /*(the recipe rendered to the view)*/)
    state.recipe.bookmark = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmark = false;

  persistBookmarks(); //you call it again so it adds only whats in the bookmarks
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
//console.log(state.bookmarks);
//clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  console.log(Object.entries(newRecipe));
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        //const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    console.log(data);
  } catch (err) {
    throw err;
  }
};
