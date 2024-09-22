package com.monocept.myapp.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashSet;
import java.util.List;
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

import com.monocept.myapp.dto.AgentRequestDto;
import com.monocept.myapp.dto.AgentResponseDto;
import com.monocept.myapp.dto.CommissionResponseDto;
import com.monocept.myapp.dto.ReferralEmailRequestDto;
import com.monocept.myapp.entity.Address;
import com.monocept.myapp.entity.Agent;
import com.monocept.myapp.entity.City;
import com.monocept.myapp.entity.Commission;
import com.monocept.myapp.entity.Customer;
import com.monocept.myapp.entity.Role;
import com.monocept.myapp.entity.State;
import com.monocept.myapp.entity.User;
import com.monocept.myapp.exception.GuardianLifeAssuranceApiException;
import com.monocept.myapp.exception.GuardianLifeAssuranceException;
import com.monocept.myapp.repository.AddressRepository;
import com.monocept.myapp.repository.AgentRepository;
import com.monocept.myapp.repository.CustomerRepository;
import com.monocept.myapp.repository.RoleRepository;
import com.monocept.myapp.repository.StateRepository;
import com.monocept.myapp.repository.UserRepository;
import com.monocept.myapp.util.PagedResponse;

@Service
public class AgentManagementServiceImpl implements AgentManagementService {

	@Autowired
	private AgentRepository agentRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private AddressRepository addressRepository;

	@Autowired
	private StateRepository stateRepository;
	
	@Autowired
	private EmailServiceImpl emailService;

	@Autowired
	private RoleRepository roleRepository;
	
	
	@Autowired
	private CustomerRepository customerRepository;

	@Override
	public String createAgent(AgentRequestDto agentRequestDto) {
		if (userRepository.existsByUsername(agentRequestDto.getUsername())) {
			throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST, "Username already exists!");
		}

		if (userRepository.existsByEmail(agentRequestDto.getEmail())) {
			throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST, "Email already exists!");
		}
		Agent agent = new Agent();
		User user = new User();
		user.setEmail(agentRequestDto.getEmail());
		user.setUsername(agentRequestDto.getUsername());
		user.setPassword(passwordEncoder.encode(agentRequestDto.getPassword()));
		Set<Role> roles = new HashSet<>();
		String roleName = "ROLE_AGENT";
		Role role = roleRepository.findByName(roleName).orElseThrow(
				() -> new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST, "Role not found: " + roleName));
		roles.add(role);

		user.setRoles(roles);
		userRepository.save(user);
		Address address = new Address();
		State state = stateRepository.findById(agentRequestDto.getStateId()).orElse(null);
		List<City> cities = state.getCity();
		City city = cities.stream().filter(c -> c.getCityId() == agentRequestDto.getCityId()).findFirst().orElse(null);
		address.setCity(city);

		address.setHouseNo(agentRequestDto.getHouseNo());
		address.setPincode(agentRequestDto.getPincode());
		address.setApartment(agentRequestDto.getApartment());

		addressRepository.save(address);
		agent.setAddress(address);
		agent.setAgentId(agentRequestDto.getAgentId());
		agent.setFirstName(agentRequestDto.getFirstName());
		agent.setLastName(agentRequestDto.getLastName());
		agent.setUser(user);
		agentRepository.save(agent);

		System.out.println("hello");
		return "Agent Created Successfully";

	}

	@Override
	public PagedResponse<AgentResponseDto> getAllAgents(int page, int size, String sortBy, String direction,
			String city, String state, Boolean isActive, String name) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending()
				: Sort.by(sortBy).ascending();

		PageRequest pageRequest = PageRequest.of(page, size, sort);

		Page<Agent> agentPage = agentRepository.findByFilters(name, city, state, isActive, pageRequest);

		List<AgentResponseDto> agents = agentPage.getContent().stream()
				.map(agent -> convertAgentToAgentResponseDto(agent)).collect(Collectors.toList());

		return new PagedResponse<>(agents, agentPage.getNumber(), agentPage.getSize(), agentPage.getTotalElements(),
				agentPage.getTotalPages(), agentPage.isLast());
	}

	private AgentResponseDto convertAgentToAgentResponseDto(Agent agent) {
		AgentResponseDto agentResponseDto = new AgentResponseDto();
		agentResponseDto.setAgentId(agent.getAgentId());
		Address address = agent.getAddress();
		User user = agent.getUser();
		agentResponseDto.setFirstName(agent.getFirstName());
		agentResponseDto.setLastName(agent.getLastName());
		agentResponseDto.setApartment(address.getApartment());
		agentResponseDto.setHouseNo(address.getHouseNo());
		agentResponseDto.setPincode(address.getPincode());
		agentResponseDto.setUsername(user.getUsername());
		agentResponseDto.setEmail(user.getEmail());
		agentResponseDto.setStatus(agent.isActive());
		City city = address.getCity();
		agentResponseDto.setCity(city.getName());
		State state = city.getState();
		agentResponseDto.setState(state.getName());
		agentResponseDto.setCommissions(agent.getCommissions().stream()
				.map(commission -> convertCommissionToCommissionResponseDto(commission)).collect(Collectors.toList()));
		return agentResponseDto;
	}

	private CommissionResponseDto convertCommissionToCommissionResponseDto(Commission commission) {
		CommissionResponseDto commissionResponseDto = new CommissionResponseDto();
		commissionResponseDto.setCommissionId(commission.getCommissionId());
		commissionResponseDto.setCommissionType(commission.getCommissionType().name());
		commissionResponseDto.setIssueDate(commission.getIssueDate());
		commissionResponseDto.setAmount(commission.getAmount());
		return commissionResponseDto;
	}

	@Override
	public String updateAgent(AgentRequestDto agentRequestDto) {
		Agent existingAgent = agentRepository.findById(agentRequestDto.getAgentId())
				.orElseThrow(() -> new GuardianLifeAssuranceException.UserNotFoundException(
						"Sorry, we couldn't find an agent with ID: " + agentRequestDto.getAgentId()));

		existingAgent.setFirstName(agentRequestDto.getFirstName());
		existingAgent.setLastName(agentRequestDto.getLastName());

		Address existingAddress = existingAgent.getAddress();
		existingAddress.setApartment(agentRequestDto.getApartment());
		existingAddress.setHouseNo(agentRequestDto.getHouseNo());
		existingAddress.setPincode(agentRequestDto.getPincode());

		addressRepository.save(existingAddress);

		User existingUser = existingAgent.getUser();
		existingUser.setUsername(agentRequestDto.getUsername());
		existingUser.setEmail(agentRequestDto.getEmail());

		userRepository.save(existingUser);

		agentRepository.save(existingAgent);

		return "Agent with ID " + agentRequestDto.getAgentId() + " has been successfully updated.";

	}

	@Override
	public AgentResponseDto getAgentById(long agentId) {
		Agent agent = agentRepository.findById(agentId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.UserNotFoundException(
						"Sorry, we couldn't find an agent with ID: " + agentId));
		return convertAgentToAgentResponseDto(agent);
	}

	@Override
	public String deleteAgent(long agentId) {
		Agent agent = agentRepository.findById(agentId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.UserNotFoundException(
						"Sorry, we couldn't find an agent with ID: " + agentId));
		agent.setActive(false);
		agentRepository.save(agent);
		return "Agent with ID " + agentId + " has been successfully deactivated.";
	}
	private Agent getAgentFromSecurityContext() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
			UserDetails userDetails = (UserDetails) authentication.getPrincipal();
			
			return agentRepository.findByUser(
				    userRepository.findByUsernameOrEmail(
				        userDetails.getUsername(), 
				        userDetails.getUsername()
				    ).orElseThrow(() -> new GuardianLifeAssuranceException.UserNotFoundException("User not found"))
				);
		}
		throw new GuardianLifeAssuranceException.UserNotFoundException("agent not found");
	}

	@Override
	public AgentResponseDto getAgentProfile() {
		long agentId = getAgentFromSecurityContext().getAgentId();
		Agent agent = agentRepository.findById(agentId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.UserNotFoundException(
						"Sorry, we couldn't find an agent with ID: " + agentId));
		return convertAgentToAgentResponseDto(agent);
	}

	@Override
	public String sendRecommendationEmail(ReferralEmailRequestDto referralEmailRequestDto) {
	    Customer customer = customerRepository.findById(referralEmailRequestDto.getCustomerId())
	        .orElseThrow(() -> new GuardianLifeAssuranceApiException(HttpStatus.NOT_FOUND, "Customer not found"));
	    Agent agent = getAgentFromSecurityContext();
	    String customerFirstName = customer.getFirstName();
	    String customerLastName = customer.getLastName();
	    Long agentId = agent.getAgentId();

	    String referralLinkWithAgent = referralEmailRequestDto.getReferralLink() + "?AgentID=" + agentId;

	    String subject = "Guardian Life Assurance - Plan Recommendation";
	    String body = String.format(
	        "Dear %s %s,\n\n" +
	        "Our trusted agent, %s %s, has recommended an insurance plan tailored to your needs. " +
	        "Please click the link below to view the details and proceed with the purchase:\n\n" +
	        "%s\n\n" +
	        "If you have any questions, please feel free to contact us.\n\n" +
	        "Thank you for choosing Guardian Life Assurance.\n\n" +
	        "Best regards,\n" +
	        "Guardian Life Assurance",
	        customerFirstName, customerLastName, agent.getFirstName(), agent.getLastName(), referralLinkWithAgent
	    );

	    emailService.sendEmail(referralEmailRequestDto.getRecipientEmail(), subject, body);
	    
	    return "Recommendation email sent successfully";
	}

	@Override
	public Double getTotalCommission() {
		return BigDecimal.valueOf(getAgentFromSecurityContext().getTotalCommission()).setScale(2,RoundingMode.HALF_UP).doubleValue();
	}

	@Override
	public String activateAgent(long agentId) {
		Agent agent = agentRepository.findById(agentId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.UserNotFoundException(
						"Sorry, we couldn't find an agent with ID: " + agentId));
		agent.setActive(true);
		agentRepository.save(agent);
		return "Agent successfully activated with id "+agentId;
	}

	
	

	

}
