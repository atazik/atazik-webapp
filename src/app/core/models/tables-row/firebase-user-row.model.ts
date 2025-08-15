import { PrimeChipProperties } from "../prime-chip-properties.model";

export interface FirebaseUserRow {
	uid?: string;
	displayName: string;
	email: string;
	statusChip: PrimeChipProperties;
	roleChip: PrimeChipProperties;
}
