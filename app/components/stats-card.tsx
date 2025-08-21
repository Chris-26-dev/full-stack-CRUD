 "use client";

import { ReactNode } from "react";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import { Card } from "@/components/ui/card";
import { FaUsers, FaUserShield, FaUserFriends } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type StatCard = {
  title: string;
  value: string;
  metricDelta?: string;
  positiveMetric?: boolean;
  icon: ReactNode;
  className?: string;
  color?: string;
};

type StatCardsProps = {
  cards?: StatCard[];
  isGrid?: boolean;
  columns?: number;
  showMetricDelta?: boolean;
  className?: string;
  cardClassName?: string;
  isLoading?: boolean;
};

type SingleStatCardProps = {
  card: StatCard;
  showMetricDelta: boolean;
  isLoading: boolean;
  className?: string;
  isGridItem?: boolean;
};

export default function StatCards({
  cards,
  isGrid = true,
  columns = 3,
  className = "",
  cardClassName = "",
  showMetricDelta = true,
  isLoading = false,
}: StatCardsProps) {
  // fetch users to compute counts
  const users = useQuery(api.users.list, {});
  const loading = isLoading || users === undefined;

  // Count only regular users (role === 'user') for the primary card
  const regularUsers = users?.filter((u: any) => u.role === "user").length ?? 0;
  const adminUsers = users?.filter((u: any) => u.role === "admin").length ?? 0;
  const contributorUsers = users?.filter((u: any) => u.role === "contributor").length ?? 0;

  const computedCards: StatCard[] = [
    { title: "Users", value: regularUsers.toLocaleString(), icon: <FaUsers />, metricDelta: undefined, positiveMetric: true },
    { title: "Admin Users", value: adminUsers.toLocaleString(), icon: <FaUserShield />, metricDelta: undefined, positiveMetric: true },
    { title: "Contributors", value: contributorUsers.toLocaleString(), icon: <FaUserFriends />, metricDelta: undefined, positiveMetric: false },
  ];

  // Use single column on mobile and switch to `columns` on md+ screens
  const mdColsClass = columns === 1 ? "md:grid-cols-1" : columns === 2 ? "md:grid-cols-2" : columns === 3 ? "md:grid-cols-3" : "md:grid-cols-3";
  const gridClass = `grid grid-cols-1 ${mdColsClass} gap-4 mx-auto max-w-7xl ${className}`;
  const flexClass = `flex flex-nowrap gap-4 w-full ${className}`;

  return (
    <div className={isGrid ? gridClass : flexClass}>
      {(cards ?? computedCards).map((card, index) => (
        <SingleCard
          key={index}
          card={card}
          showMetricDelta={showMetricDelta}
          isLoading={loading}
          className={`${cardClassName} ${!isGrid ? "flex-1" : ""}`}
          isGridItem={isGrid}
        />
      ))}
    </div>
  );
}

function SingleCard({
  card,
  showMetricDelta,
  isLoading,
  className = "",
  isGridItem = true,
}: SingleStatCardProps) {
  return (
    <div className={isGridItem ? "w-full" : "flex-1 min-w-0"}>
  <Card className={`mt-4 max-w-[420px] w-full mx-auto p-5 flex gap-2 h-full ${className}`}>
        <div className="w-1 bg-primary mt-1"></div>
        <div className="flex items-start justify-between w-full pl-2">
          <div className="flex flex-col">
            <span className="pb-2 opacity-65">{card.title}</span>
            <div>
              {isLoading ? (
                <Skeleton className="w-[100px] h-[45px] rounded-md dark:bg-neutral-800" />
              ) : (
                <div className="text-3xl font-bold mt-[8px]">{card.value}</div>
              )}
            </div>
          </div>

          <div className="flex gap-2 flex-col pl-4 sm:pl-16 justify-between items-end">
            <div className="size-9 rounded-md flex items-center justify-center text-sm bg-primary/10 font-bold text-primary">
              {card.icon}
            </div>

            {showMetricDelta && card.metricDelta && (
              <div
                className={`text-xs ${
                  card.positiveMetric ? "text-green-600" : "text-red-600"
                } text-muted-foreground mt-1 flex items-center gap-1`}
              >
                {isLoading ? (
                  <Skeleton className="w-[50px] h-[25px] rounded-sm dark:bg-neutral-800" />
                ) : (
                  <span className="mt-1">
                    {card.positiveMetric ? (
                      <div className="flex items-center gap-1">
                        <MdArrowUpward />
                        <span>{card.metricDelta}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <MdArrowDownward />
                        <span>{card.metricDelta}</span>
                      </div>
                    )}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

