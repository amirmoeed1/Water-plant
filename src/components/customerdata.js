import React from 'react';

const TownCustomersList = ({ towns, selectedTownId, customers }) => {
  const selectedTown = towns.find(town => town._id === selectedTownId);

  return (
    <div className='mt-4'>
      {selectedTown ? (
        <div>
          <h3>Customers in {selectedTown.town}:</h3>
          {customers.length > 0 ? (
            <ul>
              {customers.map(customer => (
                <li key={customer._id}>
                  <strong>{customer.name}</strong> - {customer.phone}, {customer.address}
                </li>
              ))}
            </ul>
          ) : (
            <p>No customers found in this town.</p>
          )}
        </div>
      ) : (
        <p>Please select a town to view customers.</p>
      )}
    </div>
  );
};

export default TownCustomersList;
