import { PrimeChipProperties } from "../prime-chip-properties.model";

export interface FirebaseUserRow {
	displayName: string;
	email: string;
	statusChip: PrimeChipProperties;
	role: string;
}
