package com.monocept.myapp.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.monocept.myapp.dto.AdminRequestDto;
import com.monocept.myapp.dto.AdminResponseDto;
import com.monocept.myapp.entity.Admin;
import com.monocept.myapp.entity.Role;
import com.monocept.myapp.entity.User;
import com.monocept.myapp.exception.GuardianLifeAssuranceApiException;
import com.monocept.myapp.exception.GuardianLifeAssuranceException;
import com.monocept.myapp.exception.GuardianLifeAssuranceException.UserAlreadyDeactivatedException;
import com.monocept.myapp.repository.AdminRepository;
import com.monocept.myapp.repository.RoleRepository;
import com.monocept.myapp.repository.UserRepository;
import com.monocept.myapp.util.PagedResponse;

import jakarta.validation.Valid;

@Service
public class AdminServiceImpl implements AdminService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private AdminRepository adminRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public String updateAdmin(@Valid AdminRequestDto adminRequestDto) {
		Admin admin = adminRepository.findById(adminRequestDto.getAdminId())
				.orElseThrow(() -> new GuardianLifeAssuranceException.UserNotFoundException(
						"Sorry, we couldn't find an admin with ID: " + adminRequestDto.getAdminId()));
		User user = admin.getUser();

		if (adminRequestDto.getEmail() != null && adminRequestDto.getEmail() != "") {
			user.setEmail(adminRequestDto.getEmail());
		}
		admin.setActive(adminRequestDto.isActive());

		userRepository.save(user);
		adminRepository.save(admin);
		return "admin updated sucessfuly";
	}

	@Override
	public String deleteAdmin(long adminId) {
		Admin admin = adminRepository.findById(adminId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.UserNotFoundException(
						"Sorry, we couldn't find an admin with ID: " + adminId));
		if (!admin.isActive()) {
			throw new UserAlreadyDeactivatedException(
					"admin with ID " + adminId + " is already deactivated.");
		}
		admin.setActive(false);
		adminRepository.save(admin);
		return "Admin Deleted Successfully";
	}

	@Override
	public String addAdmin(@Valid AdminRequestDto adminRequestDto) {
		if (userRepository.existsByUsername(adminRequestDto.getUsername())) {
            throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST, "Username already exists!");
        }

        if (userRepository.existsByEmail(adminRequestDto.getEmail())) {
            throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST, "Email already exists!");
        }

        User user = new User();
        user.setUsername(adminRequestDto.getUsername());
        user.setEmail(adminRequestDto.getEmail());
        user.setPassword(passwordEncoder.encode(adminRequestDto.getPassword()));

        Set<Role> roles = new HashSet<>();
        for (String roleName : adminRequestDto.getRoles()) {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST, "Role not found: " + roleName));
            roles.add(role);
        }

        user.setRoles(roles);
        userRepository.save(user);
        if (adminRequestDto.getRoles().contains("ROLE_ADMIN")) {
            Admin admin = new Admin();
            admin.setUser(user);
            admin.setActive(true);
            adminRepository.save(admin);
        }
		return "Admin Successfully Created";
	}

	@Override
	public String activateAdmin(long adminId) {
		Admin admin = adminRepository.findById(adminId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.UserNotFoundException(
						"Sorry, we couldn't find an admin with ID: " + adminId));
		if(!admin.isActive()) {
			throw new UserAlreadyDeactivatedException("The admin "+adminId+" is already Deactivated ");
		}
		admin.setActive(false);
		return "Admin Deleted Successfully with "+adminId+".";
	}

	@Override
	public PagedResponse<AdminResponseDto> getAllAdmin(int page, int size, String sortBy, String direction) {
		Sort sort=direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		PageRequest pageRequest = PageRequest.of(page, size, sort);
		Page<Admin> adminPage = adminRepository.findAll(pageRequest);
		List<AdminResponseDto> adminList = adminPage.getContent().stream().map(admin->convertAdminToAdminResponseDto(admin)).collect(Collectors.toList());
		return new PagedResponse<>(adminList, adminPage.getNumber(), adminPage.getSize(), adminPage.getTotalElements(), adminPage.getTotalPages(), adminPage.isLast());
	}

	private AdminResponseDto convertAdminToAdminResponseDto(Admin admin) {
		AdminResponseDto adminResponseDto=new AdminResponseDto();
		adminResponseDto.setActive(admin.isActive());
		adminResponseDto.setAdminId(admin.getAdminId());
		adminResponseDto.setEmail(admin.getUser().getEmail());
		adminResponseDto.setUsername(admin.getUser().getUsername());
		return adminResponseDto;
	}

	@Override
	public AdminResponseDto getAdmin(long adminId) {
		Admin admin = adminRepository.findById(adminId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.UserNotFoundException(
						"Sorry, we couldn't find an admin with ID: " + adminId));
		return convertAdminToAdminResponseDto(admin);
	}

	@Override
	public AdminResponseDto getAdminByUsername() {
		User user = userRepository.findByUsernameOrEmail(getUserNameOrEmailFromSecurityContext(), getUserNameOrEmailFromSecurityContext()).orElseThrow(()->new GuardianLifeAssuranceException.UserNotFoundException("User not found"));
		return convertAdminToAdminResponseDto(adminRepository.findByUser(user));
	}
	
	private String getUserNameOrEmailFromSecurityContext() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
			UserDetails userDetails = (UserDetails) authentication.getPrincipal();
			return userDetails.getUsername();
		}
		return null;
	}
}
