package com.monocept.myapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.monocept.myapp.entity.Customer;
import com.monocept.myapp.entity.CustomerQuery;

public interface QueryRepository extends JpaRepository<CustomerQuery, Long> {

	@Query("SELECT q FROM CustomerQuery q WHERE q.customer = :customer " +
		       "AND (:title IS NULL OR q.title LIKE %:title%) " +
		       "AND (:resolved IS NULL OR q.resolved = :resolved)")
		Page<CustomerQuery> findAllQueriesByCustomerAndFilters(
		    @Param("customer") Customer customer,
		    @Param("title") String title,
		    @Param("resolved") Boolean resolved,
		    Pageable pageable);


	Page<Query> findAllByResolvedFalse(PageRequest pageRequest);

	@Query("SELECT cq FROM CustomerQuery cq WHERE " +
		       "(:search IS NULL OR :search = '' OR LOWER(cq.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
		       "OR LOWER(cq.message) LIKE LOWER(CONCAT('%', :search, '%'))) " +
		       "AND (:resolved IS NULL OR cq.resolved = :resolved)")
		Page<CustomerQuery> findAllByCriteria(@Param("search") String search, 
		                                      @Param("resolved") Boolean resolved, 
		                                      PageRequest pageable);




}
