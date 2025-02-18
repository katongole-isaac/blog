import * as React from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  stats: number;
  description: string;
  icon?: React.ReactNode | (() => React.ReactNode);
}
const DashboardCard: React.FC<Props> = ({ description, stats, title, icon }) => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className={cn(`text-sm font-semibold flex items-center  justify-between`)}>
          {title}
          {typeof icon === "function" ? icon() : icon}
        </CardTitle>
        <CardTitle className={cn(`text-2xl`)}>{stats}</CardTitle>
        {description && <CardDescription>{description} </CardDescription>}
      </CardHeader>
    </Card>
  );
};

export default DashboardCard;
