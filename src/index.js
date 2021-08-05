'use strict';

// import 'regenerator-runtime/runtime';
import './css/styles.css';
import NewsApiService from './newsApiService' 
import Notiflix from 'notiflix';
import card from './templates/card.hbs';

const searchForm = document.querySelector('.search-form');
const galleryCards = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.classList.add('is-hidden');

searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoad);

const newsApiService = new NewsApiService();

async function onSubmit(evt){
    evt.preventDefault();

    newsApiService.resetPage();
    newsApiService.query = evt.currentTarget.elements.searchQuery.value;
    
    loadMoreBtn.classList.remove('is-hidden');
    
    try {
            const result = await newsApiService.fetchArticles();
            
            if (newsApiService.query.trim() === '' || result.hits.length === 0){    
                clearCardsContainer();
                loadMoreBtn.classList.add('is-hidden');
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            }
            else {
                loadMoreBtn.classList.remove('is-hidden');

                Notiflix.Notify.success(`"Hooray! We found ${result.totalHits} images."`);
                clearCardsContainer();
                appendMarkup(result.hits);
                }
            }
            catch (error) {
            console.log(error);
            }
}


async function onLoad (){
    try { 
        loadMoreBtn.disabled = true;

        const result = await newsApiService.fetchArticles();
        appendMarkup(result.hits);

        loadMoreBtn.disabled = false;

        const lenghtHits = galleryCards.querySelectorAll('.photo-card').length;
      
        
        if (lenghtHits >= result.totalHits) {
            
            Notiflix.Notify.failure('"We are sorry, but you have reached the end of search results."');
            loadMoreBtn.classList.add('is-hidden');
        } 

    }
        catch (error){
            console.log(error)
        }
       
    } 
    



function appendMarkup(data) {
//     // console.log(data);
    // result = data.map(card).join('');
    // console.log(result);
   galleryCards.insertAdjacentHTML('beforeend', card(data));
};

function clearCardsContainer () {
    galleryCards.innerHTML = '';
}



