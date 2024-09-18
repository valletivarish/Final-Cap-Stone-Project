package com.monocept.myapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.myapp.entity.TaxSetting;

public interface TaxSettingRepository extends JpaRepository<TaxSetting, Long> {

	TaxSetting findTopByOrderByUpdatedAtDesc();

}
