import { Task } from "@/types/task";

export const mockTasks: Task[] = [
  {
    id: 1,

    activity_id: 101,

    title: "Prepare event venue",

    description:
      "Set up chairs, tables, and decorations for the annual club meetup. Coordinate with vendors for equipment delivery.",

    status: "completed",

    assigned_to: 1,

    due_date: "2024-01-15",

    created_at: "2024-01-10T09:00:00Z",

    assignee_name: "Alex Chen",

    activity_name: "Annual Meetup",
  },

  {
    id: 2,

    activity_id: 101,

    title: "Send invitations to members",

    description:
      "Draft and send email invitations to all club members. Include event details, RSVP link, and dress code information.",

    status: "in_progress",

    assigned_to: 2,

    due_date: "2024-01-20",

    created_at: "2024-01-12T14:30:00Z",

    assignee_name: "Sarah Kim",

    activity_name: "Annual Meetup",
  },

  {
    id: 3,

    activity_id: 102,

    title: "Order catering services",

    description:
      "Contact catering companies and finalize menu for 50 attendees. Consider dietary restrictions.",

    status: "pending",

    assigned_to: 3,

    due_date: "2024-01-25",

    created_at: "2024-01-14T10:15:00Z",

    assignee_name: "Mike Johnson",

    activity_name: "Workshop Event",
  },

  {
    id: 4,

    activity_id: 102,

    title: "Create presentation slides",

    description:
      "Design and prepare presentation materials for the workshop session on project management best practices.",

    status: "in_progress",

    assigned_to: 1,

    due_date: "2024-01-22",

    created_at: "2024-01-13T16:00:00Z",

    assignee_name: "Alex Chen",

    activity_name: "Workshop Event",
  },

  {
    id: 5,

    activity_id: 103,

    title: "Book meeting room",

    description: null,

    status: "completed",

    assigned_to: 2,

    due_date: "2024-01-18",

    created_at: "2024-01-11T08:45:00Z",

    assignee_name: "Sarah Kim",

    activity_name: "Monthly Review",
  },

  {
    id: 6,

    activity_id: 103,

    title: "Prepare financial report",

    description:
      "Compile quarterly financial statements and budget analysis for the monthly review meeting.",

    status: "pending",

    assigned_to: 4,

    due_date: "2024-01-28",

    created_at: "2024-01-15T11:20:00Z",

    assignee_name: "Emma Davis",

    activity_name: "Monthly Review",
  },
];
