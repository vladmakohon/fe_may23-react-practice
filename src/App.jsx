/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import classNames from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(categoryFromServer => (
    categoryFromServer.id === product.categoryId
  )) || null;
  const user = usersFromServer.find(userFromServer => (
    userFromServer.id === category.ownerId
  )) || null;

  return {
    ...product,
    category,
    user,
  };
});

const getPreparedProducts = (
  allProducts,
  userIdFilter,
  nameFilter,
  categoriesIdFilter,
) => {
  let preparedGoods = [...allProducts];

  if (userIdFilter) {
    preparedGoods = preparedGoods
      .filter(product => product.user.id === userIdFilter);
  }

  if (nameFilter) {
    const normalizedNameFilter = nameFilter.trim().toLowerCase();

    preparedGoods = preparedGoods.filter(product => (
      product.name.toLowerCase().includes(normalizedNameFilter)
    ));
  }

  if (categoriesIdFilter.length !== 0) {
    preparedGoods = preparedGoods
      .filter(product => categoriesIdFilter.includes(product.categoryId));
  }

  return preparedGoods;
};

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const visibleProducts = getPreparedProducts(
    products,
    selectedUserId,
    query,
    selectedCategories,
  );

  const resetAllFilters = () => {
    setSelectedUserId(0);
    setQuery('');
    setSelectedCategories([]);
  };

  const selectCategory = (categoryIdToAdd) => {
    setSelectedCategories([
      ...selectedCategories,
      categoryIdToAdd,
    ]);
  };

  const unselectCategory = (categoryIdToRemove) => {
    setSelectedCategories(
      selectedCategories
        .filter(categoryId => categoryId !== categoryIdToRemove),
    );
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                onClick={() => setSelectedUserId(0)}
                data-cy="FilterAllUsers"
                href="#/"
                className={classNames({
                  'is-active': selectedUserId === 0,
                })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  onClick={() => setSelectedUserId(user.id)}
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({
                    'is-active': user.id === selectedUserId,
                  })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  onChange={event => setQuery(event.target.value)}
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      onClick={() => setQuery('')}
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                onClick={() => setSelectedCategories([])}
                href="#/"
                data-cy="AllCategories"
                // className="button is-success mr-6 is-outlined"
                className={classNames('button', 'is-success', 'mr-6', {
                  'is-outlined': selectedCategories.length !== 0,
                })}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  onClick={() => (
                    selectedCategories.includes(category.id)
                      ? unselectCategory(category.id)
                      : selectCategory(category.id)
                  )}
                  key={category.id}
                  data-cy="Category"
                  className={classNames('button', 'mr-2', 'my-1', {
                    'is-info': selectedCategories.includes(category.id),
                  })}
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                onClick={resetAllFilters}
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            ) : (
              <table
                data-cy="ProductTable"
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Product

                        <a href="#/">
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort-down"
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Category

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort-up" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleProducts.map(product => (
                    <tr data-cy="Product" key={product.id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">
                        {product.name}
                      </td>
                      <td data-cy="ProductCategory">
                        {`${product.category.icon} - ${product.category.title}`}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={classNames({
                          'has-text-link': product.user.sex === 'm',
                          'has-text-danger': product.user.sex === 'f',
                        })}
                      >
                        {product.user.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  );
};
