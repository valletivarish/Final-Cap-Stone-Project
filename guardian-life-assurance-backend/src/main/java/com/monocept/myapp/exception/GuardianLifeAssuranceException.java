package com.monocept.myapp.exception;

public class GuardianLifeAssuranceException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public GuardianLifeAssuranceException(String message) {
		super(message);
	}

	public static class ResourceNotFoundException extends GuardianLifeAssuranceException {
		private static final long serialVersionUID = 1L;

		public ResourceNotFoundException(String message) {
			super(message);
		}
	}

	public static class ResourceAlreadyDeactivatedException extends GuardianLifeAssuranceException {
		private static final long serialVersionUID = 1L;

		public ResourceAlreadyDeactivatedException(String message) {
			super(message);
		}
	}

	public static class ResourceNotActiveException extends GuardianLifeAssuranceException {
		private static final long serialVersionUID = 1L;

		public ResourceNotActiveException(String message) {
			super(message);
		}
	}

	public static class DocumentNotVerifiedException extends GuardianLifeAssuranceException {
		private static final long serialVersionUID = 1L;

		public DocumentNotVerifiedException(String message) {
			super(message);
		}
	}

	public static class UserNotFoundException extends GuardianLifeAssuranceException {
		private static final long serialVersionUID = 1L;

		public UserNotFoundException(String message) {
			super(message);
		}
	}

	public static class UserAlreadyActivatedException extends GuardianLifeAssuranceException {
		private static final long serialVersionUID = 1L;

		public UserAlreadyActivatedException(String message) {
			super(message);
		}
	}

	public static class UserAlreadyDeactivatedException extends GuardianLifeAssuranceException {
		private static final long serialVersionUID = 1L;

		public UserAlreadyDeactivatedException(String message) {
			super(message);
		}
	}

	public static class UserNotActiveException extends GuardianLifeAssuranceException {
		private static final long serialVersionUID = 1L;

		public UserNotActiveException(String message) {
			super(message);
		}
	}
}
