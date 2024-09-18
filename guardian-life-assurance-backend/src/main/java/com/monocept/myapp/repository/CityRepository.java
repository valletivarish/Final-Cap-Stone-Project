package com.monocept.myapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.myapp.entity.City;

public interface CityRepository extends JpaRepository<City, Long>{

}
