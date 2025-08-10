/**
 * Regular expression for validating password.
 * It requires at least 10 characters, one uppercase letter, one lowercase letter, one number, and one special character.
 */
export const PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_-])\S{10,}$/;
