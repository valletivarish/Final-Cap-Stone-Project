package com.monocept.myapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.monocept.myapp.entity.Customer;
import com.monocept.myapp.entity.User;

public interface CustomerRepository extends JpaRepository<Customer, Long>{

	@Query("SELECT c FROM Customer c WHERE "
		       + "(:name IS NULL OR LOWER(c.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :name, '%'))) "
		       + "AND (:city IS NULL OR LOWER(c.address.city.name) LIKE LOWER(CONCAT('%', :city, '%'))) "
		       + "AND (:state IS NULL OR LOWER(c.address.city.state.name) LIKE LOWER(CONCAT('%', :state, '%'))) "
		       + "AND (:isActive IS NULL OR c.active = :isActive)")
		Page<Customer> findByFilters(@Param("name") String name, 
		                             @Param("city") String city, 
		                             @Param("state") String state, 
		                             @Param("isActive") Boolean isActive, 
		                             Pageable pageable);

	Customer findByUser(User user);

	@Query("SELECT DISTINCT c FROM Customer c " +
            "JOIN c.policies p " +
            "JOIN p.agent a " +
            "JOIN c.address addr " +
            "JOIN addr.city city " +
            "JOIN city.state state " +
            "WHERE a.agentId = :agentId " +
            "AND (:name IS NULL OR LOWER(CONCAT(c.firstName, ' ', c.lastName)) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:city IS NULL OR LOWER(city.name) LIKE LOWER(CONCAT('%', :city, '%'))) " +
            "AND (:state IS NULL OR LOWER(state.name) LIKE LOWER(CONCAT('%', :state, '%'))) " +
            "AND (:isActive IS NULL OR c.active = :isActive)")
    Page<Customer> findByAgentFilters(@Param("agentId") Long agentId,
                                      @Param("name") String name,
                                      @Param("city") String city,
                                      @Param("state") String state,
                                      @Param("isActive") Boolean isActive,
                                      Pageable pageable);


}
