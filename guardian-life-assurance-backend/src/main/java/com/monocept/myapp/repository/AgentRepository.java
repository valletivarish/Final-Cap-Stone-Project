package com.monocept.myapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.monocept.myapp.entity.Agent;
import com.monocept.myapp.entity.User;
 
public interface AgentRepository extends JpaRepository<Agent, Long> {

	@Query("SELECT a FROM Agent a WHERE "
	         + "(:name IS NULL OR LOWER(a.firstName) LIKE LOWER(CONCAT('%', :name, '%')) "
	         + "OR LOWER(a.lastName) LIKE LOWER(CONCAT('%', :name, '%'))) "
	         + "AND (:city IS NULL OR LOWER(a.address.city.name) LIKE LOWER(CONCAT('%', :city, '%'))) "
	         + "AND (:state IS NULL OR LOWER(a.address.city.state.name) LIKE LOWER(CONCAT('%', :state, '%'))) "
	         + "AND (:isActive IS NULL OR a.active = :isActive)")
	    Page<Agent> findByFilters(@Param("name") String name, 
	                              @Param("city") String city, 
	                              @Param("state") String state, 
	                              @Param("isActive") Boolean isActive, 
	                              Pageable pageable);

	Agent findByUser(User user);

}
