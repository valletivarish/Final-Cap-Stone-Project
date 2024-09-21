package com.monocept.myapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.myapp.entity.Nominee;

public interface NomineeRepository extends JpaRepository<Nominee, Long> {

}
