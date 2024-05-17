import React, { useState, useEffect } from 'react';
import styles from './EmployeeTable.module.css'; 

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const itemsPerPage = 10;

  const fetchEmployees = async () => {
    try {
      const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setEmployees(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const totalPages = Math.ceil(employees.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderTableRows = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, employees.length);
    return employees.slice(startIndex, endIndex).map((employee) => (
      <tr key={employee.id}>
        <td>{employee.id}</td>
        <td>{employee.name}</td>
        <td>{employee.email}</td>
        <td>{employee.role}</td>
      </tr>
    ));
  };

  if (loading) {
    return <div className={styles['table-container']}>Loading...</div>;
  }

  if (error) {
    return <div className={styles['table-container']}>{error}</div>;
  }

  return (
    <div className={styles['table-container']}>
      <h1>Employee Data Table</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
      <div className={styles.pagination}>
        <button
          className={styles['pagination-button']}
          onClick={prevPage}
        //   disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className={styles['page-info']}>
          {currentPage}
        </div>
        <button
          className={styles['pagination-button']}
          onClick={nextPage}
        //   disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeTable;
