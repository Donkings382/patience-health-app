import React, { useState } from "react";
import {
	Plus,
	Pencil,
	Trash2,
	CheckCircle2,
	Circle,
	Clock,
	Pill,
	Calendar,
	X,
} from "lucide-react";
import { useHealthPlan } from "../hooks/useHealthPlan";
import { Supplement, ScheduleItem } from "../types/healthPlan";

// ─── Inline edit modal ────────────────────────────────────────────────────────

interface SupplementEditModalProps {
	item: Supplement;
	onSave: (updated: Supplement) => void;
	onClose: () => void;
}

const SupplementEditModal: React.FC<SupplementEditModalProps> = ({
	item,
	onSave,
	onClose,
}) => {
	const [draft, setDraft] = useState(item);
	const f = (key: keyof Supplement, value: string) =>
		setDraft((p) => ({ ...p, [key]: value }));

	return (
		<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-md">
			<div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
				<div className="p-5 border-b border-slate-100 flex items-center justify-between">
					<h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
						Edit Supplement
					</h2>
					<button
						onClick={onClose}
						className="p-1.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-full active:scale-[0.98] transition-transform duration-150"
					>
						<X className="w-5 h-5" />
					</button>
				</div>
				<div className="p-5 space-y-4">
					{(["name", "dosage", "time", "instructions"] as const).map((key) => (
						<div key={key}>
							<label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 capitalize">
								{key}
							</label>
							<input
								type={key === "time" ? "time" : "text"}
								value={(draft[key] as string) ?? ""}
								onChange={(e) => f(key, e.target.value)}
								placeholder={key === "instructions" ? "Optional" : key}
								className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
							/>
						</div>
					))}
					<button
						onClick={() => {
							onSave(draft);
							onClose();
						}}
						className="w-full py-3 bg-primary text-white font-bold rounded-xl text-xs uppercase tracking-widest active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
					>
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
};

// ─── Schedule edit modal ──────────────────────────────────────────────────────

interface ScheduleEditModalProps {
	item: ScheduleItem;
	onSave: (updated: ScheduleItem) => void;
	onClose: () => void;
}

const SCHEDULE_TYPES: ScheduleItem["type"][] = [
	"exercise",
	"meal",
	"medication",
	"rest",
];

const ScheduleEditModal: React.FC<ScheduleEditModalProps> = ({
	item,
	onSave,
	onClose,
}) => {
	const [draft, setDraft] = useState(item);

	return (
		<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-md">
			<div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
				<div className="p-5 border-b border-slate-100 flex items-center justify-between">
					<h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
						Edit Schedule Item
					</h2>
					<button
						onClick={onClose}
						className="p-1.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-full active:scale-[0.98] transition-transform duration-150"
					>
						<X className="w-5 h-5" />
					</button>
				</div>
				<div className="p-5 space-y-4">
					<div>
						<label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
							Activity
						</label>
						<input
							type="text"
							value={draft.activity}
							onChange={(e) =>
								setDraft((p) => ({ ...p, activity: e.target.value }))
							}
							className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
						/>
					</div>
					<div>
						<label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
							Time
						</label>
						<input
							type="time"
							value={draft.time}
							onChange={(e) =>
								setDraft((p) => ({ ...p, time: e.target.value }))
							}
							className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
						/>
					</div>
					<div>
						<label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
							Type
						</label>
						<div className="grid grid-cols-2 gap-2">
							{SCHEDULE_TYPES.map((t) => (
								<button
									key={t}
									type="button"
									onClick={() => setDraft((p) => ({ ...p, type: t }))}
									className={`py-2 min-h-[44px] rounded-xl text-xs font-bold capitalize border transition-all active:scale-[0.98] duration-150 ${
										draft.type === t
											? "bg-primary text-white border-primary"
											: "bg-slate-50 text-slate-500 border-slate-200"
									}`}
								>
									{t}
								</button>
							))}
						</div>
					</div>
					<button
						onClick={() => {
							onSave(draft);
							onClose();
						}}
						className="w-full py-3 bg-primary text-white font-bold rounded-xl text-xs uppercase tracking-widest active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
					>
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
};

// ─── Main Planner page ────────────────────────────────────────────────────────

const Planner: React.FC = () => {
	const {
		supplements,
		setSupplements,
		schedule,
		setSchedule,
		toggleSupplement,
		toggleScheduleItem,
	} = useHealthPlan();

	const [editingSupplement, setEditingSupplement] = useState<Supplement | null>(
		null,
	);
	const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(
		null,
	);

	// ── Supplement actions ──
	const addSupplement = () => {
		const newItem: Supplement = {
			id: Math.random().toString(36).substr(2, 9),
			name: "New Supplement",
			dosage: "—",
			time: "08:00",
			taken: false,
		};
		setSupplements((prev) => [...prev, newItem]);
	};

	const saveSupplement = (updated: Supplement) => {
		setSupplements((prev) =>
			prev.map((s) => (s.id === updated.id ? updated : s)),
		);
	};

	const deleteSupplement = (id: string) => {
		setSupplements((prev) => prev.filter((s) => s.id !== id));
	};

	// ── Schedule actions ──
	const addScheduleItem = () => {
		const newItem: ScheduleItem = {
			id: Math.random().toString(36).substr(2, 9),
			activity: "New Activity",
			time: "09:00",
			type: "rest",
			completed: false,
		};
		setSchedule((prev) => [...prev, newItem]);
	};

	const saveScheduleItem = (updated: ScheduleItem) => {
		setSchedule((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
	};

	const deleteScheduleItem = (id: string) => {
		setSchedule((prev) => prev.filter((s) => s.id !== id));
	};

	const sortedSchedule = [...schedule].sort((a, b) =>
		a.time.localeCompare(b.time),
	);

	return (
		<div className="pb-24 min-h-screen bg-slate-50 animate-fade-in">
			{/* Header */}
			<header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-5">
				<h1 className="text-xl font-bold text-slate-900">Health Planner</h1>
				<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
					Manage your supplements & daily schedule
				</p>
			</header>

			<main className="p-6 space-y-8">
				{/* ── Supplements ── */}
				<section>
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center gap-2">
							<Pill className="w-4 h-4 text-primary" />
							<h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
								Supplements
							</h2>
						</div>
						<button
							onClick={addSupplement}
							className="flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] bg-primary text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-transform duration-150 shadow-sm shadow-primary/20"
						>
							<Plus className="w-3.5 h-3.5" /> Add
						</button>
					</div>

					<div className="space-y-3">
						{supplements.map((s) => (
							<div
								key={s.id}
								className="glass-card rounded-2xl p-4 flex items-start gap-3"
							>
								<button
									onClick={() => toggleSupplement(s.id)}
									className="mt-0.5 shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-[0.98] transition-transform duration-150"
								>
									{s.taken ? (
										<CheckCircle2 className="w-5 h-5 text-primary" />
									) : (
										<Circle className="w-5 h-5 text-slate-300" />
									)}
								</button>
								<div className="flex-1 min-w-0">
									<p
										className={`text-sm font-bold ${s.taken ? "line-through text-slate-400" : "text-slate-800"}`}
									>
										{s.name}
										<span className="ml-1.5 text-xs font-semibold text-slate-400">
											{s.dosage}
										</span>
									</p>
									<div className="flex items-center gap-1 mt-0.5">
										<Clock className="w-3 h-3 text-slate-400" />
										<span className="text-[10px] font-bold text-slate-400">
											{s.time}
										</span>
									</div>
									{s.instructions && (
										<p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
											{s.instructions}
										</p>
									)}
								</div>
								<div className="flex items-center gap-1 shrink-0">
									<button
										onClick={() => setEditingSupplement(s)}
										className="p-1.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-primary rounded-lg hover:bg-primary/5 active:scale-[0.98] transition-all duration-150"
									>
										<Pencil className="w-4 h-4" />
									</button>
									<button
										onClick={() => deleteSupplement(s.id)}
										className="p-1.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 active:scale-[0.98] transition-all duration-150"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</div>
						))}
						{supplements.length === 0 && (
							<p className="text-xs text-slate-400 text-center py-6">
								No supplements added yet.
							</p>
						)}
					</div>
				</section>

				{/* ── Schedule ── */}
				<section>
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center gap-2">
							<Calendar className="w-4 h-4 text-primary" />
							<h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
								Daily Schedule
							</h2>
						</div>
						<button
							onClick={addScheduleItem}
							className="flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] bg-primary text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-transform duration-150 shadow-sm shadow-primary/20"
						>
							<Plus className="w-3.5 h-3.5" /> Add
						</button>
					</div>

					<div className="space-y-3">
						{sortedSchedule.map((item) => (
							<div
								key={item.id}
								className="glass-card rounded-2xl p-4 flex items-center gap-3"
							>
								<button
									onClick={() => toggleScheduleItem(item.id)}
									className="shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-[0.98] transition-transform duration-150"
								>
									{item.completed ? (
										<CheckCircle2 className="w-5 h-5 text-primary" />
									) : (
										<Circle className="w-5 h-5 text-slate-300" />
									)}
								</button>
								<div className="flex-1 min-w-0">
									<p
										className={`text-sm font-bold truncate ${item.completed ? "line-through text-slate-400" : "text-slate-800"}`}
									>
										{item.activity}
									</p>
									<div className="flex items-center gap-2 mt-0.5">
										<span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
											<Clock className="w-3 h-3" />
											{item.time}
										</span>
										<span
											className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md capitalize ${typeChip(item.type)}`}
										>
											{item.type}
										</span>
									</div>
								</div>
								<div className="flex items-center gap-1 shrink-0">
									<button
										onClick={() => setEditingSchedule(item)}
										className="p-1.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-primary rounded-lg hover:bg-primary/5 active:scale-[0.98] transition-all duration-150"
									>
										<Pencil className="w-4 h-4" />
									</button>
									<button
										onClick={() => deleteScheduleItem(item.id)}
										className="p-1.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 active:scale-[0.98] transition-all duration-150"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</div>
						))}
						{schedule.length === 0 && (
							<p className="text-xs text-slate-400 text-center py-6">
								No schedule items added yet.
							</p>
						)}
					</div>
				</section>

				{/* Reset hint */}
				<p className="text-center text-[10px] text-slate-300 font-medium">
					Changes are saved automatically to your device.
				</p>
			</main>

			{/* Modals */}
			{editingSupplement && (
				<SupplementEditModal
					item={editingSupplement}
					onSave={saveSupplement}
					onClose={() => setEditingSupplement(null)}
				/>
			)}
			{editingSchedule && (
				<ScheduleEditModal
					item={editingSchedule}
					onSave={saveScheduleItem}
					onClose={() => setEditingSchedule(null)}
				/>
			)}
		</div>
	);
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function typeChip(type: ScheduleItem["type"]): string {
	switch (type) {
		case "meal":
			return "bg-orange-50 text-orange-500";
		case "medication":
			return "bg-blue-50 text-blue-500";
		case "exercise":
			return "bg-green-50 text-green-500";
		case "rest":
			return "bg-purple-50 text-purple-500";
	}
}

export default Planner;
