import React from 'react'
import { Pagination } from 'react-bootstrap';

export default function PaginationComponentConnaiss({ intiPage, currentPage, totalPages, handlePageChange }: any) {
    const maxPagesToShow = 5; // Nombre maximum de pages à afficher avant d'ajouter des ellipses
  
    const renderPaginationItems = () => {
      let pages = [];
  
      if (totalPages <= maxPagesToShow) {
        // Si le nombre de pages est inférieur au max, afficher toutes les pages
        for (let number = intiPage; number <= totalPages; number++) {
          pages.push(
            <Pagination.Item
              key={number}
              active={number === currentPage}
              onClick={() => handlePageChange(number)}
            >
              {intiPage === 0 ? number + 1 : number}
            </Pagination.Item>
          );
        }
      } else {
        // Si le nombre de pages dépasse maxPagesToShow, afficher les ellipses
        const startPage = Math.max(intiPage, currentPage - 1);
        const endPage = Math.min(currentPage + 1, intiPage === 0 ? totalPages - 1 : totalPages);
  
        // Toujours afficher la première page
        pages.push(
          <Pagination.Item
            key={intiPage}
            active={currentPage === intiPage}
            onClick={() => handlePageChange(intiPage)}
          >
            1
          </Pagination.Item>
        );
  
        // Ajouter une ellipse si nécessaire avant la page actuelle
        if (intiPage === 0 ? startPage > 1  : startPage > 2) {
          pages.push(<Pagination.Ellipsis key="start-ellipsis" />);
        }
  
        // Afficher les pages proches de la page actuelle
        for (let number = startPage; number <= endPage; number++) {
          if (number !== intiPage && intiPage === 0 ? number !== totalPages - 1 : number !== totalPages) {
            pages.push(
              <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </Pagination.Item>
            );
          }
        }
   
  
        // Ajouter une ellipse si nécessaire après la page actuelle
        if (intiPage === 0 ? endPage < totalPages - 2 : endPage < totalPages - 1) {
          pages.push(<Pagination.Ellipsis key="end-ellipsis" />);
        }
  
        // Toujours afficher la dernière page
        pages.push(
          <Pagination.Item
            key={intiPage === 0 ? totalPages - 1 : totalPages}
            active={intiPage === 0 ? currentPage === totalPages - 1 : currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </Pagination.Item>
        );
      }
  
      return pages;
    };
  
    return (
      <Pagination>
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={intiPage === 0 ? currentPage === 0 : currentPage === 1}
        />
        {renderPaginationItems()}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={intiPage === 0 ?  currentPage === totalPages -1 : currentPage === totalPages}
        />
      </Pagination>
    );
}

