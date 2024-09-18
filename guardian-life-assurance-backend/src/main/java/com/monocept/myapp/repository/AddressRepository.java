package com.monocept.myapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.myapp.entity.Address;
import com.monocept.myapp.entity.City;

public interface AddressRepository extends JpaRepository<Address, Long> {

	City findByCity(City city);

}
