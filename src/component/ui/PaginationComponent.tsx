import React from 'react'
import { Pagination } from 'react-bootstrap';
import { PaginationType } from '../../definitions/ComponentType';

export default function PaginationComponent({ currentPage, totalPages, handlePageChange }: PaginationType) {
    const maxPagesToShow = 5; // Nombre maximum de pages à afficher avant d'ajouter des ellipses
  
    const renderPaginationItems = () => {
      let pages = [];
  
      if (totalPages <= maxPagesToShow) {
        // Si le nombre de pages est inférieur au max, afficher toutes les pages
        for (let number = 1; number <= totalPages; number++) {
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
      } else {
        // Si le nombre de pages dépasse maxPagesToShow, afficher les ellipses
        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(currentPage + 1, totalPages);
  
        // Toujours afficher la première page
        pages.push(
          <Pagination.Item
            key={1}
            active={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </Pagination.Item>
        );
  
        // Ajouter une ellipse si nécessaire avant la page actuelle
        if (startPage > 2) {
          pages.push(<Pagination.Ellipsis key="start-ellipsis" />);
        }
  
        // Afficher les pages proches de la page actuelle
        for (let number = startPage; number <= endPage; number++) {
          if (number !== 1 && number !== totalPages) {
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
        if (endPage < totalPages - 1) {
          pages.push(<Pagination.Ellipsis key="end-ellipsis" />);
        }
  
        // Toujours afficher la dernière page
        pages.push(
          <Pagination.Item
            key={totalPages}
            active={currentPage === totalPages}
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
          disabled={currentPage === 1}
        />
        {renderPaginationItems()}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
}

