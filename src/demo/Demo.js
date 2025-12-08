import { Calendar, Code, FileText, User, Clock } from "lucide-react";
import RadialOrbitalTimeline from "../components/RadialOrbitalTimeline";

function Demo() {
  const timelineData = [
    { id: 1, title: "Planning", date: "Jan 2024", content: "Project planning.", icon: Calendar, relatedIds: [2], status: "completed", energy: 100 },
    { id: 2, title: "Design", date: "Feb 2024", content: "UI/UX work.", icon: FileText, relatedIds: [1, 3], status: "completed", energy: 90 },
    { id: 3, title: "Development", date: "Mar 2024", content: "Build features.", icon: Code, relatedIds: [2, 4], status: "in-progress", energy: 60 },
    { id: 4, title: "Testing", date: "Apr 2024", content: "Bug fixes.", icon: User, relatedIds: [3, 5], status: "pending", energy: 30 },
    { id: 5, title: "Release", date: "May 2024", content: "Final launch.", icon: Clock, relatedIds: [4], status: "pending", energy: 10 },
  ];

  return <RadialOrbitalTimeline timelineData={timelineData} />;
}

export default Demo;
