import React from 'react';
import { Pagination } from 'react-bootstrap';

export default function PaginationZero({ currentPage, totalPages, handlePageChange }: any) {
    const maxPagesToShow = 5; // Nombre maximum de pages à afficher avant d'ajouter des ellipses
  
    const renderPaginationItems = () => {
      let pages = [];
  
      if (totalPages <= maxPagesToShow) {
        // Si le nombre de pages est inférieur au max, afficher toutes les pages
        for (let number = 0; number < totalPages; number++) {
          pages.push(
            <Pagination.Item
              key={number}
              active={number === currentPage}
              onClick={() => handlePageChange(number)}
            >
              {number + 1} {/* Afficher 1 pour la page 0 */}
            </Pagination.Item>
          );
        }
      } else {
        // Si le nombre de pages dépasse maxPagesToShow, afficher les ellipses
        const startPage = Math.max(0, currentPage - 1); // Première page à afficher
        const endPage = Math.min(currentPage + 1, totalPages - 1); // Dernière page à afficher
  
        // Toujours afficher la première page
        pages.push(
          <Pagination.Item
            key={0}
            active={currentPage === 0}
            onClick={() => handlePageChange(0)}
          >
            1 {/* Afficher 1 pour la page 0 */}
          </Pagination.Item>
        );
  
        // Ajouter une ellipse si nécessaire avant la page actuelle
        if (startPage > 1) {
          pages.push(<Pagination.Ellipsis key="start-ellipsis" />);
        }
  
        // Afficher les pages proches de la page actuelle
        for (let number = startPage; number <= endPage; number++) {
          if (number !== 0 && number !== totalPages - 1) {
            pages.push(
              <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => handlePageChange(number)}
              >
                {number + 1} {/* Afficher les numéros en partant de 1 */}
              </Pagination.Item>
            );
          }
        }
  
        // Ajouter une ellipse si nécessaire après la page actuelle
        if (endPage < totalPages - 2) {
          pages.push(<Pagination.Ellipsis key="end-ellipsis" />);
        }
  
        // Toujours afficher la dernière page
        pages.push(
          <Pagination.Item
            key={totalPages - 1}
            active={currentPage === totalPages - 1}
            onClick={() => handlePageChange(totalPages - 1)}
          >
            {totalPages} {/* Afficher le numéro réel */}
          </Pagination.Item>
        );
      }
  
      return pages;
    };
  
    return (
      <Pagination>
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        />
        {renderPaginationItems()}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        />
      </Pagination>
    );
}
