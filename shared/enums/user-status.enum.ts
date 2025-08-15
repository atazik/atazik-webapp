/**
 * Enum representing different user status in the application.
 * This enum is used to define the status that users can have,
 * which can be used for access control and permissions. (Depending on the role)
 */
export const enum UserStatusEnum {
	/**
	 * User is active and has full access to the application.
	 */
	ACTIVATED = "activated",

	/**
	 * User is inactive and has limited access to the application.
	 * Can only sign up with the email sign-in method they received.
	 */
	INVITED = "invited",
}
