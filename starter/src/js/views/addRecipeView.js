import View from './View';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded'
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowindow();
    this._addHandlerHideWindow();
  }

  togglewindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHandlerShowindow() {
    this._btnOpen.addEventListener(
      'click',
      this.togglewindow.bind(this)
      //this._overlay.classList.toggle('hidden'); the this keywor will point to the element so create
      //anoda function to bind the this keyword to the object
      //this._window.classList.toggle('hidden');
    );
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.togglewindow.bind(this));
    this._overlay.addEventListener('click', this.togglewindow.bind(this));
  }

  _addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      const dataArr = [...new FormData(this)]; //the FormData construct retrieves all values in a form, it should be
      //spread in an array so it can be readable
      const data = Object.fromEntries(dataArr); //takes an array of enteries and turn it to an object
      handler(data); //this data will be uploased to API
    });
  }
  _generateMarkup() {}
}
export default new AddRecipeView();
