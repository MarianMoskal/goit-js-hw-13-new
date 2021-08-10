'use strict';

import './css/styles.css';
import 'tui-pagination/dist/tui-pagination.min.css';
import Pagination from 'tui-pagination';
import { optionsForPagination } from './js/options';
import NewsApiService from './js/newsApiService';
import Notiflix from 'notiflix';
import card from './templates/card.hbs';

const itemsPerPage = 40;
const searchForm = document.querySelector('.search-form');
const galleryCards = document.querySelector('.gallery');
const container = document.getElementById('tui-pagination-container');
const opt = optionsForPagination;
const setContainerHidden = (arg) => { container.hidden = arg; };
const newsApiService = new NewsApiService();

let myPagination;


function pagination() {
     myPagination = new Pagination(container, opt);
    return myPagination;
};

setContainerHidden(true);
newsApiService.itemsPerPage = itemsPerPage;

searchForm.addEventListener('submit', onSubmit);

async function onSubmit(evt){
    evt.preventDefault();
    newsApiService.resetPage();
    newsApiService.query = evt.currentTarget.elements.searchQuery.value;
    
    try {
        const result = await newsApiService.fetchArticles();

        opt.totalItems = result.totalHits;
        opt.page = newsApiService.page;

        pagination();
            
        if (newsApiService.query.trim() === '' || result.hits.length === 0)
            {
            clearCardsContainer();
            setContainerHidden(true);
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            }
        else {
                if (result.totalHits > itemsPerPage) {
                      setContainerHidden(false);
                    };

                Notiflix.Notify.success(
                    `"Hooray! We found ${result.totalHits} images."`
                );

                clearCardsContainer();
                appendMarkup(result.hits);

                myPagination.on('afterMove', function (eventData) {
                        newsApiService.page = eventData.page;
                        onLoadPages()
                    });
                }
            }
    catch (error) {
            console.log(error);
        }
};


async function onLoadPages (){
    try { 
        clearCardsContainer();

        const result = await newsApiService.fetchArticles();

        appendMarkup(result.hits);
        }
    
    catch (error){
            console.log(error)
        }
};
    

function appendMarkup(data) {
   galleryCards.insertAdjacentHTML('beforeend', card(data));
};

function clearCardsContainer () {
    galleryCards.innerHTML = '';
};



