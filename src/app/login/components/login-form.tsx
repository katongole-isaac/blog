"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";

import config from "@/config/default.json";
import toast, { Toast } from "react-hot-toast";
import utils from "@/utils";
import ErrorToast from "@/app/d/components/errorToast";
import { useRouter } from "next/navigation";

interface Payload {
  username: string;
  password: string;
}

const login = async (payload: Payload) => {
  const { password, username } = payload;

  if (!password.trim() && username.trim()) return;

  return fetch(config.login, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) }).then(
    async (res) => {
      if (!res.ok) {
        const result = await res.json();
        throw new Error(`${result?.message}`);
      }

      return await res.json();
    }
  );
};

const LoginForm = ({ className, ...props }: React.ComponentPropsWithoutRef<"div">) => {
  const dashboardURL = "/d";

  const router = useRouter();
  const [payload, setPayload] = useState({
    username: "",
    password: "",
  });

  const { mutateAsync, data, isSuccess, error, reset, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
  });

  const handleSubmit: React.FormEventHandler = useCallback(
    (e) => {
      reset();
      e.preventDefault();

      try {
        toast.promise(
          mutateAsync({ ...payload, username: payload.username.trim() }),
          {
            loading: <span className="text-gray-400"> Loading..</span>,
            // error: (ex: any) => <span className="text-rose-600">{ex?.message || "Unable to publish this post. Please try again !"} </span>,
          },
          utils.toastPromiseDefaultConfig
        );
      } catch (ex: any) {
        console.error(ex?.message);
      }
    },
    [payload]
  );

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setPayload((prev) => ({ ...prev, [target.name]: target.value }));
  };

  useEffect(() => {
    if (isSuccess && data) router.push(dashboardURL);
  }, [isSuccess, data]);

  useEffect(() => {
    if (error) toast.custom((t: Toast) => <ErrorToast t={t} message={error?.message} />, { id: "login-error" });
  }, [error]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your username below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={payload.username}
                  name="username"
                  onChange={handleChange}
                  placeholder="my-username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" name="password" required value={payload.password} onChange={handleChange} />
              </div>
              <Button type="submit" className="w-full flex gap-3" disabled={isPending}>
                {isPending && <Loader className="animate-spin" />}
                <span>Login</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
