package com.monocept.myapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.monocept.myapp.entity.Customer;
import com.monocept.myapp.entity.Document;
import com.monocept.myapp.enums.DocumentType;

public interface DocumentRepository extends JpaRepository<Document, Integer> {

	@Query("SELECT d FROM Document d WHERE (:verified IS NULL OR d.verified = :verified)")
    Page<Document> findAllByVerified(@Param("verified") Boolean verified, PageRequest pageRequest);

	@Query("SELECT d FROM Document d WHERE d.customer.customerId = :customerId AND d.verified = true")
	List<Document> findVerifiedDocumentsByCustomerId(@Param("customerId") Long customerId);

	Page<Document> findAllByCustomerAndVerified(Customer customer, Boolean verified, PageRequest pageRequest);


	Optional<Document> findByCustomerAndDocumentName(Customer customer, DocumentType documentName);

}
