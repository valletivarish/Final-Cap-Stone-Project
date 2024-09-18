package com.monocept.myapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.myapp.entity.State;

public interface StateRepository extends JpaRepository<State, Long> {

}
