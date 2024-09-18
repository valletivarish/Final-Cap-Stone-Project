package com.monocept.myapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.monocept.myapp.entity.Employee;
import com.monocept.myapp.entity.User;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

	Employee findByUser(User user);

	@Query("SELECT e FROM Employee e " +
	           "WHERE (:name IS NULL OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :name, '%'))) " +
	           "AND (:isActive IS NULL OR e.active = :isActive)")
	    Page<Employee> findAllByCriteria(@Param("name") String name, 
	                                     @Param("isActive") Boolean isActive, 
	                                     Pageable pageable);

}
