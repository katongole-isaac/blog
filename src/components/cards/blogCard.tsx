import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

type CardProps = React.ComponentProps<typeof Card> & { size?: "sm" | "lg" };

export default function BlogCard({ className, size = "sm", ...props }: CardProps) {
  if (size === "lg")
    return (
      <Card
        className={cn("cursor-pointer group w-full md:grid grid-cols-[1fr_350px] relative overflow-hidden border-gray-50 shadow", className)}
        {...props}
      >
        <div className={cn("min-h-48 relative border-r border-gray-50")}>
          <Image
            src="/images/default_image.png"
            alt="default_image"
            layout="fill"
            objectFit="cover"
            priority
            className="transition-all group-hover:scale-110 duration-300"
          />
        </div>
        <div className="">
          <CardHeader className={cn("relative h-auto flex flex-col gap-3 mb-2")}>
            <CardDescription className={cn("uppercase font-semibold text-xs")}>Qiuck release</CardDescription>
            <CardTitle className={cn("md:text-3xl")}>Apple reveals 2024's most downloaded apps and games</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className={cn("font-medium")}>{new Date().toDateString()} </CardDescription>
          </CardContent>
        </div>
      </Card>
    );

  return (
    <Card className={cn(" cursor-pointer group min-w-[320px] w-full relative overflow-hidden border-gray-50 shadow", className)} {...props}>
      <div className={cn("min-h-48 relative border-b border-gray-50")}>
        <Image
          src="/images/default_image.png"
          alt="default_image"
          layout="fill"
          objectFit="cover"
          priority
          className="transition-all group-hover:scale-110 duration-300"
        />
      </div>
      <CardHeader className={cn("relative  h-auto  flex flex-col gap-3 ")}>
        <CardDescription className={cn("uppercase font-semibold text-xs")}>Qiuck release</CardDescription>
        <CardTitle>Apple reveals 2024's most downloaded apps and games</CardTitle>
        <CardDescription className={cn("font-medium")}>{new Date().toDateString()} </CardDescription>
      </CardHeader>
    </Card>
  );
}
