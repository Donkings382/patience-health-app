export type Supplement = {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  instructions?: string;
};

export type ScheduleItem = {
  id: string;
  activity: string;
  time: string;
  type: "exercise" | "meal" | "medication" | "rest";
  completed: boolean;
};

export type HealthPlanState = {
  supplements: Supplement[];
  schedule: ScheduleItem[];
};

export const initialSupplements: Supplement[] = [
  {
    id: "s1",
    name: "Metformin",
    dosage: "500mg",
    time: "08:00",
    taken: false,
    instructions: "Take with breakfast to reduce stomach upset",
  },
  {
    id: "s2",
    name: "Lisinopril",
    dosage: "10mg",
    time: "20:00",
    taken: false,
    instructions: "Take at the same time each evening",
  },
  {
    id: "s3",
    name: "Vitamin D3",
    dosage: "1000 IU",
    time: "09:00",
    taken: false,
    instructions: "Take with a meal containing healthy fats",
  },
];

export const initialSchedule: ScheduleItem[] = [
  { id: "sc1", activity: "Wake up & light stretching", time: "07:00", type: "rest", completed: false },
  { id: "sc2", activity: "Breakfast", time: "08:00", type: "meal", completed: false },
  { id: "sc3", activity: "Morning medications", time: "08:15", type: "medication", completed: false },
  { id: "sc4", activity: "30-min brisk walk", time: "10:00", type: "exercise", completed: false },
  { id: "sc5", activity: "Lunch", time: "13:00", type: "meal", completed: false },
  { id: "sc6", activity: "Afternoon rest", time: "14:30", type: "rest", completed: false },
  { id: "sc7", activity: "Dinner", time: "19:00", type: "meal", completed: false },
  { id: "sc8", activity: "Evening medications", time: "20:00", type: "medication", completed: false },
];
