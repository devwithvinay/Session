import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCards from "../../components/dashboard/StatCards";
import TodayTasks from "../../components/dashboard/TodayTasks";
import TaskProgress from "../../components/dashboard/TaskProgress";
import CalendarCard from "../../components/dashboard/CalendarCard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen px-5 py-6 md:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">
        <DashboardHeader />

        <StatCards />

        <section className="mt-7 grid gap-5 xl:grid-cols-[1.65fr_0.78fr_0.78fr]">
          <TodayTasks />
          <TaskProgress />
          <CalendarCard />
        </section>
      </div>
    </div>
  );
}
