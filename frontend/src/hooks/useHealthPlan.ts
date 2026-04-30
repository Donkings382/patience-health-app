import { useState, useEffect } from "react";
import {
	Supplement,
	ScheduleItem,
	initialSupplements,
	initialSchedule,
} from "../types/healthPlan";
import { useAuth } from "../contexts/AuthContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function storageKeys(userId: string) {
	return {
		supplements: `healthPlan_${userId}_supplements`,
		schedule: `healthPlan_${userId}_schedule`,
	};
}

function loadFromStorage<T>(key: string, fallback: T): T {
	try {
		const stored = localStorage.getItem(key);
		return stored ? (JSON.parse(stored) as T) : fallback;
	} catch {
		return fallback;
	}
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useHealthPlan() {
	const { user } = useAuth();
	const userId = user?.id != null ? String(user.id) : null;

	const [supplements, setSupplements] = useState<Supplement[]>(() => {
		if (!userId) return initialSupplements;
		const keys = storageKeys(userId);
		return loadFromStorage(keys.supplements, initialSupplements);
	});

	const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
		if (!userId) return initialSchedule;
		const keys = storageKeys(userId);
		return loadFromStorage(keys.schedule, initialSchedule);
	});

	// Reload data whenever the logged-in user changes
	useEffect(() => {
		if (!userId) {
			setSupplements(initialSupplements);
			setSchedule(initialSchedule);
			return;
		}
		const keys = storageKeys(userId);
		setSupplements(loadFromStorage(keys.supplements, initialSupplements));
		setSchedule(loadFromStorage(keys.schedule, initialSchedule));
	}, [userId]);

	// Persist supplements — only when a real user is logged in
	useEffect(() => {
		if (!userId) return;
		const keys = storageKeys(userId);
		localStorage.setItem(keys.supplements, JSON.stringify(supplements));
	}, [supplements, userId]);

	// Persist schedule — only when a real user is logged in
	useEffect(() => {
		if (!userId) return;
		const keys = storageKeys(userId);
		localStorage.setItem(keys.schedule, JSON.stringify(schedule));
	}, [schedule, userId]);

	const toggleSupplement = (id: string) => {
		if (!userId) return;
		setSupplements((prev) =>
			prev.map((s) => (s.id === id ? { ...s, taken: !s.taken } : s)),
		);
	};

	const toggleScheduleItem = (id: string) => {
		if (!userId) return;
		setSchedule((prev) =>
			prev.map((item) =>
				item.id === id ? { ...item, completed: !item.completed } : item,
			),
		);
	};

	return {
		supplements,
		setSupplements: userId ? setSupplements : () => {},
		schedule,
		setSchedule: userId ? setSchedule : () => {},
		toggleSupplement,
		toggleScheduleItem,
	};
}
