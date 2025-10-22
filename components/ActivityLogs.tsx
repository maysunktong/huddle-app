"use client";

import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { getActivityLogs } from "../utils/supabase/queries";
import { NoPostElement } from "./NoPostElement";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";
import { User, Badge } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

export default function ActivityLogs() {
  const supabase = createClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);
    };
    getUser();
  });

  const { data, error } = useQuery({
    queryKey: ["activity-logs", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const { data, error } = await getActivityLogs(supabase, currentUserId);
      if (error) throw new Error(error.message);
      return data;
    },
    refetchOnMount: "always",
    refetchInterval: 3000,
    staleTime: 10000,
  });

  if (error)
    return <p className="text-red-500 text-center">Error loading posts</p>;
  if (!data) return;
  if (data.length === 0) return <NoPostElement title="No Activity Logs" subtext="You haven't created any actions in logs" />;

  return (
    <Card className="w-full max-w-3xl">
      <CardContent>
        <div className="h-80 w-full space-y-2 pr-2">
          {data &&
            data.map((item) => (
              <div key={item.id} className="flex items-start gap-2 py-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                      <p className="text-sm leading-5">
                        <span className="text-muted-foreground">
                          {item.action} --
                        </span>
                        <span className="font-medium">{item.entity}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          ID: {item.entity_id}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
